import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ClientInvoice } from '../client-invoice.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../client-invoice.test-samples';

import { ClientInvoiceService, RestClientInvoice } from './client-invoice.service';

const requireRestSample: RestClientInvoice = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ClientInvoice Service', () => {
  let service: ClientInvoiceService;
  let httpMock: HttpTestingController;
  let expectedResult: ClientInvoice | ClientInvoice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClientInvoiceService);
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

    it('should create a ClientInvoice', () => {
      const clientInvoice = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clientInvoice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClientInvoice', () => {
      const clientInvoice = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clientInvoice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClientInvoice', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClientInvoice', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClientInvoice', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClientInvoiceToCollectionIfMissing', () => {
      it('should add a ClientInvoice to an empty array', () => {
        const clientInvoice: ClientInvoice = sampleWithRequiredData;
        expectedResult = service.addClientInvoiceToCollectionIfMissing([], clientInvoice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientInvoice);
      });

      it('should not add a ClientInvoice to an array that contains it', () => {
        const clientInvoice: ClientInvoice = sampleWithRequiredData;
        const clientInvoiceCollection: ClientInvoice[] = [
          {
            ...clientInvoice,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClientInvoiceToCollectionIfMissing(clientInvoiceCollection, clientInvoice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClientInvoice to an array that doesn't contain it", () => {
        const clientInvoice: ClientInvoice = sampleWithRequiredData;
        const clientInvoiceCollection: ClientInvoice[] = [sampleWithPartialData];
        expectedResult = service.addClientInvoiceToCollectionIfMissing(clientInvoiceCollection, clientInvoice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientInvoice);
      });

      it('should add only unique ClientInvoice to an array', () => {
        const clientInvoiceArray: ClientInvoice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clientInvoiceCollection: ClientInvoice[] = [sampleWithRequiredData];
        expectedResult = service.addClientInvoiceToCollectionIfMissing(clientInvoiceCollection, ...clientInvoiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clientInvoice: ClientInvoice = sampleWithRequiredData;
        const clientInvoice2: ClientInvoice = sampleWithPartialData;
        expectedResult = service.addClientInvoiceToCollectionIfMissing([], clientInvoice, clientInvoice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientInvoice);
        expect(expectedResult).toContain(clientInvoice2);
      });

      it('should accept null and undefined values', () => {
        const clientInvoice: ClientInvoice = sampleWithRequiredData;
        expectedResult = service.addClientInvoiceToCollectionIfMissing([], null, clientInvoice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientInvoice);
      });

      it('should return initial array if no ClientInvoice is added', () => {
        const clientInvoiceCollection: ClientInvoice[] = [sampleWithRequiredData];
        expectedResult = service.addClientInvoiceToCollectionIfMissing(clientInvoiceCollection, undefined, null);
        expect(expectedResult).toEqual(clientInvoiceCollection);
      });
    });

    describe('compareClientInvoice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClientInvoice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClientInvoice(entity1, entity2);
        const compareResult2 = service.compareClientInvoice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClientInvoice(entity1, entity2);
        const compareResult2 = service.compareClientInvoice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClientInvoice(entity1, entity2);
        const compareResult2 = service.compareClientInvoice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
