import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExerGroupDetaill } from '../exer-group-detaill.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../exer-group-detaill.test-samples';

import { ExerGroupDetaillService, RestExerGroupDetaill } from './exer-group-detaill.service';

const requireRestSample: RestExerGroupDetaill = {
  ...sampleWithRequiredData,
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('ExerGroupDetaill Service', () => {
  let service: ExerGroupDetaillService;
  let httpMock: HttpTestingController;
  let expectedResult: ExerGroupDetaill | ExerGroupDetaill[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExerGroupDetaillService);
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

    it('should create a ExerGroupDetaill', () => {
      const exerGroupDetaill = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(exerGroupDetaill).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExerGroupDetaill', () => {
      const exerGroupDetaill = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(exerGroupDetaill).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExerGroupDetaill', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExerGroupDetaill', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExerGroupDetaill', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExerGroupDetaillToCollectionIfMissing', () => {
      it('should add a ExerGroupDetaill to an empty array', () => {
        const exerGroupDetaill: ExerGroupDetaill = sampleWithRequiredData;
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing([], exerGroupDetaill);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerGroupDetaill);
      });

      it('should not add a ExerGroupDetaill to an array that contains it', () => {
        const exerGroupDetaill: ExerGroupDetaill = sampleWithRequiredData;
        const exerGroupDetaillCollection: ExerGroupDetaill[] = [
          {
            ...exerGroupDetaill,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing(exerGroupDetaillCollection, exerGroupDetaill);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExerGroupDetaill to an array that doesn't contain it", () => {
        const exerGroupDetaill: ExerGroupDetaill = sampleWithRequiredData;
        const exerGroupDetaillCollection: ExerGroupDetaill[] = [sampleWithPartialData];
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing(exerGroupDetaillCollection, exerGroupDetaill);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerGroupDetaill);
      });

      it('should add only unique ExerGroupDetaill to an array', () => {
        const exerGroupDetaillArray: ExerGroupDetaill[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const exerGroupDetaillCollection: ExerGroupDetaill[] = [sampleWithRequiredData];
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing(exerGroupDetaillCollection, ...exerGroupDetaillArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exerGroupDetaill: ExerGroupDetaill = sampleWithRequiredData;
        const exerGroupDetaill2: ExerGroupDetaill = sampleWithPartialData;
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing([], exerGroupDetaill, exerGroupDetaill2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerGroupDetaill);
        expect(expectedResult).toContain(exerGroupDetaill2);
      });

      it('should accept null and undefined values', () => {
        const exerGroupDetaill: ExerGroupDetaill = sampleWithRequiredData;
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing([], null, exerGroupDetaill, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerGroupDetaill);
      });

      it('should return initial array if no ExerGroupDetaill is added', () => {
        const exerGroupDetaillCollection: ExerGroupDetaill[] = [sampleWithRequiredData];
        expectedResult = service.addExerGroupDetaillToCollectionIfMissing(exerGroupDetaillCollection, undefined, null);
        expect(expectedResult).toEqual(exerGroupDetaillCollection);
      });
    });

    describe('compareExerGroupDetaill', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExerGroupDetaill(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExerGroupDetaill(entity1, entity2);
        const compareResult2 = service.compareExerGroupDetaill(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExerGroupDetaill(entity1, entity2);
        const compareResult2 = service.compareExerGroupDetaill(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExerGroupDetaill(entity1, entity2);
        const compareResult2 = service.compareExerGroupDetaill(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
