import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Condition } from '../condition.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../condition.test-samples';

import { ConditionService } from './condition.service';

const requireRestSample: Condition = {
  ...sampleWithRequiredData,
};

describe('Condition Service', () => {
  let service: ConditionService;
  let httpMock: HttpTestingController;
  let expectedResult: Condition | Condition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConditionService);
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

    it('should create a Condition', () => {
      const condition = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(condition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Condition', () => {
      const condition = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(condition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Condition', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Condition', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Condition', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConditionToCollectionIfMissing', () => {
      it('should add a Condition to an empty array', () => {
        const condition: Condition = sampleWithRequiredData;
        expectedResult = service.addConditionToCollectionIfMissing([], condition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(condition);
      });

      it('should not add a Condition to an array that contains it', () => {
        const condition: Condition = sampleWithRequiredData;
        const conditionCollection: Condition[] = [
          {
            ...condition,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConditionToCollectionIfMissing(conditionCollection, condition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Condition to an array that doesn't contain it", () => {
        const condition: Condition = sampleWithRequiredData;
        const conditionCollection: Condition[] = [sampleWithPartialData];
        expectedResult = service.addConditionToCollectionIfMissing(conditionCollection, condition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(condition);
      });

      it('should add only unique Condition to an array', () => {
        const conditionArray: Condition[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const conditionCollection: Condition[] = [sampleWithRequiredData];
        expectedResult = service.addConditionToCollectionIfMissing(conditionCollection, ...conditionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const condition: Condition = sampleWithRequiredData;
        const condition2: Condition = sampleWithPartialData;
        expectedResult = service.addConditionToCollectionIfMissing([], condition, condition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(condition);
        expect(expectedResult).toContain(condition2);
      });

      it('should accept null and undefined values', () => {
        const condition: Condition = sampleWithRequiredData;
        expectedResult = service.addConditionToCollectionIfMissing([], null, condition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(condition);
      });

      it('should return initial array if no Condition is added', () => {
        const conditionCollection: Condition[] = [sampleWithRequiredData];
        expectedResult = service.addConditionToCollectionIfMissing(conditionCollection, undefined, null);
        expect(expectedResult).toEqual(conditionCollection);
      });
    });

    describe('compareCondition', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCondition(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCondition(entity1, entity2);
        const compareResult2 = service.compareCondition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCondition(entity1, entity2);
        const compareResult2 = service.compareCondition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCondition(entity1, entity2);
        const compareResult2 = service.compareCondition(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
