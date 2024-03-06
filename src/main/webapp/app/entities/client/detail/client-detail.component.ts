import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'app/entities/client/client.model';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from '../../invoice/service/invoice.service';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { ClientGeneralTabComponent } from '../client-general-tab/client-general-tab.component';
import { ClientMedicalTabComponent } from '../client-medical-tab/client-medical-tab.component';
import { ClientInsuranceTabComponent } from '../client-insurance-tab/client-insurance-tab.component';
import { ClaimTabComponent } from '../client-claim-tab/client-claim-tab.component';
import { ClientSoapNoteTabComponent } from '../client-soap-note/client-soap-note-tab.component';
import { ClientAssessmentTabComponent } from '../client-assessment/client-assessment-tab.component';
import { ClientTreatmentTabComponent } from '../client-treatment-tab/client-treatment-tab.component';
import { ClientProgramTabComponent } from '../client-program/client-program-tab.component';
import { ClientInvoiceTabComponent } from '../client-invoice-tab/client-invoice-tab.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'jhi-client-detail',
  templateUrl: './client-detail.component.html',
  imports: [
    NgbModule,
    AlertErrorComponent,
    AlertComponent,
    ClientGeneralTabComponent,
    ClientMedicalTabComponent,
    ClientInsuranceTabComponent,
    ClaimTabComponent,
    ClientSoapNoteTabComponent,
    ClientAssessmentTabComponent,
    ClientTreatmentTabComponent,
    ClientProgramTabComponent,
    ClientInvoiceTabComponent,
    NgIf,
    MatTabsModule,
    MatIconModule,
    FaIconComponent,
  ],
})
export class ClientDetailComponent implements OnInit {
  client!: Client;
  invoice!: Invoice;
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => (this.client = client));
  }

  previousState(): void {
    window.history.back();
  }
}
