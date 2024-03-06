import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Operation, NewOperation } from '../operation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Operation for edit and NewOperationFormGroupInput for create.
 */
type OperationFormGroupInput = Operation | PartialWithRequiredKeyOf<NewOperation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends Operation | NewOperation> = Omit<T, 'operationDate' | 'createdDate' | 'lastModifiedDate'> & {
  operationDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type OperationFormRawValue = FormValueOf<Operation>;

type NewOperationFormRawValue = FormValueOf<NewOperation>;

type OperationFormDefaults = Pick<NewOperation, 'id' | 'operationDate' | 'createdDate' | 'lastModifiedDate'>;

type OperationFormGroupContent = {
  id: FormControl<OperationFormRawValue['id'] | NewOperation['id']>;
  name: FormControl<OperationFormRawValue['name']>;
  operationDate: FormControl<OperationFormRawValue['operationDate']>;
  reasonFor: FormControl<OperationFormRawValue['reasonFor']>;
  note: FormControl<OperationFormRawValue['note']>;
  createdDate: FormControl<OperationFormRawValue['createdDate']>;
  createdBy: FormControl<OperationFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<OperationFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<OperationFormRawValue['lastModifiedDate']>;
};

export type OperationFormGroup = FormGroup<OperationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OperationFormService {
  createOperationFormGroup(operation: OperationFormGroupInput = { id: null }): OperationFormGroup {
    const operationRawValue = this.convertOperationToOperationRawValue({
      ...this.getFormDefaults(),
      ...operation,
    });
    return new FormGroup<OperationFormGroupContent>({
      id: new FormControl(
        { value: operationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(operationRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      operationDate: new FormControl(operationRawValue.operationDate, {
        validators: [Validators.required],
      }),
      reasonFor: new FormControl(operationRawValue.reasonFor, {
        validators: [Validators.maxLength(50)],
      }),
      note: new FormControl(operationRawValue.note, {
        validators: [Validators.maxLength(350)],
      }),
      createdDate: new FormControl(operationRawValue.createdDate),
      createdBy: new FormControl(operationRawValue.createdBy),
      lastModifiedBy: new FormControl(operationRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(operationRawValue.lastModifiedDate),
    });
  }

  getOperation(form: OperationFormGroup): Operation | NewOperation {
    return this.convertOperationRawValueToOperation(form.getRawValue() as OperationFormRawValue | NewOperationFormRawValue);
  }

  resetForm(form: OperationFormGroup, operation: OperationFormGroupInput): void {
    const operationRawValue = this.convertOperationToOperationRawValue({ ...this.getFormDefaults(), ...operation });
    form.reset(
      {
        ...operationRawValue,
        id: { value: operationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OperationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      operationDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertOperationRawValueToOperation(rawOperation: OperationFormRawValue | NewOperationFormRawValue): Operation | NewOperation {
    return {
      ...rawOperation,
      operationDate: dayjs(rawOperation.operationDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawOperation.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawOperation.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertOperationToOperationRawValue(
    operation: Operation | (Partial<NewOperation> & OperationFormDefaults),
  ): OperationFormRawValue | PartialWithRequiredKeyOf<NewOperationFormRawValue> {
    return {
      ...operation,
      operationDate: operation.operationDate ? operation.operationDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: operation.createdDate ? operation.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: operation.lastModifiedDate ? operation.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
