import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../my-service.test-samples';

import { MyServiceFormService } from './my-service-form.service';

describe('MyService Form Service', () => {
  let service: MyServiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyServiceFormService);
  });

  describe('Service methods', () => {
    describe('createMyServiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMyServiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            commonServiceCodeId: expect.any(Object),
            commonServiceCode: expect.any(Object),
            unit: expect.any(Object),
            note: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing MyService should create a new form with FormGroup', () => {
        const formGroup = service.createMyServiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            commonServiceCodeId: expect.any(Object),
            commonServiceCode: expect.any(Object),
            unit: expect.any(Object),
            note: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getMyService', () => {
      it('should return NewMyService for default MyService initial value', () => {
        const formGroup = service.createMyServiceFormGroup(sampleWithNewData);

        const myService = service.getMyService(formGroup) as any;

        expect(myService).toMatchObject(sampleWithNewData);
      });

      it('should return NewMyService for empty MyService initial value', () => {
        const formGroup = service.createMyServiceFormGroup();

        const myService = service.getMyService(formGroup) as any;

        expect(myService).toMatchObject({});
      });

      it('should return MyService', () => {
        const formGroup = service.createMyServiceFormGroup(sampleWithRequiredData);

        const myService = service.getMyService(formGroup) as any;

        expect(myService).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing MyService should not enable id FormControl', () => {
        const formGroup = service.createMyServiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMyService should disable id FormControl', () => {
        const formGroup = service.createMyServiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
