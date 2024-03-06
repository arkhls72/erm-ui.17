import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SoapNote } from '../soap-note.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../soap-note.test-samples';

import { SoapNoteService, RestSoapNote } from './soap-note.service';

const requireRestSample: RestSoapNote = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('SoapNote Service', () => {
  let service: SoapNoteService;
  let httpMock: HttpTestingController;
  let expectedResult: SoapNote | SoapNote[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SoapNoteService);
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

    it('should create a SoapNote', () => {
      const soapNote = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(soapNote).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SoapNote', () => {
      const soapNote = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(soapNote).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SoapNote', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SoapNote', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SoapNote', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSoapNoteToCollectionIfMissing', () => {
      it('should add a SoapNote to an empty array', () => {
        const soapNote: SoapNote = sampleWithRequiredData;
        expectedResult = service.addSoapNoteToCollectionIfMissing([], soapNote);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(soapNote);
      });

      it('should not add a SoapNote to an array that contains it', () => {
        const soapNote: SoapNote = sampleWithRequiredData;
        const soapNoteCollection: SoapNote[] = [
          {
            ...soapNote,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSoapNoteToCollectionIfMissing(soapNoteCollection, soapNote);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SoapNote to an array that doesn't contain it", () => {
        const soapNote: SoapNote = sampleWithRequiredData;
        const soapNoteCollection: SoapNote[] = [sampleWithPartialData];
        expectedResult = service.addSoapNoteToCollectionIfMissing(soapNoteCollection, soapNote);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(soapNote);
      });

      it('should add only unique SoapNote to an array', () => {
        const soapNoteArray: SoapNote[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const soapNoteCollection: SoapNote[] = [sampleWithRequiredData];
        expectedResult = service.addSoapNoteToCollectionIfMissing(soapNoteCollection, ...soapNoteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const soapNote: SoapNote = sampleWithRequiredData;
        const soapNote2: SoapNote = sampleWithPartialData;
        expectedResult = service.addSoapNoteToCollectionIfMissing([], soapNote, soapNote2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(soapNote);
        expect(expectedResult).toContain(soapNote2);
      });

      it('should accept null and undefined values', () => {
        const soapNote: SoapNote = sampleWithRequiredData;
        expectedResult = service.addSoapNoteToCollectionIfMissing([], null, soapNote, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(soapNote);
      });

      it('should return initial array if no SoapNote is added', () => {
        const soapNoteCollection: SoapNote[] = [sampleWithRequiredData];
        expectedResult = service.addSoapNoteToCollectionIfMissing(soapNoteCollection, undefined, null);
        expect(expectedResult).toEqual(soapNoteCollection);
      });
    });

    describe('compareSoapNote', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSoapNote(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSoapNote(entity1, entity2);
        const compareResult2 = service.compareSoapNote(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSoapNote(entity1, entity2);
        const compareResult2 = service.compareSoapNote(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSoapNote(entity1, entity2);
        const compareResult2 = service.compareSoapNote(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
