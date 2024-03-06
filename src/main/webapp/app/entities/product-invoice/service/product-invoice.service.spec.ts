import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductInvoice } from '../product-invoice.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-invoice.test-samples';

import { ProductInvoiceService, RestProductInvoice } from './product-invoice.service';

const requireRestSample: RestProductInvoice = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ProductInvoice Service', () => {
  let service: ProductInvoiceService;
  let httpMock: HttpTestingController;
  let expectedResult: ProductInvoice | ProductInvoice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductInvoiceService);
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

    it('should create a ProductInvoice', () => {
      const productInvoice = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productInvoice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductInvoice', () => {
      const productInvoice = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productInvoice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductInvoice', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductInvoice', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductInvoice', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductInvoiceToCollectionIfMissing', () => {
      it('should add a ProductInvoice to an empty array', () => {
        const productInvoice: ProductInvoice = sampleWithRequiredData;
        expectedResult = service.addProductInvoiceToCollectionIfMissing([], productInvoice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productInvoice);
      });

      it('should not add a ProductInvoice to an array that contains it', () => {
        const productInvoice: ProductInvoice = sampleWithRequiredData;
        const productInvoiceCollection: ProductInvoice[] = [
          {
            ...productInvoice,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductInvoiceToCollectionIfMissing(productInvoiceCollection, productInvoice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductInvoice to an array that doesn't contain it", () => {
        const productInvoice: ProductInvoice = sampleWithRequiredData;
        const productInvoiceCollection: ProductInvoice[] = [sampleWithPartialData];
        expectedResult = service.addProductInvoiceToCollectionIfMissing(productInvoiceCollection, productInvoice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productInvoice);
      });

      it('should add only unique ProductInvoice to an array', () => {
        const productInvoiceArray: ProductInvoice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productInvoiceCollection: ProductInvoice[] = [sampleWithRequiredData];
        expectedResult = service.addProductInvoiceToCollectionIfMissing(productInvoiceCollection, ...productInvoiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productInvoice: ProductInvoice = sampleWithRequiredData;
        const productInvoice2: ProductInvoice = sampleWithPartialData;
        expectedResult = service.addProductInvoiceToCollectionIfMissing([], productInvoice, productInvoice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productInvoice);
        expect(expectedResult).toContain(productInvoice2);
      });

      it('should accept null and undefined values', () => {
        const productInvoice: ProductInvoice = sampleWithRequiredData;
        expectedResult = service.addProductInvoiceToCollectionIfMissing([], null, productInvoice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productInvoice);
      });

      it('should return initial array if no ProductInvoice is added', () => {
        const productInvoiceCollection: ProductInvoice[] = [sampleWithRequiredData];
        expectedResult = service.addProductInvoiceToCollectionIfMissing(productInvoiceCollection, undefined, null);
        expect(expectedResult).toEqual(productInvoiceCollection);
      });
    });

    describe('compareProductInvoice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductInvoice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductInvoice(entity1, entity2);
        const compareResult2 = service.compareProductInvoice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductInvoice(entity1, entity2);
        const compareResult2 = service.compareProductInvoice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductInvoice(entity1, entity2);
        const compareResult2 = service.compareProductInvoice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
