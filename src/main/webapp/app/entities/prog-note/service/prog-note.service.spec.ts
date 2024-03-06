import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProgNote } from '../prog-note.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prog-note.test-samples';

import { ProgNoteService, RestProgNote } from './prog-note.service';

const requireRestSample: RestProgNote = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ProgNote Service', () => {
  let service: ProgNoteService;
  let httpMock: HttpTestingController;
  let expectedResult: ProgNote | ProgNote[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgNoteService);
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

    it('should create a ProgNote', () => {
      const progNote = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(progNote).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProgNote', () => {
      const progNote = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(progNote).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProgNote', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProgNote', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProgNote', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProgNoteToCollectionIfMissing', () => {
      it('should add a ProgNote to an empty array', () => {
        const progNote: ProgNote = sampleWithRequiredData;
        expectedResult = service.addProgNoteToCollectionIfMissing([], progNote);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progNote);
      });

      it('should not add a ProgNote to an array that contains it', () => {
        const progNote: ProgNote = sampleWithRequiredData;
        const progNoteCollection: ProgNote[] = [
          {
            ...progNote,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProgNoteToCollectionIfMissing(progNoteCollection, progNote);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProgNote to an array that doesn't contain it", () => {
        const progNote: ProgNote = sampleWithRequiredData;
        const progNoteCollection: ProgNote[] = [sampleWithPartialData];
        expectedResult = service.addProgNoteToCollectionIfMissing(progNoteCollection, progNote);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progNote);
      });

      it('should add only unique ProgNote to an array', () => {
        const progNoteArray: ProgNote[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const progNoteCollection: ProgNote[] = [sampleWithRequiredData];
        expectedResult = service.addProgNoteToCollectionIfMissing(progNoteCollection, ...progNoteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const progNote: ProgNote = sampleWithRequiredData;
        const progNote2: ProgNote = sampleWithPartialData;
        expectedResult = service.addProgNoteToCollectionIfMissing([], progNote, progNote2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progNote);
        expect(expectedResult).toContain(progNote2);
      });

      it('should accept null and undefined values', () => {
        const progNote: ProgNote = sampleWithRequiredData;
        expectedResult = service.addProgNoteToCollectionIfMissing([], null, progNote, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progNote);
      });

      it('should return initial array if no ProgNote is added', () => {
        const progNoteCollection: ProgNote[] = [sampleWithRequiredData];
        expectedResult = service.addProgNoteToCollectionIfMissing(progNoteCollection, undefined, null);
        expect(expectedResult).toEqual(progNoteCollection);
      });
    });

    describe('compareProgNote', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProgNote(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProgNote(entity1, entity2);
        const compareResult2 = service.compareProgNote(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProgNote(entity1, entity2);
        const compareResult2 = service.compareProgNote(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProgNote(entity1, entity2);
        const compareResult2 = service.compareProgNote(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
