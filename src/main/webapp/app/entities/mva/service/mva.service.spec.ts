import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Mva } from '../mva.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mva.test-samples';

import { MvaService, RestMva } from './mva.service';

const requireRestSample: RestMva = {
  ...sampleWithRequiredData,
  accidentDate: sampleWithRequiredData.accidentDate?.toJSON(),
  closeDate: sampleWithRequiredData.closeDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Mva Service', () => {
  let service: MvaService;
  let httpMock: HttpTestingController;
  let expectedResult: Mva | Mva[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MvaService);
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

    it('should create a Mva', () => {
      const mva = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mva).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mva', () => {
      const mva = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mva).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mva', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mva', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mva', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMvaToCollectionIfMissing', () => {
      it('should add a Mva to an empty array', () => {
        const mva: Mva = sampleWithRequiredData;
        expectedResult = service.addMvaToCollectionIfMissing([], mva);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mva);
      });

      it('should not add a Mva to an array that contains it', () => {
        const mva: Mva = sampleWithRequiredData;
        const mvaCollection: Mva[] = [
          {
            ...mva,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMvaToCollectionIfMissing(mvaCollection, mva);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mva to an array that doesn't contain it", () => {
        const mva: Mva = sampleWithRequiredData;
        const mvaCollection: Mva[] = [sampleWithPartialData];
        expectedResult = service.addMvaToCollectionIfMissing(mvaCollection, mva);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mva);
      });

      it('should add only unique Mva to an array', () => {
        const mvaArray: Mva[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mvaCollection: Mva[] = [sampleWithRequiredData];
        expectedResult = service.addMvaToCollectionIfMissing(mvaCollection, ...mvaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mva: Mva = sampleWithRequiredData;
        const mva2: Mva = sampleWithPartialData;
        expectedResult = service.addMvaToCollectionIfMissing([], mva, mva2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mva);
        expect(expectedResult).toContain(mva2);
      });

      it('should accept null and undefined values', () => {
        const mva: Mva = sampleWithRequiredData;
        expectedResult = service.addMvaToCollectionIfMissing([], null, mva, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mva);
      });

      it('should return initial array if no Mva is added', () => {
        const mvaCollection: Mva[] = [sampleWithRequiredData];
        expectedResult = service.addMvaToCollectionIfMissing(mvaCollection, undefined, null);
        expect(expectedResult).toEqual(mvaCollection);
      });
    });

    describe('compareMva', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMva(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMva(entity1, entity2);
        const compareResult2 = service.compareMva(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMva(entity1, entity2);
        const compareResult2 = service.compareMva(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMva(entity1, entity2);
        const compareResult2 = service.compareMva(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
