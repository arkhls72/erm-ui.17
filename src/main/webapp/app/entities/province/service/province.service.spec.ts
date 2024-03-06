import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Province } from '../province.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../province.test-samples';

import { ProvinceService } from './province.service';

const requireRestSample: Province = {
  ...sampleWithRequiredData,
};

describe('Province Service', () => {
  let service: ProvinceService;
  let httpMock: HttpTestingController;
  let expectedResult: Province | Province[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProvinceService);
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

    it('should create a Province', () => {
      const province = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(province).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Province', () => {
      const province = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(province).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Province', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Province', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Province', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProvinceToCollectionIfMissing', () => {
      it('should add a Province to an empty array', () => {
        const province: Province = sampleWithRequiredData;
        expectedResult = service.addProvinceToCollectionIfMissing([], province);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(province);
      });

      it('should not add a Province to an array that contains it', () => {
        const province: Province = sampleWithRequiredData;
        const provinceCollection: Province[] = [
          {
            ...province,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProvinceToCollectionIfMissing(provinceCollection, province);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Province to an array that doesn't contain it", () => {
        const province: Province = sampleWithRequiredData;
        const provinceCollection: Province[] = [sampleWithPartialData];
        expectedResult = service.addProvinceToCollectionIfMissing(provinceCollection, province);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(province);
      });

      it('should add only unique Province to an array', () => {
        const provinceArray: Province[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const provinceCollection: Province[] = [sampleWithRequiredData];
        expectedResult = service.addProvinceToCollectionIfMissing(provinceCollection, ...provinceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const province: Province = sampleWithRequiredData;
        const province2: Province = sampleWithPartialData;
        expectedResult = service.addProvinceToCollectionIfMissing([], province, province2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(province);
        expect(expectedResult).toContain(province2);
      });

      it('should accept null and undefined values', () => {
        const province: Province = sampleWithRequiredData;
        expectedResult = service.addProvinceToCollectionIfMissing([], null, province, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(province);
      });

      it('should return initial array if no Province is added', () => {
        const provinceCollection: Province[] = [sampleWithRequiredData];
        expectedResult = service.addProvinceToCollectionIfMissing(provinceCollection, undefined, null);
        expect(expectedResult).toEqual(provinceCollection);
      });
    });

    describe('compareProvince', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProvince(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProvince(entity1, entity2);
        const compareResult2 = service.compareProvince(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProvince(entity1, entity2);
        const compareResult2 = service.compareProvince(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProvince(entity1, entity2);
        const compareResult2 = service.compareProvince(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
