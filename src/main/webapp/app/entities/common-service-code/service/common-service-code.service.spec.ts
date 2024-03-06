import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CommonServiceCode } from '../common-service-code.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../common-service-code.test-samples';

import { CommonServiceCodeService } from './common-service-code.service';

const requireRestSample: CommonServiceCode = {
  ...sampleWithRequiredData,
};

describe('CommonServiceCode Service', () => {
  let service: CommonServiceCodeService;
  let httpMock: HttpTestingController;
  let expectedResult: CommonServiceCode | CommonServiceCode[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CommonServiceCodeService);
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

    it('should create a CommonServiceCode', () => {
      const commonServiceCode = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(commonServiceCode).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CommonServiceCode', () => {
      const commonServiceCode = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(commonServiceCode).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CommonServiceCode', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CommonServiceCode', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CommonServiceCode', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCommonServiceCodeToCollectionIfMissing', () => {
      it('should add a CommonServiceCode to an empty array', () => {
        const commonServiceCode: CommonServiceCode = sampleWithRequiredData;
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing([], commonServiceCode);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(commonServiceCode);
      });

      it('should not add a CommonServiceCode to an array that contains it', () => {
        const commonServiceCode: CommonServiceCode = sampleWithRequiredData;
        const commonServiceCodeCollection: CommonServiceCode[] = [
          {
            ...commonServiceCode,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing(commonServiceCodeCollection, commonServiceCode);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CommonServiceCode to an array that doesn't contain it", () => {
        const commonServiceCode: CommonServiceCode = sampleWithRequiredData;
        const commonServiceCodeCollection: CommonServiceCode[] = [sampleWithPartialData];
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing(commonServiceCodeCollection, commonServiceCode);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(commonServiceCode);
      });

      it('should add only unique CommonServiceCode to an array', () => {
        const commonServiceCodeArray: CommonServiceCode[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const commonServiceCodeCollection: CommonServiceCode[] = [sampleWithRequiredData];
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing(commonServiceCodeCollection, ...commonServiceCodeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const commonServiceCode: CommonServiceCode = sampleWithRequiredData;
        const commonServiceCode2: CommonServiceCode = sampleWithPartialData;
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing([], commonServiceCode, commonServiceCode2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(commonServiceCode);
        expect(expectedResult).toContain(commonServiceCode2);
      });

      it('should accept null and undefined values', () => {
        const commonServiceCode: CommonServiceCode = sampleWithRequiredData;
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing([], null, commonServiceCode, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(commonServiceCode);
      });

      it('should return initial array if no CommonServiceCode is added', () => {
        const commonServiceCodeCollection: CommonServiceCode[] = [sampleWithRequiredData];
        expectedResult = service.addCommonServiceCodeToCollectionIfMissing(commonServiceCodeCollection, undefined, null);
        expect(expectedResult).toEqual(commonServiceCodeCollection);
      });
    });

    describe('compareCommonServiceCode', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCommonServiceCode(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCommonServiceCode(entity1, entity2);
        const compareResult2 = service.compareCommonServiceCode(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCommonServiceCode(entity1, entity2);
        const compareResult2 = service.compareCommonServiceCode(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCommonServiceCode(entity1, entity2);
        const compareResult2 = service.compareCommonServiceCode(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
