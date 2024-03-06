import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Condition, NewCondition } from '../condition.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Condition for edit and NewConditionFormGroupInput for create.
 */
type ConditionFormGroupInput = Condition | PartialWithRequiredKeyOf<NewCondition>;

type ConditionFormDefaults = Pick<NewCondition, 'id'>;

type ConditionFormGroupContent = {
  id: FormControl<Condition['id'] | NewCondition['id']>;
  name: FormControl<Condition['name']>;
};

export type ConditionFormGroup = FormGroup<ConditionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConditionFormService {
  createConditionFormGroup(condition: ConditionFormGroupInput = { id: null }): ConditionFormGroup {
    const conditionRawValue = {
      ...this.getFormDefaults(),
      ...condition,
    };
    return new FormGroup<ConditionFormGroupContent>({
      id: new FormControl(
        { value: conditionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(conditionRawValue.name, {
        validators: [Validators.minLength(1), Validators.maxLength(50)],
      }),
    });
  }

  getCondition(form: ConditionFormGroup): Condition | NewCondition {
    return form.getRawValue() as Condition | NewCondition;
  }

  resetForm(form: ConditionFormGroup, condition: ConditionFormGroupInput): void {
    const conditionRawValue = { ...this.getFormDefaults(), ...condition };
    form.reset(
      {
        ...conditionRawValue,
        id: { value: conditionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConditionFormDefaults {
    return {
      id: null,
    };
  }
}
