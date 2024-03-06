import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Wsib } from '../wsib.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../wsib.test-samples';

import { WsibService, RestWsib } from './wsib.service';

const requireRestSample: RestWsib = {
  ...sampleWithRequiredData,
  accidentDate: sampleWithRequiredData.accidentDate?.toJSON(),
  closeDate: sampleWithRequiredData.closeDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Wsib Service', () => {
  let service: WsibService;
  let httpMock: HttpTestingController;
  let expectedResult: Wsib | Wsib[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WsibService);
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

    it('should create a Wsib', () => {
      const wsib = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(wsib).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Wsib', () => {
      const wsib = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(wsib).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Wsib', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Wsib', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Wsib', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWsibToCollectionIfMissing', () => {
      it('should add a Wsib to an empty array', () => {
        const wsib: Wsib = sampleWithRequiredData;
        expectedResult = service.addWsibToCollectionIfMissing([], wsib);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(wsib);
      });

      it('should not add a Wsib to an array that contains it', () => {
        const wsib: Wsib = sampleWithRequiredData;
        const wsibCollection: Wsib[] = [
          {
            ...wsib,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWsibToCollectionIfMissing(wsibCollection, wsib);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Wsib to an array that doesn't contain it", () => {
        const wsib: Wsib = sampleWithRequiredData;
        const wsibCollection: Wsib[] = [sampleWithPartialData];
        expectedResult = service.addWsibToCollectionIfMissing(wsibCollection, wsib);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(wsib);
      });

      it('should add only unique Wsib to an array', () => {
        const wsibArray: Wsib[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const wsibCollection: Wsib[] = [sampleWithRequiredData];
        expectedResult = service.addWsibToCollectionIfMissing(wsibCollection, ...wsibArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const wsib: Wsib = sampleWithRequiredData;
        const wsib2: Wsib = sampleWithPartialData;
        expectedResult = service.addWsibToCollectionIfMissing([], wsib, wsib2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(wsib);
        expect(expectedResult).toContain(wsib2);
      });

      it('should accept null and undefined values', () => {
        const wsib: Wsib = sampleWithRequiredData;
        expectedResult = service.addWsibToCollectionIfMissing([], null, wsib, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(wsib);
      });

      it('should return initial array if no Wsib is added', () => {
        const wsibCollection: Wsib[] = [sampleWithRequiredData];
        expectedResult = service.addWsibToCollectionIfMissing(wsibCollection, undefined, null);
        expect(expectedResult).toEqual(wsibCollection);
      });
    });

    describe('compareWsib', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWsib(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWsib(entity1, entity2);
        const compareResult2 = service.compareWsib(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWsib(entity1, entity2);
        const compareResult2 = service.compareWsib(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWsib(entity1, entity2);
        const compareResult2 = service.compareWsib(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
