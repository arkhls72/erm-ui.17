import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FeeType } from '../fee-type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fee-type.test-samples';

import { FeeTypeService } from './fee-type.service';

const requireRestSample: FeeType = {
  ...sampleWithRequiredData,
};

describe('FeeType Service', () => {
  let service: FeeTypeService;
  let httpMock: HttpTestingController;
  let expectedResult: FeeType | FeeType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeeTypeService);
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

    it('should create a FeeType', () => {
      const feeType = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(feeType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FeeType', () => {
      const feeType = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(feeType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FeeType', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FeeType', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FeeType', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFeeTypeToCollectionIfMissing', () => {
      it('should add a FeeType to an empty array', () => {
        const feeType: FeeType = sampleWithRequiredData;
        expectedResult = service.addFeeTypeToCollectionIfMissing([], feeType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeType);
      });

      it('should not add a FeeType to an array that contains it', () => {
        const feeType: FeeType = sampleWithRequiredData;
        const feeTypeCollection: FeeType[] = [
          {
            ...feeType,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFeeTypeToCollectionIfMissing(feeTypeCollection, feeType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FeeType to an array that doesn't contain it", () => {
        const feeType: FeeType = sampleWithRequiredData;
        const feeTypeCollection: FeeType[] = [sampleWithPartialData];
        expectedResult = service.addFeeTypeToCollectionIfMissing(feeTypeCollection, feeType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeType);
      });

      it('should add only unique FeeType to an array', () => {
        const feeTypeArray: FeeType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const feeTypeCollection: FeeType[] = [sampleWithRequiredData];
        expectedResult = service.addFeeTypeToCollectionIfMissing(feeTypeCollection, ...feeTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const feeType: FeeType = sampleWithRequiredData;
        const feeType2: FeeType = sampleWithPartialData;
        expectedResult = service.addFeeTypeToCollectionIfMissing([], feeType, feeType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feeType);
        expect(expectedResult).toContain(feeType2);
      });

      it('should accept null and undefined values', () => {
        const feeType: FeeType = sampleWithRequiredData;
        expectedResult = service.addFeeTypeToCollectionIfMissing([], null, feeType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feeType);
      });

      it('should return initial array if no FeeType is added', () => {
        const feeTypeCollection: FeeType[] = [sampleWithRequiredData];
        expectedResult = service.addFeeTypeToCollectionIfMissing(feeTypeCollection, undefined, null);
        expect(expectedResult).toEqual(feeTypeCollection);
      });
    });

    describe('compareFeeType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFeeType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFeeType(entity1, entity2);
        const compareResult2 = service.compareFeeType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFeeType(entity1, entity2);
        const compareResult2 = service.compareFeeType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFeeType(entity1, entity2);
        const compareResult2 = service.compareFeeType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
