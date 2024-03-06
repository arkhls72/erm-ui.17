import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MyService } from '../my-service.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../my-service.test-samples';

import { MyServiceService, RestMyService } from './my-service.service';

const requireRestSample: RestMyService = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  createdBy: sampleWithRequiredData.createdBy?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('MyService Service', () => {
  let service: MyServiceService;
  let httpMock: HttpTestingController;
  let expectedResult: MyService | MyService[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MyServiceService);
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

    it('should create a MyService', () => {
      const myService = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(myService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MyService', () => {
      const myService = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(myService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MyService', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MyService', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MyService', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMyServiceToCollectionIfMissing', () => {
      it('should add a MyService to an empty array', () => {
        const myService: MyService = sampleWithRequiredData;
        expectedResult = service.addMyServiceToCollectionIfMissing([], myService);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(myService);
      });

      it('should not add a MyService to an array that contains it', () => {
        const myService: MyService = sampleWithRequiredData;
        const myServiceCollection: MyService[] = [
          {
            ...myService,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMyServiceToCollectionIfMissing(myServiceCollection, myService);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MyService to an array that doesn't contain it", () => {
        const myService: MyService = sampleWithRequiredData;
        const myServiceCollection: MyService[] = [sampleWithPartialData];
        expectedResult = service.addMyServiceToCollectionIfMissing(myServiceCollection, myService);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(myService);
      });

      it('should add only unique MyService to an array', () => {
        const myServiceArray: MyService[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const myServiceCollection: MyService[] = [sampleWithRequiredData];
        expectedResult = service.addMyServiceToCollectionIfMissing(myServiceCollection, ...myServiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const myService: MyService = sampleWithRequiredData;
        const myService2: MyService = sampleWithPartialData;
        expectedResult = service.addMyServiceToCollectionIfMissing([], myService, myService2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(myService);
        expect(expectedResult).toContain(myService2);
      });

      it('should accept null and undefined values', () => {
        const myService: MyService = sampleWithRequiredData;
        expectedResult = service.addMyServiceToCollectionIfMissing([], null, myService, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(myService);
      });

      it('should return initial array if no MyService is added', () => {
        const myServiceCollection: MyService[] = [sampleWithRequiredData];
        expectedResult = service.addMyServiceToCollectionIfMissing(myServiceCollection, undefined, null);
        expect(expectedResult).toEqual(myServiceCollection);
      });
    });

    describe('compareMyService', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMyService(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMyService(entity1, entity2);
        const compareResult2 = service.compareMyService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMyService(entity1, entity2);
        const compareResult2 = service.compareMyService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMyService(entity1, entity2);
        const compareResult2 = service.compareMyService(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
