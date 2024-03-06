import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Injury, NewInjury } from '../injury.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Injury for edit and NewInjuryFormGroupInput for create.
 */
type InjuryFormGroupInput = Injury | PartialWithRequiredKeyOf<NewInjury>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Injury | NewInjury> = Omit<T, 'happenDate' | 'createdDate' | 'lastModifiedDate'> & {
  happenDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InjuryFormRawValue = FormValueOf<Injury>;

type NewInjuryFormRawValue = FormValueOf<NewInjury>;

type InjuryFormDefaults = Pick<NewInjury, 'id' | 'happenDate' | 'createdDate' | 'lastModifiedDate'>;

type InjuryFormGroupContent = {
  id: FormControl<InjuryFormRawValue['id'] | NewInjury['id']>;
  nameType: FormControl<InjuryFormRawValue['nameType']>;
  happenDate: FormControl<InjuryFormRawValue['happenDate']>;
  note: FormControl<InjuryFormRawValue['note']>;
  createdDate: FormControl<InjuryFormRawValue['createdDate']>;
  createdBy: FormControl<InjuryFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<InjuryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<InjuryFormRawValue['lastModifiedDate']>;
};

export type InjuryFormGroup = FormGroup<InjuryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InjuryFormService {
  createInjuryFormGroup(injury: InjuryFormGroupInput = { id: null }): InjuryFormGroup {
    const injuryRawValue = this.convertInjuryToInjuryRawValue({
      ...this.getFormDefaults(),
      ...injury,
    });
    return new FormGroup<InjuryFormGroupContent>({
      id: new FormControl(
        { value: injuryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nameType: new FormControl(injuryRawValue.nameType, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      happenDate: new FormControl(injuryRawValue.happenDate, {
        validators: [Validators.required],
      }),
      note: new FormControl(injuryRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdDate: new FormControl(injuryRawValue.createdDate),
      createdBy: new FormControl(injuryRawValue.createdBy),
      lastModifiedBy: new FormControl(injuryRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(injuryRawValue.lastModifiedDate),
    });
  }

  getInjury(form: InjuryFormGroup): Injury | NewInjury {
    return this.convertInjuryRawValueToInjury(form.getRawValue() as InjuryFormRawValue | NewInjuryFormRawValue);
  }

  resetForm(form: InjuryFormGroup, injury: InjuryFormGroupInput): void {
    const injuryRawValue = this.convertInjuryToInjuryRawValue({ ...this.getFormDefaults(), ...injury });
    form.reset(
      {
        ...injuryRawValue,
        id: { value: injuryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InjuryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      happenDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertInjuryRawValueToInjury(rawInjury: InjuryFormRawValue | NewInjuryFormRawValue): Injury | NewInjury {
    return {
      ...rawInjury,
      happenDate: dayjs(rawInjury.happenDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawInjury.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInjury.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInjuryToInjuryRawValue(
    injury: Injury | (Partial<NewInjury> & InjuryFormDefaults),
  ): InjuryFormRawValue | PartialWithRequiredKeyOf<NewInjuryFormRawValue> {
    return {
      ...injury,
      happenDate: injury.happenDate ? injury.happenDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: injury.createdDate ? injury.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: injury.lastModifiedDate ? injury.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
