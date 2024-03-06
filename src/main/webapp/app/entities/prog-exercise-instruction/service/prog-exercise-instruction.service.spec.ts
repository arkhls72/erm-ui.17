import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProgExerciseInstruction } from '../prog-exercise-instruction.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../prog-exercise-instruction.test-samples';

import { ProgExerciseInstructionService, RestProgExerciseInstruction } from './prog-exercise-instruction.service';

const requireRestSample: RestProgExerciseInstruction = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ProgExerciseInstruction Service', () => {
  let service: ProgExerciseInstructionService;
  let httpMock: HttpTestingController;
  let expectedResult: ProgExerciseInstruction | ProgExerciseInstruction[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgExerciseInstructionService);
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

    it('should create a ProgExerciseInstruction', () => {
      const progExerciseInstruction = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(progExerciseInstruction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProgExerciseInstruction', () => {
      const progExerciseInstruction = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(progExerciseInstruction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProgExerciseInstruction', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProgExerciseInstruction', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProgExerciseInstruction', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProgExerciseInstructionToCollectionIfMissing', () => {
      it('should add a ProgExerciseInstruction to an empty array', () => {
        const progExerciseInstruction: ProgExerciseInstruction = sampleWithRequiredData;
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing([], progExerciseInstruction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progExerciseInstruction);
      });

      it('should not add a ProgExerciseInstruction to an array that contains it', () => {
        const progExerciseInstruction: ProgExerciseInstruction = sampleWithRequiredData;
        const progExerciseInstructionCollection: ProgExerciseInstruction[] = [
          {
            ...progExerciseInstruction,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing(
          progExerciseInstructionCollection,
          progExerciseInstruction,
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProgExerciseInstruction to an array that doesn't contain it", () => {
        const progExerciseInstruction: ProgExerciseInstruction = sampleWithRequiredData;
        const progExerciseInstructionCollection: ProgExerciseInstruction[] = [sampleWithPartialData];
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing(
          progExerciseInstructionCollection,
          progExerciseInstruction,
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progExerciseInstruction);
      });

      it('should add only unique ProgExerciseInstruction to an array', () => {
        const progExerciseInstructionArray: ProgExerciseInstruction[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const progExerciseInstructionCollection: ProgExerciseInstruction[] = [sampleWithRequiredData];
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing(
          progExerciseInstructionCollection,
          ...progExerciseInstructionArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const progExerciseInstruction: ProgExerciseInstruction = sampleWithRequiredData;
        const progExerciseInstruction2: ProgExerciseInstruction = sampleWithPartialData;
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing([], progExerciseInstruction, progExerciseInstruction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progExerciseInstruction);
        expect(expectedResult).toContain(progExerciseInstruction2);
      });

      it('should accept null and undefined values', () => {
        const progExerciseInstruction: ProgExerciseInstruction = sampleWithRequiredData;
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing([], null, progExerciseInstruction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progExerciseInstruction);
      });

      it('should return initial array if no ProgExerciseInstruction is added', () => {
        const progExerciseInstructionCollection: ProgExerciseInstruction[] = [sampleWithRequiredData];
        expectedResult = service.addProgExerciseInstructionToCollectionIfMissing(progExerciseInstructionCollection, undefined, null);
        expect(expectedResult).toEqual(progExerciseInstructionCollection);
      });
    });

    describe('compareProgExerciseInstruction', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProgExerciseInstruction(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProgExerciseInstruction(entity1, entity2);
        const compareResult2 = service.compareProgExerciseInstruction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProgExerciseInstruction(entity1, entity2);
        const compareResult2 = service.compareProgExerciseInstruction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProgExerciseInstruction(entity1, entity2);
        const compareResult2 = service.compareProgExerciseInstruction(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
