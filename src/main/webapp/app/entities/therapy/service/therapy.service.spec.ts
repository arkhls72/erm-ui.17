import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Therapy } from '../therapy.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../therapy.test-samples';

import { TherapyService } from './therapy.service';

const requireRestSample: Therapy = {
  ...sampleWithRequiredData,
};

describe('Therapy Service', () => {
  let service: TherapyService;
  let httpMock: HttpTestingController;
  let expectedResult: Therapy | Therapy[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TherapyService);
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

    it('should create a Therapy', () => {
      const therapy = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(therapy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Therapy', () => {
      const therapy = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(therapy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Therapy', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Therapy', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Therapy', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTherapyToCollectionIfMissing', () => {
      it('should add a Therapy to an empty array', () => {
        const therapy: Therapy = sampleWithRequiredData;
        expectedResult = service.addTherapyToCollectionIfMissing([], therapy);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(therapy);
      });

      it('should not add a Therapy to an array that contains it', () => {
        const therapy: Therapy = sampleWithRequiredData;
        const therapyCollection: Therapy[] = [
          {
            ...therapy,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTherapyToCollectionIfMissing(therapyCollection, therapy);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Therapy to an array that doesn't contain it", () => {
        const therapy: Therapy = sampleWithRequiredData;
        const therapyCollection: Therapy[] = [sampleWithPartialData];
        expectedResult = service.addTherapyToCollectionIfMissing(therapyCollection, therapy);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(therapy);
      });

      it('should add only unique Therapy to an array', () => {
        const therapyArray: Therapy[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const therapyCollection: Therapy[] = [sampleWithRequiredData];
        expectedResult = service.addTherapyToCollectionIfMissing(therapyCollection, ...therapyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const therapy: Therapy = sampleWithRequiredData;
        const therapy2: Therapy = sampleWithPartialData;
        expectedResult = service.addTherapyToCollectionIfMissing([], therapy, therapy2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(therapy);
        expect(expectedResult).toContain(therapy2);
      });

      it('should accept null and undefined values', () => {
        const therapy: Therapy = sampleWithRequiredData;
        expectedResult = service.addTherapyToCollectionIfMissing([], null, therapy, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(therapy);
      });

      it('should return initial array if no Therapy is added', () => {
        const therapyCollection: Therapy[] = [sampleWithRequiredData];
        expectedResult = service.addTherapyToCollectionIfMissing(therapyCollection, undefined, null);
        expect(expectedResult).toEqual(therapyCollection);
      });
    });

    describe('compareTherapy', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTherapy(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTherapy(entity1, entity2);
        const compareResult2 = service.compareTherapy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTherapy(entity1, entity2);
        const compareResult2 = service.compareTherapy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTherapy(entity1, entity2);
        const compareResult2 = service.compareTherapy(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
