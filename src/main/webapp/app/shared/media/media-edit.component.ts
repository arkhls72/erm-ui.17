import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
// import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { Media } from 'app/entities/media/media.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { MediaService } from '../../entities/media/service/media.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-media-edit',
  templateUrl: './media-edit.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class MediaEditComponent implements OnInit {
  editMode = false;
  firstMediaNumber = 1;
  secondMediaNumber = 2;
  @Input()
  exercise?: Exercise;

  @Input()
  firstMediaId!: number | null | undefined;

  @Input()
  secondMediaId!: number | null | undefined;

  medias: Media[] = [];
  firstMedia!: Media;
  secondMedia!: Media;
  saveCancelMode = false;

  firstEditForm = this.fb.group({
    id: [],
    contentType: [],
    value: [],
    valueContentType: [],
    name: [],
  });

  secondEditForm = this.fb.group({
    id: [],
    contentType: [],
    value: [],
    valueContentType: [],
    name: [],
  });

  constructor(
    // protected dataUtils: JhiDataUtils,
    // protected eventManager: JhiEventManager,
    protected mediaService: MediaService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected ngIf: NgIf,
    protected ngFor: NgFor<any>,
  ) {}

  ngOnInit(): void {
    if (!this.firstMedia) {
      this.firstMedia = {} as Media;
    }

    if (!this.secondMedia) {
      this.secondMedia = {} as Media;
    }

    const mediaIds: number[] = [];
    if (this.firstMediaId) {
      mediaIds.push(this.firstMediaId);
    }

    if (this.secondMediaId) {
      mediaIds.push(this.secondMediaId);
    }
    if (mediaIds && mediaIds.length > 0) {
      this.mediaService
        .findByIds({
          ids: mediaIds,
        })
        .subscribe((res: HttpResponse<Media[]>) => this.onSuccess(res.body));
    }
  }

  updateForm(): void {
    if (this.firstMediaId) {
      const found = this.medias.find(m => m.id === this.firstMediaId);
      if (found) {
        this.firstMedia = found;
      }
    }
    if (this.secondMediaId) {
      const found = this.medias.find(m => m.id === this.secondMediaId);
      if (found) {
        this.secondMedia = found;
      }
    }
    const f1 = {} as any;
    f1.id = this.firstMedia.id;
    f1.contentType = this.firstMedia.contentType;
    f1.value = this.firstMedia.value;
    f1.valueContentType = this.firstMedia.valueContentType;
    f1.name = this.firstMedia.name;

    if (f1) {
      this.firstEditForm.patchValue({
        id: f1.id,
        contentType: f1.contentType,
        value: f1.value,
        valueContentType: f1.valueContentType,
        name: f1.name,
      });
    }

    const f2 = {} as any;
    f2.id = this.firstMedia.id;
    f2.contentType = this.firstMedia.contentType;
    f2.value = this.firstMedia.value;
    f2.valueContentType = this.firstMedia.valueContentType;
    f2.name = this.firstMedia.name;

    this.secondEditForm.patchValue({
      id: f2.id,
      contentType: f2.contentType,
      value: f2.value,
      valueContentType: f2.valueContentType,
      name: f2.name,
    });
  }

  byteSize(base64String: string): string {
    return '';
    // return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    // this.dataUtils.openFile(contentType, base64String);
  }

  setFirstFileData(event: any, field: string, isImage: boolean): void {
    if (event && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (isImage && file && !file.type.startsWith('image')) {
        return;
      }
      // this.dataUtils.toBase64(file, (base64Data: any) => {
      //   this.firstEditForm.patchValue({
      //     contentType: file.type,
      //     value: base64Data,
      //     valueContentType: file.type,
      //     name: file.name,
      //   });
      // });
      this.saveCancelMode = !this.saveCancelMode;
      this.saveCancelMode = true;
    }
  }

  setSecondFileData(event: any, field: string, isImage: boolean): void {
    if (event && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (isImage && file && !file.type.startsWith('image')) {
        return;
      }
      // this.dataUtils.toBase64(file, (base64Data: any) => {
      //   this.secondEditForm.patchValue({
      //     contentType: file.type,
      //     value: base64Data,
      //     valueContentType: file.type,
      //     name: file.name,
      //   });
      // });
      this.saveCancelMode = !this.saveCancelMode;
      this.saveCancelMode = true;
    }
  }

  // (click)="clearFirstInputImage('value', 'valueContentType', 'file_value')"></i>
  cancelFirst(field: string, fieldContentType: string) {
    this.firstEditForm.patchValue({
      [field]: this.firstMedia.value,
      [fieldContentType]: this.firstMedia.valueContentType,
    });
  }
  cancelSecond(field: string, fieldContentType: string) {
    const f2: any = {} as Media;
    f2.value = this.secondMedia.value;
    f2.name = this.secondMedia.name;
    this.secondEditForm.patchValue({
      [field]: f2.value,
      [fieldContentType]: f2.valueContentType,
      name: f2.name,
    });
  }

  clearFirstInputImage(field: string, fieldContentType: string, idInput: string): void {
    if (!this.editMode) {
      return;
    }
    const f1: any = {} as Media;
    f1.value = this.firstMedia.value;
    f1.name = this.firstMedia.name;

    this.firstEditForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
      name: f1.name,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
    this.saveCancelMode = true;
  }

  clearSecondInputImage(field: string, fieldContentType: string, idInput: string): void {
    if (!this.editMode) {
      return;
    }
    this.secondEditForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
      name: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
    this.saveCancelMode = true;
  }
  previousState(): void {
    window.history.back();
  }

  save(id: number): void {
    if (this.exercise && this.exercise.id) {
      if (id === 1) {
        const firstMedia = this.createFirstFromForm();
        if (this.firstMedia.id) {
          this.subscribeToSaveResponse(
            this.mediaService.updateForExercise(firstMedia, this.exercise.id, this.firstMediaNumber),
            this.firstMediaNumber,
          );
        } else {
          this.subscribeToSaveResponse(
            this.mediaService.createForExercise(firstMedia, this.exercise.id, this.firstMediaNumber),
            this.firstMediaNumber,
          );
        }
      }

      if (id === 2) {
        const secondMedia = this.createSecondFromForm();
        if (secondMedia.id) {
          this.subscribeToSaveResponse(
            this.mediaService.updateForExercise(secondMedia, this.exercise.id, this.secondMediaNumber),
            this.secondMediaNumber,
          );
        } else {
          this.subscribeToSaveResponse(
            this.mediaService.createForExercise(secondMedia, this.exercise.id, this.secondMediaNumber),
            this.secondMediaNumber,
          );
        }
      }
    }
  }

  private createFirstFromForm(): Media {
    return {
      ...({} as Media),
      id: this.firstEditForm.get(['id'])!.value,
      contentType: this.firstEditForm.get(['contentType'])!.value,
      valueContentType: this.firstEditForm.get(['valueContentType'])!.value,
      value: this.firstEditForm.get(['value'])!.value,
      name: this.firstEditForm.get(['name'])!.value,
    };
  }

  private createSecondFromForm(): Media {
    return {
      ...({} as Media),
      id: this.secondEditForm.get(['id'])!.value,
      contentType: this.secondEditForm.get(['contentType'])!.value,
      valueContentType: this.secondEditForm.get(['valueContentType'])!.value,
      value: this.secondEditForm.get(['value'])!.value,
      name: this.secondEditForm.get(['name'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Media>>, number: Number): void {
    result.subscribe(resp => this.onSaveSuccess(resp.body, number));
  }

  protected onSaveSuccess(resp?: Media | null, number?: Number): void {
    /* this.editMode = false;
    const x: any = document.getElementById('firstRadioId');
    x.checked = false;*/
    this.saveCancelMode = false;

    if (number === 1) {
      this.firstMedia = resp ? resp : ({} as Media);
      this.firstMediaId = this.firstMedia ? this.firstMedia.id : undefined;
    } else {
      this.secondMedia = resp ? resp : ({} as Media);
      this.secondMediaId = this.secondMedia ? this.secondMedia.id : undefined;
    }

    this.updateForm();
    this.saveCancelMode = false;
  }

  protected onSaveError(): void {}

  radioEditable(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    if (this.saveCancelMode) {
      // (click)="clearFirstInputImage('value', 'valueContentType', 'file_value')"></i>
      if (this.firstMedia) {
        const f1: any = {} as Media;
        f1.valueContentType = this.firstMedia.valueContentType;
        f1.name = this.firstMedia.name;
        this.firstEditForm.patchValue({
          ['value']: this.firstMedia.value,
          ['valueContentType']: f1.valueContentType,
          name: f1.name,
        });
      } else {
        this.firstEditForm.patchValue({
          ['value']: null,
          ['valueContentType']: null,
          name: null,
        });
      }

      if (this.secondMedia) {
        const f2: any = {} as Media;
        f2.valueContentType = this.firstMedia.valueContentType;
        f2.name = this.firstMedia.name;
        this.secondEditForm.patchValue({
          ['value']: f2.value,
          ['valueContentType']: f2.valueContentType,
          name: f2.name,
        });
      } else {
        this.secondEditForm.patchValue({
          ['value']: null,
          ['valueContentType']: null,
          name: null,
        });
      }
      this.saveCancelMode = false;
    }
  }
  protected onSuccess(data: Media[] | null): void {
    this.medias = data || [];
    this.updateForm();
  }
}
