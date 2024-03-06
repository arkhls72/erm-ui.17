import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Medication } from '../medication.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../medication.test-samples';

import { MedicationService, RestMedication } from './medication.service';

const requireRestSample: RestMedication = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Medication Service', () => {
  let service: MedicationService;
  let httpMock: HttpTestingController;
  let expectedResult: Medication | Medication[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MedicationService);
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

    it('should create a Medication', () => {
      const medication = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(medication).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Medication', () => {
      const medication = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(medication).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Medication', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Medication', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Medication', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMedicationToCollectionIfMissing', () => {
      it('should add a Medication to an empty array', () => {
        const medication: Medication = sampleWithRequiredData;
        expectedResult = service.addMedicationToCollectionIfMissing([], medication);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medication);
      });

      it('should not add a Medication to an array that contains it', () => {
        const medication: Medication = sampleWithRequiredData;
        const medicationCollection: Medication[] = [
          {
            ...medication,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMedicationToCollectionIfMissing(medicationCollection, medication);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Medication to an array that doesn't contain it", () => {
        const medication: Medication = sampleWithRequiredData;
        const medicationCollection: Medication[] = [sampleWithPartialData];
        expectedResult = service.addMedicationToCollectionIfMissing(medicationCollection, medication);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medication);
      });

      it('should add only unique Medication to an array', () => {
        const medicationArray: Medication[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const medicationCollection: Medication[] = [sampleWithRequiredData];
        expectedResult = service.addMedicationToCollectionIfMissing(medicationCollection, ...medicationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const medication: Medication = sampleWithRequiredData;
        const medication2: Medication = sampleWithPartialData;
        expectedResult = service.addMedicationToCollectionIfMissing([], medication, medication2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medication);
        expect(expectedResult).toContain(medication2);
      });

      it('should accept null and undefined values', () => {
        const medication: Medication = sampleWithRequiredData;
        expectedResult = service.addMedicationToCollectionIfMissing([], null, medication, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medication);
      });

      it('should return initial array if no Medication is added', () => {
        const medicationCollection: Medication[] = [sampleWithRequiredData];
        expectedResult = service.addMedicationToCollectionIfMissing(medicationCollection, undefined, null);
        expect(expectedResult).toEqual(medicationCollection);
      });
    });

    describe('compareMedication', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMedication(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMedication(entity1, entity2);
        const compareResult2 = service.compareMedication(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMedication(entity1, entity2);
        const compareResult2 = service.compareMedication(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMedication(entity1, entity2);
        const compareResult2 = service.compareMedication(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
