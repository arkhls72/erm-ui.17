import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BodyPart } from '../body-part.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../body-part.test-samples';

import { BodyPartService } from './body-part.service';

const requireRestSample: BodyPart = {
  ...sampleWithRequiredData,
};

describe('BodyPart Service', () => {
  let service: BodyPartService;
  let httpMock: HttpTestingController;
  let expectedResult: BodyPart | BodyPart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BodyPartService);
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

    it('should create a BodyPart', () => {
      const bodyPart = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bodyPart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BodyPart', () => {
      const bodyPart = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bodyPart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BodyPart', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BodyPart', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BodyPart', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBodyPartToCollectionIfMissing', () => {
      it('should add a BodyPart to an empty array', () => {
        const bodyPart: BodyPart = sampleWithRequiredData;
        expectedResult = service.addBodyPartToCollectionIfMissing([], bodyPart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bodyPart);
      });

      it('should not add a BodyPart to an array that contains it', () => {
        const bodyPart: BodyPart = sampleWithRequiredData;
        const bodyPartCollection: BodyPart[] = [
          {
            ...bodyPart,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBodyPartToCollectionIfMissing(bodyPartCollection, bodyPart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BodyPart to an array that doesn't contain it", () => {
        const bodyPart: BodyPart = sampleWithRequiredData;
        const bodyPartCollection: BodyPart[] = [sampleWithPartialData];
        expectedResult = service.addBodyPartToCollectionIfMissing(bodyPartCollection, bodyPart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bodyPart);
      });

      it('should add only unique BodyPart to an array', () => {
        const bodyPartArray: BodyPart[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bodyPartCollection: BodyPart[] = [sampleWithRequiredData];
        expectedResult = service.addBodyPartToCollectionIfMissing(bodyPartCollection, ...bodyPartArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bodyPart: BodyPart = sampleWithRequiredData;
        const bodyPart2: BodyPart = sampleWithPartialData;
        expectedResult = service.addBodyPartToCollectionIfMissing([], bodyPart, bodyPart2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bodyPart);
        expect(expectedResult).toContain(bodyPart2);
      });

      it('should accept null and undefined values', () => {
        const bodyPart: BodyPart = sampleWithRequiredData;
        expectedResult = service.addBodyPartToCollectionIfMissing([], null, bodyPart, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bodyPart);
      });

      it('should return initial array if no BodyPart is added', () => {
        const bodyPartCollection: BodyPart[] = [sampleWithRequiredData];
        expectedResult = service.addBodyPartToCollectionIfMissing(bodyPartCollection, undefined, null);
        expect(expectedResult).toEqual(bodyPartCollection);
      });
    });

    describe('compareBodyPart', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBodyPart(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBodyPart(entity1, entity2);
        const compareResult2 = service.compareBodyPart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBodyPart(entity1, entity2);
        const compareResult2 = service.compareBodyPart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBodyPart(entity1, entity2);
        const compareResult2 = service.compareBodyPart(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
