import { Component, Input } from '@angular/core';
import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Operation } from 'app/entities/operation/operation.model';
import { MedicalService } from '../../../../medical/service/medical.service';
import { AlertErrorComponent } from '../../../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-operation-delete',
  imports: [AlertErrorComponent, FormsModule],
  templateUrl: './operation-delete.component.html',
})
export class OperationDeleteComponent {
  @Input()
  operation!: Operation;

  @Input()
  medicalClient!: MedicalClient;

  medicalEventType: MedicalEventType = MedicalEventType.OPERATION_DELETE;
  constructor(
    private medicalService: MedicalService,
    public eventService: MedicalEventService,
  ) {}

  clear() {
    this.medicalEventType = MedicalEventType.BACK;
    this.eventService.publish(new MedicalEvent(MedicalEventType.BACK, 'BackButton', 'operation-edit'));
  }

  confirmDelete() {
    const operation: any = this.operation;
    const medicalClient: any = this.medicalClient;
    this.medicalService.deleteOperationByClientId(medicalClient.clientId, operation.id).subscribe(() => {
      this.medicalEventType = MedicalEventType.BACK;
      this.eventService.publish(new MedicalEvent(MedicalEventType.BACK, 'confirmDelete', 'operation-edit'));
    });
  }
}
