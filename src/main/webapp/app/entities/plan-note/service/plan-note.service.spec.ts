import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PlanNote } from '../plan-note.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../plan-note.test-samples';

import { PlanNoteService, RestPlanNote } from './plan-note.service';

const requireRestSample: RestPlanNote = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModfiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('PlanNote Service', () => {
  let service: PlanNoteService;
  let httpMock: HttpTestingController;
  let expectedResult: PlanNote | PlanNote[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlanNoteService);
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

    it('should create a PlanNote', () => {
      const planNote = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(planNote).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PlanNote', () => {
      const planNote = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(planNote).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PlanNote', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PlanNote', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PlanNote', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlanNoteToCollectionIfMissing', () => {
      it('should add a PlanNote to an empty array', () => {
        const planNote: PlanNote = sampleWithRequiredData;
        expectedResult = service.addPlanNoteToCollectionIfMissing([], planNote);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(planNote);
      });

      it('should not add a PlanNote to an array that contains it', () => {
        const planNote: PlanNote = sampleWithRequiredData;
        const planNoteCollection: PlanNote[] = [
          {
            ...planNote,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlanNoteToCollectionIfMissing(planNoteCollection, planNote);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PlanNote to an array that doesn't contain it", () => {
        const planNote: PlanNote = sampleWithRequiredData;
        const planNoteCollection: PlanNote[] = [sampleWithPartialData];
        expectedResult = service.addPlanNoteToCollectionIfMissing(planNoteCollection, planNote);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(planNote);
      });

      it('should add only unique PlanNote to an array', () => {
        const planNoteArray: PlanNote[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const planNoteCollection: PlanNote[] = [sampleWithRequiredData];
        expectedResult = service.addPlanNoteToCollectionIfMissing(planNoteCollection, ...planNoteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const planNote: PlanNote = sampleWithRequiredData;
        const planNote2: PlanNote = sampleWithPartialData;
        expectedResult = service.addPlanNoteToCollectionIfMissing([], planNote, planNote2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(planNote);
        expect(expectedResult).toContain(planNote2);
      });

      it('should accept null and undefined values', () => {
        const planNote: PlanNote = sampleWithRequiredData;
        expectedResult = service.addPlanNoteToCollectionIfMissing([], null, planNote, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(planNote);
      });

      it('should return initial array if no PlanNote is added', () => {
        const planNoteCollection: PlanNote[] = [sampleWithRequiredData];
        expectedResult = service.addPlanNoteToCollectionIfMissing(planNoteCollection, undefined, null);
        expect(expectedResult).toEqual(planNoteCollection);
      });
    });

    describe('comparePlanNote', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlanNote(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlanNote(entity1, entity2);
        const compareResult2 = service.comparePlanNote(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlanNote(entity1, entity2);
        const compareResult2 = service.comparePlanNote(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlanNote(entity1, entity2);
        const compareResult2 = service.comparePlanNote(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
