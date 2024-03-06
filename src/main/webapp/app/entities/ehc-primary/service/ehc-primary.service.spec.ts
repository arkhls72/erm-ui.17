import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { EhcPrimary } from '../ehc-primary.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ehc-primary.test-samples';

import { EhcPrimaryService, RestEhcPrimary } from './ehc-primary.service';

const requireRestSample: RestEhcPrimary = {
  ...sampleWithRequiredData,
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('EhcPrimary Service', () => {
  let service: EhcPrimaryService;
  let httpMock: HttpTestingController;
  let expectedResult: EhcPrimary | EhcPrimary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EhcPrimaryService);
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

    it('should create a EhcPrimary', () => {
      const ehcPrimary = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ehcPrimary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EhcPrimary', () => {
      const ehcPrimary = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ehcPrimary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EhcPrimary', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EhcPrimary', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EhcPrimary', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEhcPrimaryToCollectionIfMissing', () => {
      it('should add a EhcPrimary to an empty array', () => {
        const ehcPrimary: EhcPrimary = sampleWithRequiredData;
        expectedResult = service.addEhcPrimaryToCollectionIfMissing([], ehcPrimary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ehcPrimary);
      });

      it('should not add a EhcPrimary to an array that contains it', () => {
        const ehcPrimary: EhcPrimary = sampleWithRequiredData;
        const ehcPrimaryCollection: EhcPrimary[] = [
          {
            ...ehcPrimary,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEhcPrimaryToCollectionIfMissing(ehcPrimaryCollection, ehcPrimary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EhcPrimary to an array that doesn't contain it", () => {
        const ehcPrimary: EhcPrimary = sampleWithRequiredData;
        const ehcPrimaryCollection: EhcPrimary[] = [sampleWithPartialData];
        expectedResult = service.addEhcPrimaryToCollectionIfMissing(ehcPrimaryCollection, ehcPrimary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ehcPrimary);
      });

      it('should add only unique EhcPrimary to an array', () => {
        const ehcPrimaryArray: EhcPrimary[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ehcPrimaryCollection: EhcPrimary[] = [sampleWithRequiredData];
        expectedResult = service.addEhcPrimaryToCollectionIfMissing(ehcPrimaryCollection, ...ehcPrimaryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ehcPrimary: EhcPrimary = sampleWithRequiredData;
        const ehcPrimary2: EhcPrimary = sampleWithPartialData;
        expectedResult = service.addEhcPrimaryToCollectionIfMissing([], ehcPrimary, ehcPrimary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ehcPrimary);
        expect(expectedResult).toContain(ehcPrimary2);
      });

      it('should accept null and undefined values', () => {
        const ehcPrimary: EhcPrimary = sampleWithRequiredData;
        expectedResult = service.addEhcPrimaryToCollectionIfMissing([], null, ehcPrimary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ehcPrimary);
      });

      it('should return initial array if no EhcPrimary is added', () => {
        const ehcPrimaryCollection: EhcPrimary[] = [sampleWithRequiredData];
        expectedResult = service.addEhcPrimaryToCollectionIfMissing(ehcPrimaryCollection, undefined, null);
        expect(expectedResult).toEqual(ehcPrimaryCollection);
      });
    });

    describe('compareEhcPrimary', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEhcPrimary(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEhcPrimary(entity1, entity2);
        const compareResult2 = service.compareEhcPrimary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEhcPrimary(entity1, entity2);
        const compareResult2 = service.compareEhcPrimary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEhcPrimary(entity1, entity2);
        const compareResult2 = service.compareEhcPrimary(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
