import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExerciseTool } from '../exercise-tool.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../exercise-tool.test-samples';

import { ExerciseToolService } from './exercise-tool.service';

const requireRestSample: ExerciseTool = {
  ...sampleWithRequiredData,
};

describe('ExerciseTool Service', () => {
  let service: ExerciseToolService;
  let httpMock: HttpTestingController;
  let expectedResult: ExerciseTool | ExerciseTool[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExerciseToolService);
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

    it('should create a ExerciseTool', () => {
      const exerciseTool = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(exerciseTool).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExerciseTool', () => {
      const exerciseTool = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(exerciseTool).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExerciseTool', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExerciseTool', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExerciseTool', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExerciseToolToCollectionIfMissing', () => {
      it('should add a ExerciseTool to an empty array', () => {
        const exerciseTool: ExerciseTool = sampleWithRequiredData;
        expectedResult = service.addExerciseToolToCollectionIfMissing([], exerciseTool);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerciseTool);
      });

      it('should not add a ExerciseTool to an array that contains it', () => {
        const exerciseTool: ExerciseTool = sampleWithRequiredData;
        const exerciseToolCollection: ExerciseTool[] = [
          {
            ...exerciseTool,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExerciseToolToCollectionIfMissing(exerciseToolCollection, exerciseTool);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExerciseTool to an array that doesn't contain it", () => {
        const exerciseTool: ExerciseTool = sampleWithRequiredData;
        const exerciseToolCollection: ExerciseTool[] = [sampleWithPartialData];
        expectedResult = service.addExerciseToolToCollectionIfMissing(exerciseToolCollection, exerciseTool);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerciseTool);
      });

      it('should add only unique ExerciseTool to an array', () => {
        const exerciseToolArray: ExerciseTool[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const exerciseToolCollection: ExerciseTool[] = [sampleWithRequiredData];
        expectedResult = service.addExerciseToolToCollectionIfMissing(exerciseToolCollection, ...exerciseToolArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exerciseTool: ExerciseTool = sampleWithRequiredData;
        const exerciseTool2: ExerciseTool = sampleWithPartialData;
        expectedResult = service.addExerciseToolToCollectionIfMissing([], exerciseTool, exerciseTool2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerciseTool);
        expect(expectedResult).toContain(exerciseTool2);
      });

      it('should accept null and undefined values', () => {
        const exerciseTool: ExerciseTool = sampleWithRequiredData;
        expectedResult = service.addExerciseToolToCollectionIfMissing([], null, exerciseTool, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerciseTool);
      });

      it('should return initial array if no ExerciseTool is added', () => {
        const exerciseToolCollection: ExerciseTool[] = [sampleWithRequiredData];
        expectedResult = service.addExerciseToolToCollectionIfMissing(exerciseToolCollection, undefined, null);
        expect(expectedResult).toEqual(exerciseToolCollection);
      });
    });

    describe('compareExerciseTool', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExerciseTool(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExerciseTool(entity1, entity2);
        const compareResult2 = service.compareExerciseTool(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExerciseTool(entity1, entity2);
        const compareResult2 = service.compareExerciseTool(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExerciseTool(entity1, entity2);
        const compareResult2 = service.compareExerciseTool(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
