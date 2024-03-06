import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServiceType, NewServiceType } from '../service-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ServiceType for edit and NewServiceTypeFormGroupInput for create.
 */
type ServiceTypeFormGroupInput = ServiceType | PartialWithRequiredKeyOf<NewServiceType>;

type ServiceTypeFormDefaults = Pick<NewServiceType, 'id'>;

type ServiceTypeFormGroupContent = {
  id: FormControl<ServiceType['id'] | NewServiceType['id']>;
  name: FormControl<ServiceType['name']>;
};

export type ServiceTypeFormGroup = FormGroup<ServiceTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ServiceTypeFormService {
  createServiceTypeFormGroup(serviceType: ServiceTypeFormGroupInput = { id: null }): ServiceTypeFormGroup {
    const serviceTypeRawValue = {
      ...this.getFormDefaults(),
      ...serviceType,
    };
    return new FormGroup<ServiceTypeFormGroupContent>({
      id: new FormControl(
        { value: serviceTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(serviceTypeRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getServiceType(form: ServiceTypeFormGroup): ServiceType | NewServiceType {
    return form.getRawValue() as ServiceType | NewServiceType;
  }

  resetForm(form: ServiceTypeFormGroup, serviceType: ServiceTypeFormGroupInput): void {
    const serviceTypeRawValue = { ...this.getFormDefaults(), ...serviceType };
    form.reset(
      {
        ...serviceTypeRawValue,
        id: { value: serviceTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ServiceTypeFormDefaults {
    return {
      id: null,
    };
  }
}
