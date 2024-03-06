import { Component, Input } from '@angular/core';

import { Medication } from 'app/entities/medication/medication.model';
import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { MedicalService } from '../../../../medical/service/medical.service';
import { MedicationService } from '../../../../medication/service/medication.service';
import { AlertErrorComponent } from '../../../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-medication-delete',
  imports: [AlertErrorComponent, FormsModule],
  templateUrl: './medication-delete.component.html',
})
export class MedicationDeleteComponent {
  @Input()
  medication!: Medication;

  @Input()
  medicalClient!: MedicalClient;

  medicalEventType: MedicalEventType = MedicalEventType.MEDICATION_DELETE;
  constructor(
    private medicalService: MedicalService,
    private medicationService: MedicationService,
    public eventService: MedicalEventService,
  ) {}

  clear() {
    this.medicalEventType = MedicalEventType.BACK;
    this.eventService.publish(new MedicalEvent(MedicalEventType.BACK, 'BackButton', 'medication-edit'));
  }

  confirmDelete() {
    const medication: any = this.medication;
    const medicalClient: any = this.medicalClient;
    this.medicalService.deleteMedicationByClientId(medicalClient.clientId, medication.id).subscribe(() => {
      this.medicalEventType = MedicalEventType.BACK;
      this.eventService.publish(new MedicalEvent(MedicalEventType.BACK, 'confirmDelete', 'medication-edit'));
    });
  }
}
