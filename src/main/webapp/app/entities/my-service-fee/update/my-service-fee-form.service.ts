import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { MyServiceFee, NewMyServiceFee } from '../my-service-fee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts MyServiceFee for edit and NewMyServiceFeeFormGroupInput for create.
 */
type MyServiceFeeFormGroupInput = MyServiceFee | PartialWithRequiredKeyOf<NewMyServiceFee>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends MyServiceFee | NewMyServiceFee> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type MyServiceFeeFormRawValue = FormValueOf<MyServiceFee>;

type NewMyServiceFeeFormRawValue = FormValueOf<NewMyServiceFee>;

type MyServiceFeeFormDefaults = Pick<NewMyServiceFee, 'id' | 'createdDate' | 'lastModifiedDate'>;

type MyServiceFeeFormGroupContent = {
  id: FormControl<MyServiceFeeFormRawValue['id'] | NewMyServiceFee['id']>;
  fee: FormControl<MyServiceFeeFormRawValue['fee']>;
  feeTypeId: FormControl<MyServiceFeeFormRawValue['feeTypeId']>;
  myServiceId: FormControl<MyServiceFeeFormRawValue['myServiceId']>;
  note: FormControl<MyServiceFeeFormRawValue['note']>;
  createdBy: FormControl<MyServiceFeeFormRawValue['createdBy']>;
  createdDate: FormControl<MyServiceFeeFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<MyServiceFeeFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<MyServiceFeeFormRawValue['lastModifiedDate']>;
};

export type MyServiceFeeFormGroup = FormGroup<MyServiceFeeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MyServiceFeeFormService {
  createMyServiceFeeFormGroup(myServiceFee: MyServiceFeeFormGroupInput = { id: null }): MyServiceFeeFormGroup {
    const myServiceFeeRawValue = this.convertMyServiceFeeToMyServiceFeeRawValue({
      ...this.getFormDefaults(),
      ...myServiceFee,
    });
    return new FormGroup<MyServiceFeeFormGroupContent>({
      id: new FormControl(
        { value: myServiceFeeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fee: new FormControl(myServiceFeeRawValue.fee, {
        validators: [Validators.required],
      }),
      feeTypeId: new FormControl(myServiceFeeRawValue.feeTypeId, {
        validators: [Validators.required],
      }),
      myServiceId: new FormControl(myServiceFeeRawValue.myServiceId, {
        validators: [Validators.required],
      }),
      note: new FormControl(myServiceFeeRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdBy: new FormControl(myServiceFeeRawValue.createdBy),
      createdDate: new FormControl(myServiceFeeRawValue.createdDate),
      lastModifiedBy: new FormControl(myServiceFeeRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(myServiceFeeRawValue.lastModifiedDate),
    });
  }

  getMyServiceFee(form: MyServiceFeeFormGroup): MyServiceFee | NewMyServiceFee {
    return this.convertMyServiceFeeRawValueToMyServiceFee(form.getRawValue() as MyServiceFeeFormRawValue | NewMyServiceFeeFormRawValue);
  }

  resetForm(form: MyServiceFeeFormGroup, myServiceFee: MyServiceFeeFormGroupInput): void {
    const myServiceFeeRawValue = this.convertMyServiceFeeToMyServiceFeeRawValue({ ...this.getFormDefaults(), ...myServiceFee });
    form.reset(
      {
        ...myServiceFeeRawValue,
        id: { value: myServiceFeeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MyServiceFeeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMyServiceFeeRawValueToMyServiceFee(
    rawMyServiceFee: MyServiceFeeFormRawValue | NewMyServiceFeeFormRawValue,
  ): MyServiceFee | NewMyServiceFee {
    return {
      ...rawMyServiceFee,
      createdDate: dayjs(rawMyServiceFee.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMyServiceFee.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMyServiceFeeToMyServiceFeeRawValue(
    myServiceFee: MyServiceFee | (Partial<NewMyServiceFee> & MyServiceFeeFormDefaults),
  ): MyServiceFeeFormRawValue | PartialWithRequiredKeyOf<NewMyServiceFeeFormRawValue> {
    return {
      ...myServiceFee,
      createdDate: myServiceFee.createdDate ? myServiceFee.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: myServiceFee.lastModifiedDate ? myServiceFee.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
