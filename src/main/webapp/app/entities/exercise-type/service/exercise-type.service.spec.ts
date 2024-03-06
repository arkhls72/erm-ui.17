import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExerciseType } from '../exercise-type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../exercise-type.test-samples';

import { ExerciseTypeService } from './exercise-type.service';

const requireRestSample: ExerciseType = {
  ...sampleWithRequiredData,
};

describe('ExerciseType Service', () => {
  let service: ExerciseTypeService;
  let httpMock: HttpTestingController;
  let expectedResult: ExerciseType | ExerciseType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExerciseTypeService);
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

    it('should create a ExerciseType', () => {
      const exerciseType = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(exerciseType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExerciseType', () => {
      const exerciseType = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(exerciseType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExerciseType', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExerciseType', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExerciseType', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExerciseTypeToCollectionIfMissing', () => {
      it('should add a ExerciseType to an empty array', () => {
        const exerciseType: ExerciseType = sampleWithRequiredData;
        expectedResult = service.addExerciseTypeToCollectionIfMissing([], exerciseType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerciseType);
      });

      it('should not add a ExerciseType to an array that contains it', () => {
        const exerciseType: ExerciseType = sampleWithRequiredData;
        const exerciseTypeCollection: ExerciseType[] = [
          {
            ...exerciseType,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExerciseTypeToCollectionIfMissing(exerciseTypeCollection, exerciseType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExerciseType to an array that doesn't contain it", () => {
        const exerciseType: ExerciseType = sampleWithRequiredData;
        const exerciseTypeCollection: ExerciseType[] = [sampleWithPartialData];
        expectedResult = service.addExerciseTypeToCollectionIfMissing(exerciseTypeCollection, exerciseType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerciseType);
      });

      it('should add only unique ExerciseType to an array', () => {
        const exerciseTypeArray: ExerciseType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const exerciseTypeCollection: ExerciseType[] = [sampleWithRequiredData];
        expectedResult = service.addExerciseTypeToCollectionIfMissing(exerciseTypeCollection, ...exerciseTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exerciseType: ExerciseType = sampleWithRequiredData;
        const exerciseType2: ExerciseType = sampleWithPartialData;
        expectedResult = service.addExerciseTypeToCollectionIfMissing([], exerciseType, exerciseType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerciseType);
        expect(expectedResult).toContain(exerciseType2);
      });

      it('should accept null and undefined values', () => {
        const exerciseType: ExerciseType = sampleWithRequiredData;
        expectedResult = service.addExerciseTypeToCollectionIfMissing([], null, exerciseType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerciseType);
      });

      it('should return initial array if no ExerciseType is added', () => {
        const exerciseTypeCollection: ExerciseType[] = [sampleWithRequiredData];
        expectedResult = service.addExerciseTypeToCollectionIfMissing(exerciseTypeCollection, undefined, null);
        expect(expectedResult).toEqual(exerciseTypeCollection);
      });
    });

    describe('compareExerciseType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExerciseType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExerciseType(entity1, entity2);
        const compareResult2 = service.compareExerciseType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExerciseType(entity1, entity2);
        const compareResult2 = service.compareExerciseType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExerciseType(entity1, entity2);
        const compareResult2 = service.compareExerciseType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
