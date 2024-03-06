import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Mva } from 'app/entities/mva/mva.model';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import dayjs from 'dayjs/esm';
import { MvaService } from '../../../mva/service/mva.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'bc-mva-edit',
  templateUrl: './mva-edit.component.html',
  imports: [ReactiveFormsModule, NgbInputDatepicker, FaIconComponent, NgIf, NgForOf],
})
export class MvaEditComponent implements OnInit {
  @Input()
  client!: Client;

  @Input()
  selectedMva!: Mva;
  statuses!: string[];

  editMode = false;

  isSaving = false;
  accidentDateDp: any;
  closeDateDp: any;

  editForm = this.fb.group({
    id: [],
    insurance: [null, [Validators.required, Validators.maxLength(50)]],
    clientId: [],
    claimNumber: [null, [Validators.maxLength(50)]],
    accidentDate: [null, [Validators.required]],
    adjuster: [null, [Validators.maxLength(50)]],
    status: [null, [Validators.maxLength(15)]],
    closeDate: [],
    phoneExtension: [null, [Validators.maxLength(10)]],
    cellPhone: [null, [Validators.maxLength(12)]],
    fax: [null, [Validators.maxLength(12)]],
    email: [null, [Validators.maxLength(50)]],
    note: [null, [Validators.maxLength(350)]],
    addressId: [],
    coverageId: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
    phone: [null, [Validators.maxLength(12)]],
  });

  constructor(
    protected mvaService: MvaService,
    private datePipe: DatePipe,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initListBox();
    if (this.selectedMva && !this.selectedMva.id) {
      const today = dayjs().startOf('day');
      this.selectedMva.lastModifiedDate = today;
    }
    this.updateForm(this.selectedMva);
  }

  updateForm(mva: any): void {
    this.editForm.patchValue({
      id: mva.id,
      insurance: mva.insurance,
      clientId: mva.clientId,
      claimNumber: mva.claimNumber,
      accidentDate: this.editMode ? mva.accidentDate : this.datePipe.transform(mva.accidentDate, 'yyyy-MM-dd')!,
      adjuster: mva.adjuster,
      status: mva.status,
      closeDate: this.editMode ? mva.closeDate : this.datePipe.transform(mva.closeDate, 'yyyy-MM-dd')!,
      phoneExtension: mva.phoneExtension,
      cellPhone: mva.cellPhone,
      fax: mva.fax,
      email: mva.email,
      note: mva.note,
      addressId: mva.addressId,
      // coverageId: mva.coverageId,
      lastModifiedBy: mva.lastModifiedBy,
      lastModifiedDate: mva.lastModifiedDate ? mva.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      phone: mva.phone,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    const mva = this.createFromForm();
    mva.status = this.selectedMva.status;
    if (mva.id) {
      this.subscribeToSaveResponse(this.mvaService.update(mva));
    } else {
      this.subscribeToSaveResponse(this.mvaService.create(mva));
    }
  }

  private createFromForm(): Mva {
    const mva: Mva = {} as Mva;

    mva.id = this.editForm.get(['id'])!.value;
    mva.insurance = this.editForm.get(['insurance'])!.value;
    mva.clientId = this.editForm.get(['clientId'])!.value;
    mva.claimNumber = this.editForm.get(['claimNumber'])!.value;
    mva.accidentDate = this.editForm.get(['accidentDate'])!.value;
    mva.adjuster = this.editForm.get(['adjuster'])!.value;
    mva.status = this.editForm.get(['status'])!.value;
    mva.closeDate = this.editForm.get(['closeDate'])!.value;
    mva.phoneExtension = this.editForm.get(['phoneExtension'])!.value;
    mva.cellPhone = this.editForm.get(['cellPhone'])!.value;
    mva.fax = this.editForm.get(['fax'])!.value;
    mva.email = this.editForm.get(['email'])!.value;
    mva.note = this.editForm.get(['note'])!.value;
    mva.addressId = this.editForm.get(['addressId'])!.value;
    // coverageId: this.editForm.get(['coverageId'])!.value,
    mva.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value;
    mva.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
      ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
      : null;
    mva.phone = this.editForm.get(['phone'])!.value;

    return mva;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Mva>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(mva: Mva | null): void {
    if (mva) {
      this.selectedMva = mva;
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
  initListBox() {
    this.statuses = [];
    this.statuses.push('Open');
    this.statuses.push('Close');
    this.statuses.push('InProgress');
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;

    this.editMode = target.checked ? true : false;
    this.updateForm(this.selectedMva);
    return this.editMode;
  }
  changeStatus(e: Event) {
    this.selectedMva.status = this.findElementStringValue(e);
  }
  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
}
