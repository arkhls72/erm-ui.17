import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Province, NewProvince } from '../province.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Province for edit and NewProvinceFormGroupInput for create.
 */
type ProvinceFormGroupInput = Province | PartialWithRequiredKeyOf<NewProvince>;

type ProvinceFormDefaults = Pick<NewProvince, 'id'>;

type ProvinceFormGroupContent = {
  id: FormControl<Province['id'] | NewProvince['id']>;
  name: FormControl<Province['name']>;
};

export type ProvinceFormGroup = FormGroup<ProvinceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProvinceFormService {
  createProvinceFormGroup(province: ProvinceFormGroupInput = { id: null }): ProvinceFormGroup {
    const provinceRawValue = {
      ...this.getFormDefaults(),
      ...province,
    };
    return new FormGroup<ProvinceFormGroupContent>({
      id: new FormControl(
        { value: provinceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(provinceRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getProvince(form: ProvinceFormGroup): Province | NewProvince {
    return form.getRawValue() as Province | NewProvince;
  }

  resetForm(form: ProvinceFormGroup, province: ProvinceFormGroupInput): void {
    const provinceRawValue = { ...this.getFormDefaults(), ...province };
    form.reset(
      {
        ...provinceRawValue,
        id: { value: provinceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProvinceFormDefaults {
    return {
      id: null,
    };
  }
}
