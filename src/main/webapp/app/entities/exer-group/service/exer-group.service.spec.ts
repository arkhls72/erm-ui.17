import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExerGroup } from '../exer-group.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../exer-group.test-samples';

import { ExerGroupService, RestExerGroup } from './exer-group.service';

const requireRestSample: RestExerGroup = {
  ...sampleWithRequiredData,
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('ExerGroup Service', () => {
  let service: ExerGroupService;
  let httpMock: HttpTestingController;
  let expectedResult: ExerGroup | ExerGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExerGroupService);
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

    it('should create a ExerGroup', () => {
      const exerGroup = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(exerGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExerGroup', () => {
      const exerGroup = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(exerGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExerGroup', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExerGroup', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExerGroup', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExerGroupToCollectionIfMissing', () => {
      it('should add a ExerGroup to an empty array', () => {
        const exerGroup: ExerGroup = sampleWithRequiredData;
        expectedResult = service.addExerGroupToCollectionIfMissing([], exerGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerGroup);
      });

      it('should not add a ExerGroup to an array that contains it', () => {
        const exerGroup: ExerGroup = sampleWithRequiredData;
        const exerGroupCollection: ExerGroup[] = [
          {
            ...exerGroup,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExerGroupToCollectionIfMissing(exerGroupCollection, exerGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExerGroup to an array that doesn't contain it", () => {
        const exerGroup: ExerGroup = sampleWithRequiredData;
        const exerGroupCollection: ExerGroup[] = [sampleWithPartialData];
        expectedResult = service.addExerGroupToCollectionIfMissing(exerGroupCollection, exerGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerGroup);
      });

      it('should add only unique ExerGroup to an array', () => {
        const exerGroupArray: ExerGroup[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const exerGroupCollection: ExerGroup[] = [sampleWithRequiredData];
        expectedResult = service.addExerGroupToCollectionIfMissing(exerGroupCollection, ...exerGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exerGroup: ExerGroup = sampleWithRequiredData;
        const exerGroup2: ExerGroup = sampleWithPartialData;
        expectedResult = service.addExerGroupToCollectionIfMissing([], exerGroup, exerGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exerGroup);
        expect(expectedResult).toContain(exerGroup2);
      });

      it('should accept null and undefined values', () => {
        const exerGroup: ExerGroup = sampleWithRequiredData;
        expectedResult = service.addExerGroupToCollectionIfMissing([], null, exerGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exerGroup);
      });

      it('should return initial array if no ExerGroup is added', () => {
        const exerGroupCollection: ExerGroup[] = [sampleWithRequiredData];
        expectedResult = service.addExerGroupToCollectionIfMissing(exerGroupCollection, undefined, null);
        expect(expectedResult).toEqual(exerGroupCollection);
      });
    });

    describe('compareExerGroup', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExerGroup(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExerGroup(entity1, entity2);
        const compareResult2 = service.compareExerGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExerGroup(entity1, entity2);
        const compareResult2 = service.compareExerGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExerGroup(entity1, entity2);
        const compareResult2 = service.compareExerGroup(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
