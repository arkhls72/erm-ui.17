import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Medical } from '../medical.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../medical.test-samples';

import { MedicalService } from './medical.service';

const requireRestSample: Medical = {
  ...sampleWithRequiredData,
};

describe('Medical Service', () => {
  let service: MedicalService;
  let httpMock: HttpTestingController;
  let expectedResult: Medical | Medical[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MedicalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Medical', () => {
      const medical = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(medical).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Medical', () => {
      const medical = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(medical).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Medical', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Medical', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Medical', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMedicalToCollectionIfMissing', () => {
      it('should add a Medical to an empty array', () => {
        const medical: Medical = sampleWithRequiredData;
        expectedResult = service.addMedicalToCollectionIfMissing([], medical);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medical);
      });

      it('should not add a Medical to an array that contains it', () => {
        const medical: Medical = sampleWithRequiredData;
        const medicalCollection: Medical[] = [
          {
            ...medical,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMedicalToCollectionIfMissing(medicalCollection, medical);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Medical to an array that doesn't contain it", () => {
        const medical: Medical = sampleWithRequiredData;
        const medicalCollection: Medical[] = [sampleWithPartialData];
        expectedResult = service.addMedicalToCollectionIfMissing(medicalCollection, medical);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medical);
      });

      it('should add only unique Medical to an array', () => {
        const medicalArray: Medical[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const medicalCollection: Medical[] = [sampleWithRequiredData];
        expectedResult = service.addMedicalToCollectionIfMissing(medicalCollection, ...medicalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const medical: Medical = sampleWithRequiredData;
        const medical2: Medical = sampleWithPartialData;
        expectedResult = service.addMedicalToCollectionIfMissing([], medical, medical2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medical);
        expect(expectedResult).toContain(medical2);
      });

      it('should accept null and undefined values', () => {
        const medical: Medical = sampleWithRequiredData;
        expectedResult = service.addMedicalToCollectionIfMissing([], null, medical, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medical);
      });

      it('should return initial array if no Medical is added', () => {
        const medicalCollection: Medical[] = [sampleWithRequiredData];
        expectedResult = service.addMedicalToCollectionIfMissing(medicalCollection, undefined, null);
        expect(expectedResult).toEqual(medicalCollection);
      });
    });

    describe('compareMedical', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMedical(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMedical(entity1, entity2);
        const compareResult2 = service.compareMedical(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMedical(entity1, entity2);
        const compareResult2 = service.compareMedical(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMedical(entity1, entity2);
        const compareResult2 = service.compareMedical(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
