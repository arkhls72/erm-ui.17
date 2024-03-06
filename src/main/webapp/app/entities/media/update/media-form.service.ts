import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Media, NewMedia } from '../media.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts Media for edit and NewMediaFormGroupInput for create.
 */
type MediaFormGroupInput = Media | PartialWithRequiredKeyOf<NewMedia>;

type MediaFormDefaults = Pick<NewMedia, 'id'>;

type MediaFormGroupContent = {
  id: FormControl<Media['id'] | NewMedia['id']>;
  contentType: FormControl<Media['contentType']>;
  valueContentType: FormControl<Media['valueContentType']>;
  value: FormControl<Media['value']>;
  name: FormControl<Media['name']>;
};

export type MediaFormGroup = FormGroup<MediaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MediaFormService {
  createMediaFormGroup(media: MediaFormGroupInput = { id: null }): MediaFormGroup {
    const mediaRawValue = {
      ...this.getFormDefaults(),
      ...media,
    };
    return new FormGroup<MediaFormGroupContent>({
      id: new FormControl(
        { value: mediaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      contentType: new FormControl(mediaRawValue.contentType),
      valueContentType: new FormControl(mediaRawValue.valueContentType),
      value: new FormControl(mediaRawValue.value),
      name: new FormControl(mediaRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
    });
  }

  getMedia(form: MediaFormGroup): Media | NewMedia {
    return form.getRawValue() as Media | NewMedia;
  }

  resetForm(form: MediaFormGroup, media: MediaFormGroupInput): void {
    const mediaRawValue = { ...this.getFormDefaults(), ...media };
    form.reset(
      {
        ...mediaRawValue,
        id: { value: mediaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MediaFormDefaults {
    return {
      id: null,
    };
  }
}
