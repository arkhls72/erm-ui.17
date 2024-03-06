import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExerciseLevel } from '../exercise-level.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../exercise-level.test-samples';

import { ExerciseLevelService } from './exercise-level.service';

const requireRestSample: ExerciseLevel = {
  ...sampleWithRequiredData,
};

describe('ExerciseLevel Service', () => {
  let service: ExerciseLevelService;
  let httpMock: HttpTestingController;
  let expectedResult: ExerciseLevel | ExerciseLevel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExerciseLevelService);
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

    it('should create a ExerciseLevel', () => {
      const exerciseLevel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(exerciseLevel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExerciseLevel', () => {
      const exerciseLevel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(exerciseLevel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExerciseLevel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExerciseLevel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExerciseLevel', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExerciseLevelToCollectionIfMissing', () => {
      it('should add a ExerciseLevel to an empty array', () => {
        const exerciseLevel: ExerciseLevel = sampleWithRequiredData;
        expectedResult = service.addExerciseLevelToCollectionIfMissing([], exerciseLevel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerciseLevel);
      });

      it('should not add a ExerciseLevel to an array that contains it', () => {
        const exerciseLevel: ExerciseLevel = sampleWithRequiredData;
        const exerciseLevelCollection: ExerciseLevel[] = [
          {
            ...exerciseLevel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExerciseLevelToCollectionIfMissing(exerciseLevelCollection, exerciseLevel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExerciseLevel to an array that doesn't contain it", () => {
        const exerciseLevel: ExerciseLevel = sampleWithRequiredData;
        const exerciseLevelCollection: ExerciseLevel[] = [sampleWithPartialData];
        expectedResult = service.addExerciseLevelToCollectionIfMissing(exerciseLevelCollection, exerciseLevel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerciseLevel);
      });

      it('should add only unique ExerciseLevel to an array', () => {
        const exerciseLevelArray: ExerciseLevel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const exerciseLevelCollection: ExerciseLevel[] = [sampleWithRequiredData];
        expectedResult = service.addExerciseLevelToCollectionIfMissing(exerciseLevelCollection, ...exerciseLevelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exerciseLevel: ExerciseLevel = sampleWithRequiredData;
        const exerciseLevel2: ExerciseLevel = sampleWithPartialData;
        expectedResult = service.addExerciseLevelToCollectionIfMissing([], exerciseLevel, exerciseLevel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerciseLevel);
        expect(expectedResult).toContain(exerciseLevel2);
      });

      it('should accept null and undefined values', () => {
        const exerciseLevel: ExerciseLevel = sampleWithRequiredData;
        expectedResult = service.addExerciseLevelToCollectionIfMissing([], null, exerciseLevel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerciseLevel);
      });

      it('should return initial array if no ExerciseLevel is added', () => {
        const exerciseLevelCollection: ExerciseLevel[] = [sampleWithRequiredData];
        expectedResult = service.addExerciseLevelToCollectionIfMissing(exerciseLevelCollection, undefined, null);
        expect(expectedResult).toEqual(exerciseLevelCollection);
      });
    });

    describe('compareExerciseLevel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExerciseLevel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExerciseLevel(entity1, entity2);
        const compareResult2 = service.compareExerciseLevel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExerciseLevel(entity1, entity2);
        const compareResult2 = service.compareExerciseLevel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExerciseLevel(entity1, entity2);
        const compareResult2 = service.compareExerciseLevel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
