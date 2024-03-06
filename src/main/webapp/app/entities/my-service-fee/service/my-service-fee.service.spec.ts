import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MyServiceFee } from '../my-service-fee.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../my-service-fee.test-samples';

import { MyServiceFeeService, RestMyServiceFee } from './my-service-fee.service';

const requireRestSample: RestMyServiceFee = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('MyServiceFee Service', () => {
  let service: MyServiceFeeService;
  let httpMock: HttpTestingController;
  let expectedResult: MyServiceFee | MyServiceFee[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MyServiceFeeService);
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

    it('should create a MyServiceFee', () => {
      const myServiceFee = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(myServiceFee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MyServiceFee', () => {
      const myServiceFee = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(myServiceFee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MyServiceFee', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MyServiceFee', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MyServiceFee', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMyServiceFeeToCollectionIfMissing', () => {
      it('should add a MyServiceFee to an empty array', () => {
        const myServiceFee: MyServiceFee = sampleWithRequiredData;
        expectedResult = service.addMyServiceFeeToCollectionIfMissing([], myServiceFee);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(myServiceFee);
      });

      it('should not add a MyServiceFee to an array that contains it', () => {
        const myServiceFee: MyServiceFee = sampleWithRequiredData;
        const myServiceFeeCollection: MyServiceFee[] = [
          {
            ...myServiceFee,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMyServiceFeeToCollectionIfMissing(myServiceFeeCollection, myServiceFee);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MyServiceFee to an array that doesn't contain it", () => {
        const myServiceFee: MyServiceFee = sampleWithRequiredData;
        const myServiceFeeCollection: MyServiceFee[] = [sampleWithPartialData];
        expectedResult = service.addMyServiceFeeToCollectionIfMissing(myServiceFeeCollection, myServiceFee);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(myServiceFee);
      });

      it('should add only unique MyServiceFee to an array', () => {
        const myServiceFeeArray: MyServiceFee[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const myServiceFeeCollection: MyServiceFee[] = [sampleWithRequiredData];
        expectedResult = service.addMyServiceFeeToCollectionIfMissing(myServiceFeeCollection, ...myServiceFeeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const myServiceFee: MyServiceFee = sampleWithRequiredData;
        const myServiceFee2: MyServiceFee = sampleWithPartialData;
        expectedResult = service.addMyServiceFeeToCollectionIfMissing([], myServiceFee, myServiceFee2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(myServiceFee);
        expect(expectedResult).toContain(myServiceFee2);
      });

      it('should accept null and undefined values', () => {
        const myServiceFee: MyServiceFee = sampleWithRequiredData;
        expectedResult = service.addMyServiceFeeToCollectionIfMissing([], null, myServiceFee, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(myServiceFee);
      });

      it('should return initial array if no MyServiceFee is added', () => {
        const myServiceFeeCollection: MyServiceFee[] = [sampleWithRequiredData];
        expectedResult = service.addMyServiceFeeToCollectionIfMissing(myServiceFeeCollection, undefined, null);
        expect(expectedResult).toEqual(myServiceFeeCollection);
      });
    });

    describe('compareMyServiceFee', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMyServiceFee(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMyServiceFee(entity1, entity2);
        const compareResult2 = service.compareMyServiceFee(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMyServiceFee(entity1, entity2);
        const compareResult2 = service.compareMyServiceFee(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMyServiceFee(entity1, entity2);
        const compareResult2 = service.compareMyServiceFee(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
