import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProgExerGroup } from '../prog-exer-group.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prog-exer-group.test-samples';

import { ProgExerGroupService, RestProgExerGroup } from './prog-exer-group.service';

const requireRestSample: RestProgExerGroup = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ProgExerGroup Service', () => {
  let service: ProgExerGroupService;
  let httpMock: HttpTestingController;
  let expectedResult: ProgExerGroup | ProgExerGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgExerGroupService);
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

    it('should create a ProgExerGroup', () => {
      const progExerGroup = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(progExerGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProgExerGroup', () => {
      const progExerGroup = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(progExerGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProgExerGroup', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProgExerGroup', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProgExerGroup', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProgExerGroupToCollectionIfMissing', () => {
      it('should add a ProgExerGroup to an empty array', () => {
        const progExerGroup: ProgExerGroup = sampleWithRequiredData;
        expectedResult = service.addProgExerGroupToCollectionIfMissing([], progExerGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progExerGroup);
      });

      it('should not add a ProgExerGroup to an array that contains it', () => {
        const progExerGroup: ProgExerGroup = sampleWithRequiredData;
        const progExerGroupCollection: ProgExerGroup[] = [
          {
            ...progExerGroup,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProgExerGroupToCollectionIfMissing(progExerGroupCollection, progExerGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProgExerGroup to an array that doesn't contain it", () => {
        const progExerGroup: ProgExerGroup = sampleWithRequiredData;
        const progExerGroupCollection: ProgExerGroup[] = [sampleWithPartialData];
        expectedResult = service.addProgExerGroupToCollectionIfMissing(progExerGroupCollection, progExerGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progExerGroup);
      });

      it('should add only unique ProgExerGroup to an array', () => {
        const progExerGroupArray: ProgExerGroup[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const progExerGroupCollection: ProgExerGroup[] = [sampleWithRequiredData];
        expectedResult = service.addProgExerGroupToCollectionIfMissing(progExerGroupCollection, ...progExerGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const progExerGroup: ProgExerGroup = sampleWithRequiredData;
        const progExerGroup2: ProgExerGroup = sampleWithPartialData;
        expectedResult = service.addProgExerGroupToCollectionIfMissing([], progExerGroup, progExerGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progExerGroup);
        expect(expectedResult).toContain(progExerGroup2);
      });

      it('should accept null and undefined values', () => {
        const progExerGroup: ProgExerGroup = sampleWithRequiredData;
        expectedResult = service.addProgExerGroupToCollectionIfMissing([], null, progExerGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progExerGroup);
      });

      it('should return initial array if no ProgExerGroup is added', () => {
        const progExerGroupCollection: ProgExerGroup[] = [sampleWithRequiredData];
        expectedResult = service.addProgExerGroupToCollectionIfMissing(progExerGroupCollection, undefined, null);
        expect(expectedResult).toEqual(progExerGroupCollection);
      });
    });

    describe('compareProgExerGroup', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProgExerGroup(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProgExerGroup(entity1, entity2);
        const compareResult2 = service.compareProgExerGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProgExerGroup(entity1, entity2);
        const compareResult2 = service.compareProgExerGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProgExerGroup(entity1, entity2);
        const compareResult2 = service.compareProgExerGroup(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
