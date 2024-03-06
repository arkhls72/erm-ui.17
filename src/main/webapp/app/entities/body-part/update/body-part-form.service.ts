import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BodyPart, NewBodyPart } from '../body-part.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts BodyPart for edit and NewBodyPartFormGroupInput for create.
 */
type BodyPartFormGroupInput = BodyPart | PartialWithRequiredKeyOf<NewBodyPart>;

type BodyPartFormDefaults = Pick<NewBodyPart, 'id'>;

type BodyPartFormGroupContent = {
  id: FormControl<BodyPart['id'] | NewBodyPart['id']>;
  name: FormControl<BodyPart['name']>;
};

export type BodyPartFormGroup = FormGroup<BodyPartFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BodyPartFormService {
  createBodyPartFormGroup(bodyPart: BodyPartFormGroupInput = { id: null }): BodyPartFormGroup {
    const bodyPartRawValue = {
      ...this.getFormDefaults(),
      ...bodyPart,
    };
    return new FormGroup<BodyPartFormGroupContent>({
      id: new FormControl(
        { value: bodyPartRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(bodyPartRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getBodyPart(form: BodyPartFormGroup): BodyPart | NewBodyPart {
    return form.getRawValue() as BodyPart | NewBodyPart;
  }

  resetForm(form: BodyPartFormGroup, bodyPart: BodyPartFormGroupInput): void {
    const bodyPartRawValue = { ...this.getFormDefaults(), ...bodyPart };
    form.reset(
      {
        ...bodyPartRawValue,
        id: { value: bodyPartRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BodyPartFormDefaults {
    return {
      id: null,
    };
  }
}
