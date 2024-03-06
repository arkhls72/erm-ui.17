import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Ehc } from '../ehc.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ehc.test-samples';

import { EhcService, RestEhc } from './ehc.service';

const requireRestSample: RestEhc = {
  ...sampleWithRequiredData,
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Ehc Service', () => {
  let service: EhcService;
  let httpMock: HttpTestingController;
  let expectedResult: Ehc | Ehc[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EhcService);
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

    it('should create a Ehc', () => {
      const ehc = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ehc).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ehc', () => {
      const ehc = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ehc).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ehc', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ehc', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Ehc', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEhcToCollectionIfMissing', () => {
      it('should add a Ehc to an empty array', () => {
        const ehc: Ehc = sampleWithRequiredData;
        expectedResult = service.addEhcToCollectionIfMissing([], ehc);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ehc);
      });

      it('should not add a Ehc to an array that contains it', () => {
        const ehc: Ehc = sampleWithRequiredData;
        const ehcCollection: Ehc[] = [
          {
            ...ehc,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEhcToCollectionIfMissing(ehcCollection, ehc);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ehc to an array that doesn't contain it", () => {
        const ehc: Ehc = sampleWithRequiredData;
        const ehcCollection: Ehc[] = [sampleWithPartialData];
        expectedResult = service.addEhcToCollectionIfMissing(ehcCollection, ehc);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ehc);
      });

      it('should add only unique Ehc to an array', () => {
        const ehcArray: Ehc[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ehcCollection: Ehc[] = [sampleWithRequiredData];
        expectedResult = service.addEhcToCollectionIfMissing(ehcCollection, ...ehcArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ehc: Ehc = sampleWithRequiredData;
        const ehc2: Ehc = sampleWithPartialData;
        expectedResult = service.addEhcToCollectionIfMissing([], ehc, ehc2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ehc);
        expect(expectedResult).toContain(ehc2);
      });

      it('should accept null and undefined values', () => {
        const ehc: Ehc = sampleWithRequiredData;
        expectedResult = service.addEhcToCollectionIfMissing([], null, ehc, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ehc);
      });

      it('should return initial array if no Ehc is added', () => {
        const ehcCollection: Ehc[] = [sampleWithRequiredData];
        expectedResult = service.addEhcToCollectionIfMissing(ehcCollection, undefined, null);
        expect(expectedResult).toEqual(ehcCollection);
      });
    });

    describe('compareEhc', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEhc(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEhc(entity1, entity2);
        const compareResult2 = service.compareEhc(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEhc(entity1, entity2);
        const compareResult2 = service.compareEhc(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEhc(entity1, entity2);
        const compareResult2 = service.compareEhc(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
