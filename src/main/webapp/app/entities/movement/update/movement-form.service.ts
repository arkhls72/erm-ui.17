import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Movement, NewMovement } from '../movement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Movement for edit and NewMovementFormGroupInput for create.
 */
type MovementFormGroupInput = Movement | PartialWithRequiredKeyOf<NewMovement>;

type MovementFormDefaults = Pick<NewMovement, 'id'>;

type MovementFormGroupContent = {
  id: FormControl<Movement['id'] | NewMovement['id']>;
  name: FormControl<Movement['name']>;
};

export type MovementFormGroup = FormGroup<MovementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MovementFormService {
  createMovementFormGroup(movement: MovementFormGroupInput = { id: null }): MovementFormGroup {
    const movementRawValue = {
      ...this.getFormDefaults(),
      ...movement,
    };
    return new FormGroup<MovementFormGroupContent>({
      id: new FormControl(
        { value: movementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(movementRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getMovement(form: MovementFormGroup): Movement | NewMovement {
    return form.getRawValue() as Movement | NewMovement;
  }

  resetForm(form: MovementFormGroup, movement: MovementFormGroupInput): void {
    const movementRawValue = { ...this.getFormDefaults(), ...movement };
    form.reset(
      {
        ...movementRawValue,
        id: { value: movementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MovementFormDefaults {
    return {
      id: null,
    };
  }
}
