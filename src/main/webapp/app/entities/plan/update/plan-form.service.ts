import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Plan, NewPlan } from '../plan.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Plan for edit and NewPlanFormGroupInput for create.
 */
type PlanFormGroupInput = Plan | PartialWithRequiredKeyOf<NewPlan>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Plan | NewPlan> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PlanFormRawValue = FormValueOf<Plan>;

type NewPlanFormRawValue = FormValueOf<NewPlan>;

type PlanFormDefaults = Pick<NewPlan, 'id' | 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'>;

type PlanFormGroupContent = {
  id: FormControl<PlanFormRawValue['id'] | NewPlan['id']>;
  name: FormControl<PlanFormRawValue['name']>;
  status: FormControl<PlanFormRawValue['status']>;
  clientId: FormControl<PlanFormRawValue['clientId']>;
  startDate: FormControl<PlanFormRawValue['startDate']>;
  endDate: FormControl<PlanFormRawValue['endDate']>;
  assessmentId: FormControl<PlanFormRawValue['assessmentId']>;
  assessment: FormControl<PlanFormRawValue['assessment']>;
  programs: FormControl<PlanFormRawValue['programs']>;
  clinicalNote: FormControl<PlanFormRawValue['clinicalNote']>;
  createdDate: FormControl<PlanFormRawValue['createdDate']>;
  createdBy: FormControl<PlanFormRawValue['createdBy']>;
  lastModifiedDate: FormControl<PlanFormRawValue['lastModifiedDate']>;
  lastmodifiedBy: FormControl<PlanFormRawValue['lastModifiedBy']>;
};

export type PlanFormGroup = FormGroup<PlanFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlanFormService {
  createPlanFormGroup(plan: PlanFormGroupInput = { id: null }): PlanFormGroup {
    const planRawValue = this.convertPlanToPlanRawValue({
      ...this.getFormDefaults(),
      ...plan,
    });
    return new FormGroup<PlanFormGroupContent>({
      id: new FormControl(
        { value: planRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(planRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      status: new FormControl(planRawValue.status, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      clientId: new FormControl(planRawValue.clientId, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(planRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(planRawValue.endDate, {
        validators: [Validators.required],
      }),
      assessmentId: new FormControl(planRawValue.assessmentId, {
        validators: [Validators.required],
      }),
      assessment: new FormControl(planRawValue.assessment, {
        validators: [Validators.required],
      }),
      programs: new FormControl(planRawValue.programs, {
        validators: [Validators.required],
      }),
      clinicalNote: new FormControl(planRawValue.clinicalNote, {
        validators: [Validators.maxLength(350)],
      }),
      createdDate: new FormControl(planRawValue.createdDate),
      createdBy: new FormControl(planRawValue.createdBy),
      lastModifiedDate: new FormControl(planRawValue.lastModifiedDate),
      lastmodifiedBy: new FormControl(planRawValue.lastModifiedBy),
    });
  }

  getPlan(form: PlanFormGroup): Plan | NewPlan {
    return this.convertPlanRawValueToPlan(form.getRawValue() as PlanFormRawValue | NewPlanFormRawValue);
  }

  resetForm(form: PlanFormGroup, plan: PlanFormGroupInput): void {
    const planRawValue = this.convertPlanToPlanRawValue({ ...this.getFormDefaults(), ...plan });
    form.reset(
      {
        ...planRawValue,
        id: { value: planRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PlanFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPlanRawValueToPlan(rawPlan: PlanFormRawValue | NewPlanFormRawValue): Plan | NewPlan {
    return {
      ...rawPlan,
      startDate: dayjs(rawPlan.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawPlan.endDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawPlan.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPlan.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPlanToPlanRawValue(
    plan: Plan | (Partial<NewPlan> & PlanFormDefaults),
  ): PlanFormRawValue | PartialWithRequiredKeyOf<NewPlanFormRawValue> {
    return {
      ...plan,
      startDate: plan.startDate ? plan.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: plan.endDate ? plan.endDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: plan.createdDate ? plan.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: plan.lastModifiedDate ? plan.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
