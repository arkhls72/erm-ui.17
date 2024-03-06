import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { MyService, NewMyService } from '../my-service.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts MyService for edit and NewMyServiceFormGroupInput for create.
 */
type MyServiceFormGroupInput = MyService | PartialWithRequiredKeyOf<NewMyService>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends MyService | NewMyService> = Omit<T, 'createdDate' | 'createdBy' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  createdBy?: string | null;
  lastModifiedDate?: string | null;
};

type MyServiceFormRawValue = FormValueOf<MyService>;

type NewMyServiceFormRawValue = FormValueOf<NewMyService>;

type MyServiceFormDefaults = Pick<NewMyService, 'id' | 'createdDate' | 'createdBy' | 'lastModifiedDate'>;

type MyServiceFormGroupContent = {
  id: FormControl<MyServiceFormRawValue['id'] | NewMyService['id']>;
  name: FormControl<MyServiceFormRawValue['name']>;
  description: FormControl<MyServiceFormRawValue['description']>;
  commonServiceCodeId: FormControl<MyServiceFormRawValue['commonServiceCodeId']>;
  commonServiceCode: FormControl<MyServiceFormRawValue['commonServiceCode']>;
  unit: FormControl<MyServiceFormRawValue['unit']>;
  note: FormControl<MyServiceFormRawValue['note']>;
  createdDate: FormControl<MyServiceFormRawValue['createdDate']>;
  createdBy: FormControl<MyServiceFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<MyServiceFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<MyServiceFormRawValue['lastModifiedDate']>;
};

export type MyServiceFormGroup = FormGroup<MyServiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MyServiceFormService {
  createMyServiceFormGroup(myService: MyServiceFormGroupInput = { id: null }): MyServiceFormGroup {
    const myServiceRawValue = this.convertMyServiceToMyServiceRawValue({
      ...this.getFormDefaults(),
      ...myService,
    });
    return new FormGroup<MyServiceFormGroupContent>({
      id: new FormControl(
        { value: myServiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(myServiceRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      description: new FormControl(myServiceRawValue.description, {
        validators: [Validators.maxLength(50)],
      }),
      commonServiceCodeId: new FormControl(myServiceRawValue.commonServiceCodeId),
      commonServiceCode: new FormControl(myServiceRawValue.commonServiceCode),
      unit: new FormControl(myServiceRawValue.unit, {
        validators: [Validators.maxLength(50)],
      }),
      note: new FormControl(myServiceRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdDate: new FormControl(myServiceRawValue.createdDate),
      createdBy: new FormControl(myServiceRawValue.createdBy),
      lastModifiedBy: new FormControl(myServiceRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(myServiceRawValue.lastModifiedDate),
    });
  }

  getMyService(form: MyServiceFormGroup): MyService | NewMyService {
    return this.convertMyServiceRawValueToMyService(form.getRawValue() as MyServiceFormRawValue | NewMyServiceFormRawValue);
  }

  resetForm(form: MyServiceFormGroup, myService: MyServiceFormGroupInput): void {
    const myServiceRawValue = this.convertMyServiceToMyServiceRawValue({ ...this.getFormDefaults(), ...myService });
    form.reset(
      {
        ...myServiceRawValue,
        id: { value: myServiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MyServiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      createdBy: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMyServiceRawValueToMyService(rawMyService: MyServiceFormRawValue | NewMyServiceFormRawValue): MyService | NewMyService {
    return {
      ...rawMyService,
      createdDate: dayjs(rawMyService.createdDate, DATE_TIME_FORMAT),
      createdBy: dayjs(rawMyService.createdBy, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMyService.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMyServiceToMyServiceRawValue(
    myService: MyService | (Partial<NewMyService> & MyServiceFormDefaults),
  ): MyServiceFormRawValue | PartialWithRequiredKeyOf<NewMyServiceFormRawValue> {
    return {
      ...myService,
      createdDate: myService.createdDate ? myService.createdDate.format(DATE_TIME_FORMAT) : undefined,
      createdBy: myService.createdBy ? myService.createdBy.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: myService.lastModifiedDate ? myService.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
