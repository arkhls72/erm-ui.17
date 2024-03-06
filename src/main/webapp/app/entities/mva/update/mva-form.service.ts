import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Mva, NewMva } from '../mva.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Mva for edit and NewMvaFormGroupInput for create.
 */
type MvaFormGroupInput = Mva | PartialWithRequiredKeyOf<NewMva>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Mva | NewMva> = Omit<T, 'accidentDate' | 'closeDate' | 'createdDate' | 'lastModifiedDate'> & {
  accidentDate?: string | null;
  closeDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type MvaFormRawValue = FormValueOf<Mva>;

type NewMvaFormRawValue = FormValueOf<NewMva>;

type MvaFormDefaults = Pick<NewMva, 'id' | 'accidentDate' | 'closeDate' | 'createdDate' | 'lastModifiedDate'>;

type MvaFormGroupContent = {
  id: FormControl<MvaFormRawValue['id'] | NewMva['id']>;
  insurance: FormControl<MvaFormRawValue['insurance']>;
  clientId: FormControl<MvaFormRawValue['clientId']>;
  claimNumber: FormControl<MvaFormRawValue['claimNumber']>;
  accidentDate: FormControl<MvaFormRawValue['accidentDate']>;
  adjuster: FormControl<MvaFormRawValue['adjuster']>;
  status: FormControl<MvaFormRawValue['status']>;
  closeDate: FormControl<MvaFormRawValue['closeDate']>;
  phoneExtension: FormControl<MvaFormRawValue['phoneExtension']>;
  cellPhone: FormControl<MvaFormRawValue['cellPhone']>;
  fax: FormControl<MvaFormRawValue['fax']>;
  email: FormControl<MvaFormRawValue['email']>;
  note: FormControl<MvaFormRawValue['note']>;
  addressId: FormControl<MvaFormRawValue['address']>;
  coverages: FormControl<MvaFormRawValue['coverages']>;
  createdDate: FormControl<MvaFormRawValue['createdDate']>;
  createdBy: FormControl<MvaFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<MvaFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<MvaFormRawValue['lastModifiedDate']>;
  phone: FormControl<MvaFormRawValue['phone']>;
};

export type MvaFormGroup = FormGroup<MvaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MvaFormService {
  createMvaFormGroup(mva: MvaFormGroupInput = { id: null }): MvaFormGroup {
    const mvaRawValue = this.convertMvaToMvaRawValue({
      ...this.getFormDefaults(),
      ...mva,
    });
    return new FormGroup<MvaFormGroupContent>({
      id: new FormControl(
        { value: mvaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      insurance: new FormControl(mvaRawValue.insurance, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      clientId: new FormControl(mvaRawValue.clientId, {
        validators: [Validators.required],
      }),
      claimNumber: new FormControl(mvaRawValue.claimNumber, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      accidentDate: new FormControl(mvaRawValue.accidentDate, {
        validators: [Validators.required],
      }),
      adjuster: new FormControl(mvaRawValue.adjuster, {
        validators: [Validators.maxLength(50)],
      }),
      status: new FormControl(mvaRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      closeDate: new FormControl(mvaRawValue.closeDate),
      phoneExtension: new FormControl(mvaRawValue.phoneExtension, {
        validators: [Validators.maxLength(15)],
      }),
      cellPhone: new FormControl(mvaRawValue.cellPhone, {
        validators: [Validators.maxLength(15)],
      }),
      fax: new FormControl(mvaRawValue.fax),
      email: new FormControl(mvaRawValue.email, {
        validators: [Validators.maxLength(320)],
      }),
      note: new FormControl(mvaRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      addressId: new FormControl(mvaRawValue.address),
      coverages: new FormControl(mvaRawValue.coverages),
      createdDate: new FormControl(mvaRawValue.createdDate),
      createdBy: new FormControl(mvaRawValue.createdBy),
      lastModifiedBy: new FormControl(mvaRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(mvaRawValue.lastModifiedDate),
      phone: new FormControl(mvaRawValue.phone, {
        validators: [Validators.maxLength(15)],
      }),
    });
  }

  getMva(form: MvaFormGroup): Mva | NewMva {
    return this.convertMvaRawValueToMva(form.getRawValue() as MvaFormRawValue | NewMvaFormRawValue);
  }

  resetForm(form: MvaFormGroup, mva: MvaFormGroupInput): void {
    const mvaRawValue = this.convertMvaToMvaRawValue({ ...this.getFormDefaults(), ...mva });
    form.reset(
      {
        ...mvaRawValue,
        id: { value: mvaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MvaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      accidentDate: currentTime,
      closeDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMvaRawValueToMva(rawMva: MvaFormRawValue | NewMvaFormRawValue): Mva | NewMva {
    return {
      ...rawMva,
      accidentDate: dayjs(rawMva.accidentDate, DATE_TIME_FORMAT),
      closeDate: dayjs(rawMva.closeDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawMva.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMva.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMvaToMvaRawValue(
    mva: Mva | (Partial<NewMva> & MvaFormDefaults),
  ): MvaFormRawValue | PartialWithRequiredKeyOf<NewMvaFormRawValue> {
    return {
      ...mva,
      accidentDate: mva.accidentDate ? mva.accidentDate.format(DATE_TIME_FORMAT) : undefined,
      closeDate: mva.closeDate ? mva.closeDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: mva.createdDate ? mva.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: mva.lastModifiedDate ? mva.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
