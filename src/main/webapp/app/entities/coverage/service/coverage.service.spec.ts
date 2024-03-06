import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Coverage } from '../coverage.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../coverage.test-samples';

import { CoverageService, RestCoverage } from './coverage.service';

const requireRestSample: RestCoverage = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('Coverage Service', () => {
  let service: CoverageService;
  let httpMock: HttpTestingController;
  let expectedResult: Coverage | Coverage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CoverageService);
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

    it('should create a Coverage', () => {
      const coverage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(coverage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Coverage', () => {
      const coverage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(coverage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Coverage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Coverage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Coverage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCoverageToCollectionIfMissing', () => {
      it('should add a Coverage to an empty array', () => {
        const coverage: Coverage = sampleWithRequiredData;
        expectedResult = service.addCoverageToCollectionIfMissing([], coverage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(coverage);
      });

      it('should not add a Coverage to an array that contains it', () => {
        const coverage: Coverage = sampleWithRequiredData;
        const coverageCollection: Coverage[] = [
          {
            ...coverage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCoverageToCollectionIfMissing(coverageCollection, coverage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Coverage to an array that doesn't contain it", () => {
        const coverage: Coverage = sampleWithRequiredData;
        const coverageCollection: Coverage[] = [sampleWithPartialData];
        expectedResult = service.addCoverageToCollectionIfMissing(coverageCollection, coverage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(coverage);
      });

      it('should add only unique Coverage to an array', () => {
        const coverageArray: Coverage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const coverageCollection: Coverage[] = [sampleWithRequiredData];
        expectedResult = service.addCoverageToCollectionIfMissing(coverageCollection, ...coverageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const coverage: Coverage = sampleWithRequiredData;
        const coverage2: Coverage = sampleWithPartialData;
        expectedResult = service.addCoverageToCollectionIfMissing([], coverage, coverage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(coverage);
        expect(expectedResult).toContain(coverage2);
      });

      it('should accept null and undefined values', () => {
        const coverage: Coverage = sampleWithRequiredData;
        expectedResult = service.addCoverageToCollectionIfMissing([], null, coverage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(coverage);
      });

      it('should return initial array if no Coverage is added', () => {
        const coverageCollection: Coverage[] = [sampleWithRequiredData];
        expectedResult = service.addCoverageToCollectionIfMissing(coverageCollection, undefined, null);
        expect(expectedResult).toEqual(coverageCollection);
      });
    });

    describe('compareCoverage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCoverage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCoverage(entity1, entity2);
        const compareResult2 = service.compareCoverage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCoverage(entity1, entity2);
        const compareResult2 = service.compareCoverage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCoverage(entity1, entity2);
        const compareResult2 = service.compareCoverage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
