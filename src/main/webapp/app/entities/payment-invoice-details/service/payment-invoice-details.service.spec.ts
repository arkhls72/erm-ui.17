import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaymentInvoiceDetails } from '../payment-invoice-details.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../payment-invoice-details.test-samples';

import { PaymentInvoiceDetailsService, RestPaymentInvoiceDetails } from './payment-invoice-details.service';

const requireRestSample: RestPaymentInvoiceDetails = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('PaymentInvoiceDetails Service', () => {
  let service: PaymentInvoiceDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: PaymentInvoiceDetails | PaymentInvoiceDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaymentInvoiceDetailsService);
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

    it('should create a PaymentInvoiceDetails', () => {
      const paymentInvoiceDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(paymentInvoiceDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PaymentInvoiceDetails', () => {
      const paymentInvoiceDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(paymentInvoiceDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PaymentInvoiceDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PaymentInvoiceDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PaymentInvoiceDetails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPaymentInvoiceDetailsToCollectionIfMissing', () => {
      it('should add a PaymentInvoiceDetails to an empty array', () => {
        const paymentInvoiceDetails: PaymentInvoiceDetails = sampleWithRequiredData;
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing([], paymentInvoiceDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentInvoiceDetails);
      });

      it('should not add a PaymentInvoiceDetails to an array that contains it', () => {
        const paymentInvoiceDetails: PaymentInvoiceDetails = sampleWithRequiredData;
        const paymentInvoiceDetailsCollection: PaymentInvoiceDetails[] = [
          {
            ...paymentInvoiceDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing(paymentInvoiceDetailsCollection, paymentInvoiceDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PaymentInvoiceDetails to an array that doesn't contain it", () => {
        const paymentInvoiceDetails: PaymentInvoiceDetails = sampleWithRequiredData;
        const paymentInvoiceDetailsCollection: PaymentInvoiceDetails[] = [sampleWithPartialData];
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing(paymentInvoiceDetailsCollection, paymentInvoiceDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentInvoiceDetails);
      });

      it('should add only unique PaymentInvoiceDetails to an array', () => {
        const paymentInvoiceDetailsArray: PaymentInvoiceDetails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const paymentInvoiceDetailsCollection: PaymentInvoiceDetails[] = [sampleWithRequiredData];
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing(
          paymentInvoiceDetailsCollection,
          ...paymentInvoiceDetailsArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paymentInvoiceDetails: PaymentInvoiceDetails = sampleWithRequiredData;
        const paymentInvoiceDetails2: PaymentInvoiceDetails = sampleWithPartialData;
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing([], paymentInvoiceDetails, paymentInvoiceDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentInvoiceDetails);
        expect(expectedResult).toContain(paymentInvoiceDetails2);
      });

      it('should accept null and undefined values', () => {
        const paymentInvoiceDetails: PaymentInvoiceDetails = sampleWithRequiredData;
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing([], null, paymentInvoiceDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentInvoiceDetails);
      });

      it('should return initial array if no PaymentInvoiceDetails is added', () => {
        const paymentInvoiceDetailsCollection: PaymentInvoiceDetails[] = [sampleWithRequiredData];
        expectedResult = service.addPaymentInvoiceDetailsToCollectionIfMissing(paymentInvoiceDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(paymentInvoiceDetailsCollection);
      });
    });

    describe('comparePaymentInvoiceDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePaymentInvoiceDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePaymentInvoiceDetails(entity1, entity2);
        const compareResult2 = service.comparePaymentInvoiceDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePaymentInvoiceDetails(entity1, entity2);
        const compareResult2 = service.comparePaymentInvoiceDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePaymentInvoiceDetails(entity1, entity2);
        const compareResult2 = service.comparePaymentInvoiceDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
