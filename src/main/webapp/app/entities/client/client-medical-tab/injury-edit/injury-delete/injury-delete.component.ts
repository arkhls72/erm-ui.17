import { Component, Input } from '@angular/core';

import { MedicalEvent, MedicalEventType } from 'app/entities/local-share/medicalEvent';
import { MedicalEventService } from 'app/entities/local-share/medical-event.service';
import { MedicalClient } from 'app/entities/client/client-medical-tab/medical-client.model';
import { Injury } from 'app/entities/injury/injury.model';
import { MedicalService } from '../../../../medical/service/medical.service';
import { AlertErrorComponent } from '../../../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-injury-delete',
  imports: [AlertErrorComponent, FormsModule],
  templateUrl: './injury-delete.component.html',
})
export class InjuryDeleteComponent {
  @Input()
  injury!: Injury;

  @Input()
  medicalClient!: MedicalClient;

  medicalEventType: MedicalEventType = MedicalEventType.INJURY_DELETE;
  constructor(
    private medicalService: MedicalService,
    public eventService: MedicalEventService,
  ) {}

  clear() {
    this.medicalEventType = MedicalEventType.BACK;
    this.eventService.publish(new MedicalEvent(MedicalEventType.BACK, 'BackButton', 'injury-edit'));
  }

  confirmDelete() {
    const injury: any = this.injury;
    const medicalClient: any = this.medicalClient;
    this.medicalService.deleteInjuryByClientId(medicalClient.clientId, injury.id).subscribe(() => {
      this.medicalEventType = MedicalEventType.BACK;
      this.eventService.publish(new MedicalEvent(MedicalEventType.BACK, 'confirmDelete', 'injury-edit'));
    });
  }
}
