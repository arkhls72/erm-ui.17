import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Countries, NewCountries } from '../countries.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Countries for edit and NewCountriesFormGroupInput for create.
 */
type CountriesFormGroupInput = Countries | PartialWithRequiredKeyOf<NewCountries>;

type CountriesFormDefaults = Pick<NewCountries, 'id'>;

type CountriesFormGroupContent = {
  id: FormControl<Countries['id'] | NewCountries['id']>;
  name: FormControl<Countries['name']>;
};

export type CountriesFormGroup = FormGroup<CountriesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CountriesFormService {
  createCountriesFormGroup(countries: CountriesFormGroupInput = { id: null }): CountriesFormGroup {
    const countriesRawValue = {
      ...this.getFormDefaults(),
      ...countries,
    };
    return new FormGroup<CountriesFormGroupContent>({
      id: new FormControl(
        { value: countriesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(countriesRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
    });
  }

  getCountries(form: CountriesFormGroup): Countries | NewCountries {
    return form.getRawValue() as Countries | NewCountries;
  }

  resetForm(form: CountriesFormGroup, countries: CountriesFormGroupInput): void {
    const countriesRawValue = { ...this.getFormDefaults(), ...countries };
    form.reset(
      {
        ...countriesRawValue,
        id: { value: countriesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CountriesFormDefaults {
    return {
      id: null,
    };
  }
}
