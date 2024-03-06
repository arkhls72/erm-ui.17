import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Insurance } from '../insurance.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../insurance.test-samples';

import { InsuranceService } from './insurance.service';

const requireRestSample: Insurance = {
  ...sampleWithRequiredData,
};

describe('Insurance Service', () => {
  let service: InsuranceService;
  let httpMock: HttpTestingController;
  let expectedResult: Insurance | Insurance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InsuranceService);
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

    it('should create a Insurance', () => {
      const insurance = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(insurance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Insurance', () => {
      const insurance = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(insurance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Insurance', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Insurance', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Insurance', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInsuranceToCollectionIfMissing', () => {
      it('should add a Insurance to an empty array', () => {
        const insurance: Insurance = sampleWithRequiredData;
        expectedResult = service.addInsuranceToCollectionIfMissing([], insurance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insurance);
      });

      it('should not add a Insurance to an array that contains it', () => {
        const insurance: Insurance = sampleWithRequiredData;
        const insuranceCollection: Insurance[] = [
          {
            ...insurance,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInsuranceToCollectionIfMissing(insuranceCollection, insurance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Insurance to an array that doesn't contain it", () => {
        const insurance: Insurance = sampleWithRequiredData;
        const insuranceCollection: Insurance[] = [sampleWithPartialData];
        expectedResult = service.addInsuranceToCollectionIfMissing(insuranceCollection, insurance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insurance);
      });

      it('should add only unique Insurance to an array', () => {
        const insuranceArray: Insurance[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const insuranceCollection: Insurance[] = [sampleWithRequiredData];
        expectedResult = service.addInsuranceToCollectionIfMissing(insuranceCollection, ...insuranceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const insurance: Insurance = sampleWithRequiredData;
        const insurance2: Insurance = sampleWithPartialData;
        expectedResult = service.addInsuranceToCollectionIfMissing([], insurance, insurance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insurance);
        expect(expectedResult).toContain(insurance2);
      });

      it('should accept null and undefined values', () => {
        const insurance: Insurance = sampleWithRequiredData;
        expectedResult = service.addInsuranceToCollectionIfMissing([], null, insurance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insurance);
      });

      it('should return initial array if no Insurance is added', () => {
        const insuranceCollection: Insurance[] = [sampleWithRequiredData];
        expectedResult = service.addInsuranceToCollectionIfMissing(insuranceCollection, undefined, null);
        expect(expectedResult).toEqual(insuranceCollection);
      });
    });

    describe('compareInsurance', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInsurance(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInsurance(entity1, entity2);
        const compareResult2 = service.compareInsurance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInsurance(entity1, entity2);
        const compareResult2 = service.compareInsurance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInsurance(entity1, entity2);
        const compareResult2 = service.compareInsurance(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
