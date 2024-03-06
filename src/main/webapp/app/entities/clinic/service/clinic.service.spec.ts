import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Clinic } from '../clinic.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../clinic.test-samples';

import { ClinicService, RestClinic } from './clinic.service';

const requireRestSample: RestClinic = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Clinic Service', () => {
  let service: ClinicService;
  let httpMock: HttpTestingController;
  let expectedResult: Clinic | Clinic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClinicService);
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

    it('should create a Clinic', () => {
      const clinic = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clinic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Clinic', () => {
      const clinic = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clinic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Clinic', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Clinic', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Clinic', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClinicToCollectionIfMissing', () => {
      it('should add a Clinic to an empty array', () => {
        const clinic: Clinic = sampleWithRequiredData;
        expectedResult = service.addClinicToCollectionIfMissing([], clinic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clinic);
      });

      it('should not add a Clinic to an array that contains it', () => {
        const clinic: Clinic = sampleWithRequiredData;
        const clinicCollection: Clinic[] = [
          {
            ...clinic,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClinicToCollectionIfMissing(clinicCollection, clinic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Clinic to an array that doesn't contain it", () => {
        const clinic: Clinic = sampleWithRequiredData;
        const clinicCollection: Clinic[] = [sampleWithPartialData];
        expectedResult = service.addClinicToCollectionIfMissing(clinicCollection, clinic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clinic);
      });

      it('should add only unique Clinic to an array', () => {
        const clinicArray: Clinic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clinicCollection: Clinic[] = [sampleWithRequiredData];
        expectedResult = service.addClinicToCollectionIfMissing(clinicCollection, ...clinicArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clinic: Clinic = sampleWithRequiredData;
        const clinic2: Clinic = sampleWithPartialData;
        expectedResult = service.addClinicToCollectionIfMissing([], clinic, clinic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clinic);
        expect(expectedResult).toContain(clinic2);
      });

      it('should accept null and undefined values', () => {
        const clinic: Clinic = sampleWithRequiredData;
        expectedResult = service.addClinicToCollectionIfMissing([], null, clinic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clinic);
      });

      it('should return initial array if no Clinic is added', () => {
        const clinicCollection: Clinic[] = [sampleWithRequiredData];
        expectedResult = service.addClinicToCollectionIfMissing(clinicCollection, undefined, null);
        expect(expectedResult).toEqual(clinicCollection);
      });
    });

    describe('compareClinic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClinic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClinic(entity1, entity2);
        const compareResult2 = service.compareClinic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClinic(entity1, entity2);
        const compareResult2 = service.compareClinic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClinic(entity1, entity2);
        const compareResult2 = service.compareClinic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
