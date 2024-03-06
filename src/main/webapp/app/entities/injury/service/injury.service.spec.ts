import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injury } from '../injury.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../injury.test-samples';

import { InjuryService, RestInjury } from './injury.service';

const requireRestSample: RestInjury = {
  ...sampleWithRequiredData,
  happenDate: sampleWithRequiredData.happenDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Injury Service', () => {
  let service: InjuryService;
  let httpMock: HttpTestingController;
  let expectedResult: Injury | Injury[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InjuryService);
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

    it('should create a Injury', () => {
      const injury = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(injury).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Injury', () => {
      const injury = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(injury).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Injury', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Injury', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Injury', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInjuryToCollectionIfMissing', () => {
      it('should add a Injury to an empty array', () => {
        const injury: Injury = sampleWithRequiredData;
        expectedResult = service.addInjuryToCollectionIfMissing([], injury);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(injury);
      });

      it('should not add a Injury to an array that contains it', () => {
        const injury: Injury = sampleWithRequiredData;
        const injuryCollection: Injury[] = [
          {
            ...injury,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInjuryToCollectionIfMissing(injuryCollection, injury);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Injury to an array that doesn't contain it", () => {
        const injury: Injury = sampleWithRequiredData;
        const injuryCollection: Injury[] = [sampleWithPartialData];
        expectedResult = service.addInjuryToCollectionIfMissing(injuryCollection, injury);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(injury);
      });

      it('should add only unique Injury to an array', () => {
        const injuryArray: Injury[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const injuryCollection: Injury[] = [sampleWithRequiredData];
        expectedResult = service.addInjuryToCollectionIfMissing(injuryCollection, ...injuryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const injury: Injury = sampleWithRequiredData;
        const injury2: Injury = sampleWithPartialData;
        expectedResult = service.addInjuryToCollectionIfMissing([], injury, injury2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(injury);
        expect(expectedResult).toContain(injury2);
      });

      it('should accept null and undefined values', () => {
        const injury: Injury = sampleWithRequiredData;
        expectedResult = service.addInjuryToCollectionIfMissing([], null, injury, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(injury);
      });

      it('should return initial array if no Injury is added', () => {
        const injuryCollection: Injury[] = [sampleWithRequiredData];
        expectedResult = service.addInjuryToCollectionIfMissing(injuryCollection, undefined, null);
        expect(expectedResult).toEqual(injuryCollection);
      });
    });

    describe('compareInjury', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInjury(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInjury(entity1, entity2);
        const compareResult2 = service.compareInjury(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInjury(entity1, entity2);
        const compareResult2 = service.compareInjury(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInjury(entity1, entity2);
        const compareResult2 = service.compareInjury(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
