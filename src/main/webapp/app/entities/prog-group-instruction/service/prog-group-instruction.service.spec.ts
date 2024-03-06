import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProgGroupInstruction } from '../prog-group-instruction.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../prog-group-instruction.test-samples';

import { ProgGroupInstructionService, RestProgGroupInstruction } from './prog-group-instruction.service';

const requireRestSample: RestProgGroupInstruction = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ProgGroupInstruction Service', () => {
  let service: ProgGroupInstructionService;
  let httpMock: HttpTestingController;
  let expectedResult: ProgGroupInstruction | ProgGroupInstruction[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgGroupInstructionService);
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

    it('should create a ProgGroupInstruction', () => {
      const progGroupInstruction = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(progGroupInstruction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProgGroupInstruction', () => {
      const progGroupInstruction = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(progGroupInstruction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProgGroupInstruction', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProgGroupInstruction', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProgGroupInstruction', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProgGroupInstructionToCollectionIfMissing', () => {
      it('should add a ProgGroupInstruction to an empty array', () => {
        const progGroupInstruction: ProgGroupInstruction = sampleWithRequiredData;
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing([], progGroupInstruction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progGroupInstruction);
      });

      it('should not add a ProgGroupInstruction to an array that contains it', () => {
        const progGroupInstruction: ProgGroupInstruction = sampleWithRequiredData;
        const progGroupInstructionCollection: ProgGroupInstruction[] = [
          {
            ...progGroupInstruction,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing(progGroupInstructionCollection, progGroupInstruction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProgGroupInstruction to an array that doesn't contain it", () => {
        const progGroupInstruction: ProgGroupInstruction = sampleWithRequiredData;
        const progGroupInstructionCollection: ProgGroupInstruction[] = [sampleWithPartialData];
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing(progGroupInstructionCollection, progGroupInstruction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progGroupInstruction);
      });

      it('should add only unique ProgGroupInstruction to an array', () => {
        const progGroupInstructionArray: ProgGroupInstruction[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const progGroupInstructionCollection: ProgGroupInstruction[] = [sampleWithRequiredData];
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing(progGroupInstructionCollection, ...progGroupInstructionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const progGroupInstruction: ProgGroupInstruction = sampleWithRequiredData;
        const progGroupInstruction2: ProgGroupInstruction = sampleWithPartialData;
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing([], progGroupInstruction, progGroupInstruction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progGroupInstruction);
        expect(expectedResult).toContain(progGroupInstruction2);
      });

      it('should accept null and undefined values', () => {
        const progGroupInstruction: ProgGroupInstruction = sampleWithRequiredData;
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing([], null, progGroupInstruction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progGroupInstruction);
      });

      it('should return initial array if no ProgGroupInstruction is added', () => {
        const progGroupInstructionCollection: ProgGroupInstruction[] = [sampleWithRequiredData];
        expectedResult = service.addProgGroupInstructionToCollectionIfMissing(progGroupInstructionCollection, undefined, null);
        expect(expectedResult).toEqual(progGroupInstructionCollection);
      });
    });

    describe('compareProgGroupInstruction', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProgGroupInstruction(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProgGroupInstruction(entity1, entity2);
        const compareResult2 = service.compareProgGroupInstruction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProgGroupInstruction(entity1, entity2);
        const compareResult2 = service.compareProgGroupInstruction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProgGroupInstruction(entity1, entity2);
        const compareResult2 = service.compareProgGroupInstruction(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
