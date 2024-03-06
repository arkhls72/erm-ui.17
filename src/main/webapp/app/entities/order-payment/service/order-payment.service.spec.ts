import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OrderPayment } from '../order-payment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../order-payment.test-samples';

import { OrderPaymentService, RestOrderPayment } from './order-payment.service';

const requireRestSample: RestOrderPayment = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('OrderPayment Service', () => {
  let service: OrderPaymentService;
  let httpMock: HttpTestingController;
  let expectedResult: OrderPayment | OrderPayment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrderPaymentService);
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

    it('should create a OrderPayment', () => {
      const orderPayment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(orderPayment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrderPayment', () => {
      const orderPayment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(orderPayment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrderPayment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrderPayment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OrderPayment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrderPaymentToCollectionIfMissing', () => {
      it('should add a OrderPayment to an empty array', () => {
        const orderPayment: OrderPayment = sampleWithRequiredData;
        expectedResult = service.addOrderPaymentToCollectionIfMissing([], orderPayment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderPayment);
      });

      it('should not add a OrderPayment to an array that contains it', () => {
        const orderPayment: OrderPayment = sampleWithRequiredData;
        const orderPaymentCollection: OrderPayment[] = [
          {
            ...orderPayment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrderPaymentToCollectionIfMissing(orderPaymentCollection, orderPayment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrderPayment to an array that doesn't contain it", () => {
        const orderPayment: OrderPayment = sampleWithRequiredData;
        const orderPaymentCollection: OrderPayment[] = [sampleWithPartialData];
        expectedResult = service.addOrderPaymentToCollectionIfMissing(orderPaymentCollection, orderPayment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderPayment);
      });

      it('should add only unique OrderPayment to an array', () => {
        const orderPaymentArray: OrderPayment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orderPaymentCollection: OrderPayment[] = [sampleWithRequiredData];
        expectedResult = service.addOrderPaymentToCollectionIfMissing(orderPaymentCollection, ...orderPaymentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orderPayment: OrderPayment = sampleWithRequiredData;
        const orderPayment2: OrderPayment = sampleWithPartialData;
        expectedResult = service.addOrderPaymentToCollectionIfMissing([], orderPayment, orderPayment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderPayment);
        expect(expectedResult).toContain(orderPayment2);
      });

      it('should accept null and undefined values', () => {
        const orderPayment: OrderPayment = sampleWithRequiredData;
        expectedResult = service.addOrderPaymentToCollectionIfMissing([], null, orderPayment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderPayment);
      });

      it('should return initial array if no OrderPayment is added', () => {
        const orderPaymentCollection: OrderPayment[] = [sampleWithRequiredData];
        expectedResult = service.addOrderPaymentToCollectionIfMissing(orderPaymentCollection, undefined, null);
        expect(expectedResult).toEqual(orderPaymentCollection);
      });
    });

    describe('compareOrderPayment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrderPayment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrderPayment(entity1, entity2);
        const compareResult2 = service.compareOrderPayment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrderPayment(entity1, entity2);
        const compareResult2 = service.compareOrderPayment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrderPayment(entity1, entity2);
        const compareResult2 = service.compareOrderPayment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
