import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EhcClient } from '../ehc-client.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ehc-client.test-samples';

import { EhcClientService, RestEhcClient } from './ehc-client.service';

const requireRestSample: RestEhcClient = {
  ...sampleWithRequiredData,
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  removedDate: sampleWithRequiredData.removedDate?.toJSON(),
  lastModfiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('EhcClient Service', () => {
  let service: EhcClientService;
  let httpMock: HttpTestingController;
  let expectedResult: EhcClient | EhcClient[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EhcClientService);
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

    it('should create a EhcClient', () => {
      const ehcClient = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ehcClient).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EhcClient', () => {
      const ehcClient = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ehcClient).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EhcClient', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EhcClient', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EhcClient', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEhcClientToCollectionIfMissing', () => {
      it('should add a EhcClient to an empty array', () => {
        const ehcClient: EhcClient = sampleWithRequiredData;
        expectedResult = service.addEhcClientToCollectionIfMissing([], ehcClient);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ehcClient);
      });

      it('should not add a EhcClient to an array that contains it', () => {
        const ehcClient: EhcClient = sampleWithRequiredData;
        const ehcClientCollection: EhcClient[] = [
          {
            ...ehcClient,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEhcClientToCollectionIfMissing(ehcClientCollection, ehcClient);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EhcClient to an array that doesn't contain it", () => {
        const ehcClient: EhcClient = sampleWithRequiredData;
        const ehcClientCollection: EhcClient[] = [sampleWithPartialData];
        expectedResult = service.addEhcClientToCollectionIfMissing(ehcClientCollection, ehcClient);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ehcClient);
      });

      it('should add only unique EhcClient to an array', () => {
        const ehcClientArray: EhcClient[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ehcClientCollection: EhcClient[] = [sampleWithRequiredData];
        expectedResult = service.addEhcClientToCollectionIfMissing(ehcClientCollection, ...ehcClientArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ehcClient: EhcClient = sampleWithRequiredData;
        const ehcClient2: EhcClient = sampleWithPartialData;
        expectedResult = service.addEhcClientToCollectionIfMissing([], ehcClient, ehcClient2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ehcClient);
        expect(expectedResult).toContain(ehcClient2);
      });

      it('should accept null and undefined values', () => {
        const ehcClient: EhcClient = sampleWithRequiredData;
        expectedResult = service.addEhcClientToCollectionIfMissing([], null, ehcClient, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ehcClient);
      });

      it('should return initial array if no EhcClient is added', () => {
        const ehcClientCollection: EhcClient[] = [sampleWithRequiredData];
        expectedResult = service.addEhcClientToCollectionIfMissing(ehcClientCollection, undefined, null);
        expect(expectedResult).toEqual(ehcClientCollection);
      });
    });

    describe('compareEhcClient', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEhcClient(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEhcClient(entity1, entity2);
        const compareResult2 = service.compareEhcClient(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEhcClient(entity1, entity2);
        const compareResult2 = service.compareEhcClient(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEhcClient(entity1, entity2);
        const compareResult2 = service.compareEhcClient(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
