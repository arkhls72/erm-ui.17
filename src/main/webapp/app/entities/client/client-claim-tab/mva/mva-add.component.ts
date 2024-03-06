import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Mva } from 'app/entities/mva/mva.model';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { MvaService } from '../../../mva/service/mva.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'bc-mva-add',
  templateUrl: './mva-add.component.html',
  imports: [ReactiveFormsModule, FaIconComponent, NgbInputDatepicker, NgForOf, NgIf],
})
export class MvaAddComponent implements OnInit {
  @Input()
  client!: Client;
  @Output()
  successAddMvaEmitter = new EventEmitter<Mva>();

  selectedMva = {} as Mva;
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
    addressId: [],
    phoneExtension: [null, [Validators.maxLength(10)]],
    cellPhone: [null, [Validators.maxLength(12)]],
    fax: [null, [Validators.maxLength(12)]],
    email: [null, [Validators.maxLength(50)]],
    note: [null, [Validators.maxLength(350)]],
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
    this.selectedMva.accidentDate = dayjs(new Date(), 'DD/MM/YYYY');
    this.selectedMva.closeDate = dayjs(new Date(), 'DD/MM/YYYY');
    this.selectedMva.status = 'Open';

    this.updateForm(this.selectedMva);
  }

  updateForm(mva: Mva): void {
    const input: any = mva;
    input.client.id = this.client.id;

    if (mva) {
      const clientId: any = this.client && this.client.id ? this.client.id : null;
      this.editForm.patchValue({
        id: input.id,
        insurance: input.insurance,
        clientId: clientId,
        claimNumber: input.claimNumber,
        accidentDate: this.editMode ? input.accidentDate : input.datePipe.transform(mva.accidentDate, 'yyyy-MM-dd')!,
        adjuster: input.adjuster,
        status: input.status,
        closeDate: this.editMode ? mva.closeDate : input.closeDate.format('yyyy-MM-dd'),
        phoneExtension: input.phoneExtension,
        cellPhone: input.cellPhone,
        fax: input.fax,
        email: input.email,
        note: input.note,
        addressId: input.addressId,
        phone: input.phone,
      });
    }
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
    (mva.id = this.editForm.get(['id'])!.value),
      (mva.insurance = this.editForm.get(['insurance'])!.value),
      (mva.clientId = this.client.id),
      (mva.claimNumber = this.editForm.get(['claimNumber'])!.value),
      (mva.accidentDate = this.editForm.get(['accidentDate'])!.value),
      (mva.adjuster = this.editForm.get(['adjuster'])!.value),
      (mva.status = this.editForm.get(['status'])!.value),
      (mva.closeDate = this.editForm.get(['closeDate'])!.value),
      (mva.phoneExtension = this.editForm.get(['phoneExtension'])!.value),
      (mva.cellPhone = this.editForm.get(['cellPhone'])!.value),
      (mva.fax = this.editForm.get(['fax'])!.value),
      (mva.email = this.editForm.get(['email'])!.value),
      (mva.phone = this.editForm.get(['phone'])!.value);

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
      this.successAddMvaEmitter.emit(mva);
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
  checkEditMode(checked: Boolean) {
    if (checked) {
      this.editMode = true;
      this.updateForm(this.selectedMva);
      return true;
    } else {
      this.editMode = false;
      this.updateForm(this.selectedMva);
      return false;
    }
    this.editMode = false;
    this.updateForm(this.selectedMva);
    return false;
  }
  changeStatus(e: Event) {
    this.selectedMva.status = this.findElementStringValue(e);
  }
  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
}
