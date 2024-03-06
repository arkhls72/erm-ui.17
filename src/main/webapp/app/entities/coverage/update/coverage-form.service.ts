import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Coverage, NewCoverage } from '../coverage.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Coverage for edit and NewCoverageFormGroupInput for create.
 */
type CoverageFormGroupInput = Coverage | PartialWithRequiredKeyOf<NewCoverage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Coverage | NewCoverage> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

type CoverageFormRawValue = FormValueOf<Coverage>;

type NewCoverageFormRawValue = FormValueOf<NewCoverage>;

type CoverageFormDefaults = Pick<NewCoverage, 'id' | 'createdDate'>;

type CoverageFormGroupContent = {
  id: FormControl<CoverageFormRawValue['id'] | NewCoverage['id']>;
  therapyId: FormControl<CoverageFormRawValue['therapyId']>;
  ehcId: FormControl<CoverageFormRawValue['ehcId']>;
  wsibId: FormControl<CoverageFormRawValue['wsibId']>;
  mvaId: FormControl<CoverageFormRawValue['mvaId']>;
  limit: FormControl<CoverageFormRawValue['limit']>;
  note: FormControl<CoverageFormRawValue['note']>;
  lastModifiedName: FormControl<CoverageFormRawValue['lastModifiedDate']>;
  lastModifiedBy: FormControl<CoverageFormRawValue['lastModifiedBy']>;
  createdDate: FormControl<CoverageFormRawValue['createdDate']>;
  createdBy: FormControl<CoverageFormRawValue['createdBy']>;
};

export type CoverageFormGroup = FormGroup<CoverageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CoverageFormService {
  createCoverageFormGroup(coverage: CoverageFormGroupInput = { id: null }): CoverageFormGroup {
    const coverageRawValue = this.convertCoverageToCoverageRawValue({
      ...this.getFormDefaults(),
      ...coverage,
    });
    return new FormGroup<CoverageFormGroupContent>({
      id: new FormControl(
        { value: coverageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      therapyId: new FormControl(coverageRawValue.therapyId),
      ehcId: new FormControl(coverageRawValue.ehcId),
      wsibId: new FormControl(coverageRawValue.wsibId),
      mvaId: new FormControl(coverageRawValue.mvaId),
      limit: new FormControl(coverageRawValue.limit),
      note: new FormControl(coverageRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      lastModifiedName: new FormControl(coverageRawValue.lastModifiedDate),
      lastModifiedBy: new FormControl(coverageRawValue.lastModifiedBy),
      createdDate: new FormControl(coverageRawValue.createdDate),
      createdBy: new FormControl(coverageRawValue.createdBy),
    });
  }

  getCoverage(form: CoverageFormGroup): Coverage | NewCoverage {
    return this.convertCoverageRawValueToCoverage(form.getRawValue() as CoverageFormRawValue | NewCoverageFormRawValue);
  }

  resetForm(form: CoverageFormGroup, coverage: CoverageFormGroupInput): void {
    const coverageRawValue = this.convertCoverageToCoverageRawValue({ ...this.getFormDefaults(), ...coverage });
    form.reset(
      {
        ...coverageRawValue,
        id: { value: coverageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CoverageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
    };
  }

  private convertCoverageRawValueToCoverage(rawCoverage: CoverageFormRawValue | NewCoverageFormRawValue): Coverage | NewCoverage {
    return {
      ...rawCoverage,
      createdDate: dayjs(rawCoverage.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertCoverageToCoverageRawValue(
    coverage: Coverage | (Partial<NewCoverage> & CoverageFormDefaults),
  ): CoverageFormRawValue | PartialWithRequiredKeyOf<NewCoverageFormRawValue> {
    return {
      ...coverage,
      createdDate: coverage.createdDate ? coverage.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
