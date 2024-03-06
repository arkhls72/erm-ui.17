import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { MyProductFee, NewMyProductFee } from '../my-product-fee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts MyProductFee for edit and NewMyProductFeeFormGroupInput for create.
 */
type MyProductFeeFormGroupInput = MyProductFee | PartialWithRequiredKeyOf<NewMyProductFee>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends MyProductFee | NewMyProductFee> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type MyProductFeeFormRawValue = FormValueOf<MyProductFee>;

type NewMyProductFeeFormRawValue = FormValueOf<NewMyProductFee>;

type MyProductFeeFormDefaults = Pick<NewMyProductFee, 'id' | 'createdDate' | 'lastModifiedDate'>;

type MyProductFeeFormGroupContent = {
  id: FormControl<MyProductFeeFormRawValue['id'] | NewMyProductFee['id']>;
  fee: FormControl<MyProductFeeFormRawValue['fee']>;
  feeTypeId: FormControl<MyProductFeeFormRawValue['feeTypeId']>;
  feeTypeName: FormControl<MyProductFeeFormRawValue['feeTypeName']>;
  myProductId: FormControl<MyProductFeeFormRawValue['myProductId']>;
  createdDate: FormControl<MyProductFeeFormRawValue['createdDate']>;
  createdBy: FormControl<MyProductFeeFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<MyProductFeeFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<MyProductFeeFormRawValue['lastModifiedDate']>;
};

export type MyProductFeeFormGroup = FormGroup<MyProductFeeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MyProductFeeFormService {
  createMyProductFeeFormGroup(myProductFee: MyProductFeeFormGroupInput = { id: null }): MyProductFeeFormGroup {
    const myProductFeeRawValue = this.convertMyProductFeeToMyProductFeeRawValue({
      ...this.getFormDefaults(),
      ...myProductFee,
    });
    return new FormGroup<MyProductFeeFormGroupContent>({
      id: new FormControl(
        { value: myProductFeeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fee: new FormControl(myProductFeeRawValue.fee, {
        validators: [Validators.required],
      }),
      feeTypeId: new FormControl(myProductFeeRawValue.feeTypeId, {
        validators: [Validators.required],
      }),
      feeTypeName: new FormControl(myProductFeeRawValue.feeTypeName, {
        validators: [Validators.required],
      }),
      myProductId: new FormControl(myProductFeeRawValue.myProductId, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(myProductFeeRawValue.createdDate),
      createdBy: new FormControl(myProductFeeRawValue.createdBy),
      lastModifiedBy: new FormControl(myProductFeeRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(myProductFeeRawValue.lastModifiedDate),
    });
  }

  getMyProductFee(form: MyProductFeeFormGroup): MyProductFee | NewMyProductFee {
    return this.convertMyProductFeeRawValueToMyProductFee(form.getRawValue() as MyProductFeeFormRawValue | NewMyProductFeeFormRawValue);
  }

  resetForm(form: MyProductFeeFormGroup, myProductFee: MyProductFeeFormGroupInput): void {
    const myProductFeeRawValue = this.convertMyProductFeeToMyProductFeeRawValue({ ...this.getFormDefaults(), ...myProductFee });
    form.reset(
      {
        ...myProductFeeRawValue,
        id: { value: myProductFeeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MyProductFeeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMyProductFeeRawValueToMyProductFee(
    rawMyProductFee: MyProductFeeFormRawValue | NewMyProductFeeFormRawValue,
  ): MyProductFee | NewMyProductFee {
    return {
      ...rawMyProductFee,
      createdDate: dayjs(rawMyProductFee.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMyProductFee.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMyProductFeeToMyProductFeeRawValue(
    myProductFee: MyProductFee | (Partial<NewMyProductFee> & MyProductFeeFormDefaults),
  ): MyProductFeeFormRawValue | PartialWithRequiredKeyOf<NewMyProductFeeFormRawValue> {
    return {
      ...myProductFee,
      createdDate: myProductFee.createdDate ? myProductFee.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: myProductFee.lastModifiedDate ? myProductFee.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
