import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Prog } from '../prog.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prog.test-samples';

import { ProgService, RestProg } from './prog.service';

const requireRestSample: RestProg = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  createdBy: sampleWithRequiredData.createdBy?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Prog Service', () => {
  let service: ProgService;
  let httpMock: HttpTestingController;
  let expectedResult: Prog | Prog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgService);
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

    it('should create a Prog', () => {
      const prog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(prog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Prog', () => {
      const prog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(prog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Prog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Prog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Prog', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProgToCollectionIfMissing', () => {
      it('should add a Prog to an empty array', () => {
        const prog: Prog = sampleWithRequiredData;
        expectedResult = service.addProgToCollectionIfMissing([], prog);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prog);
      });

      it('should not add a Prog to an array that contains it', () => {
        const prog: Prog = sampleWithRequiredData;
        const progCollection: Prog[] = [
          {
            ...prog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProgToCollectionIfMissing(progCollection, prog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Prog to an array that doesn't contain it", () => {
        const prog: Prog = sampleWithRequiredData;
        const progCollection: Prog[] = [sampleWithPartialData];
        expectedResult = service.addProgToCollectionIfMissing(progCollection, prog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prog);
      });

      it('should add only unique Prog to an array', () => {
        const progArray: Prog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const progCollection: Prog[] = [sampleWithRequiredData];
        expectedResult = service.addProgToCollectionIfMissing(progCollection, ...progArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prog: Prog = sampleWithRequiredData;
        const prog2: Prog = sampleWithPartialData;
        expectedResult = service.addProgToCollectionIfMissing([], prog, prog2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prog);
        expect(expectedResult).toContain(prog2);
      });

      it('should accept null and undefined values', () => {
        const prog: Prog = sampleWithRequiredData;
        expectedResult = service.addProgToCollectionIfMissing([], null, prog, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prog);
      });

      it('should return initial array if no Prog is added', () => {
        const progCollection: Prog[] = [sampleWithRequiredData];
        expectedResult = service.addProgToCollectionIfMissing(progCollection, undefined, null);
        expect(expectedResult).toEqual(progCollection);
      });
    });

    describe('compareProg', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProg(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProg(entity1, entity2);
        const compareResult2 = service.compareProg(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProg(entity1, entity2);
        const compareResult2 = service.compareProg(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProg(entity1, entity2);
        const compareResult2 = service.compareProg(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
