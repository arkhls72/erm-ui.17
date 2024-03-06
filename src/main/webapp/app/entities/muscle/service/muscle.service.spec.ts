import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Muscle } from '../muscle.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../muscle.test-samples';

import { MuscleService } from './muscle.service';

const requireRestSample: Muscle = {
  ...sampleWithRequiredData,
};

describe('Muscle Service', () => {
  let service: MuscleService;
  let httpMock: HttpTestingController;
  let expectedResult: Muscle | Muscle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MuscleService);
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

    it('should create a Muscle', () => {
      const muscle = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(muscle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Muscle', () => {
      const muscle = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(muscle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Muscle', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Muscle', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Muscle', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMuscleToCollectionIfMissing', () => {
      it('should add a Muscle to an empty array', () => {
        const muscle: Muscle = sampleWithRequiredData;
        expectedResult = service.addMuscleToCollectionIfMissing([], muscle);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(muscle);
      });

      it('should not add a Muscle to an array that contains it', () => {
        const muscle: Muscle = sampleWithRequiredData;
        const muscleCollection: Muscle[] = [
          {
            ...muscle,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMuscleToCollectionIfMissing(muscleCollection, muscle);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Muscle to an array that doesn't contain it", () => {
        const muscle: Muscle = sampleWithRequiredData;
        const muscleCollection: Muscle[] = [sampleWithPartialData];
        expectedResult = service.addMuscleToCollectionIfMissing(muscleCollection, muscle);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(muscle);
      });

      it('should add only unique Muscle to an array', () => {
        const muscleArray: Muscle[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const muscleCollection: Muscle[] = [sampleWithRequiredData];
        expectedResult = service.addMuscleToCollectionIfMissing(muscleCollection, ...muscleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const muscle: Muscle = sampleWithRequiredData;
        const muscle2: Muscle = sampleWithPartialData;
        expectedResult = service.addMuscleToCollectionIfMissing([], muscle, muscle2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(muscle);
        expect(expectedResult).toContain(muscle2);
      });

      it('should accept null and undefined values', () => {
        const muscle: Muscle = sampleWithRequiredData;
        expectedResult = service.addMuscleToCollectionIfMissing([], null, muscle, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(muscle);
      });

      it('should return initial array if no Muscle is added', () => {
        const muscleCollection: Muscle[] = [sampleWithRequiredData];
        expectedResult = service.addMuscleToCollectionIfMissing(muscleCollection, undefined, null);
        expect(expectedResult).toEqual(muscleCollection);
      });
    });

    describe('compareMuscle', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMuscle(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMuscle(entity1, entity2);
        const compareResult2 = service.compareMuscle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMuscle(entity1, entity2);
        const compareResult2 = service.compareMuscle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMuscle(entity1, entity2);
        const compareResult2 = service.compareMuscle(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
