import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClaimService } from 'app/entities/claim/claim.service';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { InsuranceEventService } from 'app/entities/local-share/insurance-event.service';
import { EhcClient } from 'app/entities/ehc-client/ehc-client.model';
import { EhcService } from '../../../ehc/service/ehc.service';
import { EhcClientService } from '../../../ehc-client/service/ehc-client.service';
import { FormsModule } from '@angular/forms';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';

@Component({
  standalone: true,
  selector: 'bc-ehc-delete',
  templateUrl: './ehc-delete.component.html',
  imports: [FormsModule, AlertErrorComponent],
})
export class EhcDeleteComponent {
  @Input()
  ehc!: Ehc;

  @Output()
  clearDeleteEmitter = new EventEmitter();

  @Output()
  confirmDeleteEmitter = new EventEmitter();

  constructor(
    private claimService: ClaimService,
    private ehcService: EhcService,
    private ehcClientService: EhcClientService,
    public eventService: InsuranceEventService,
  ) {}

  clear() {
    this.clearDeleteEmitter.emit();
  }

  confirmDelete() {
    const ehcType = this.getEhcType();

    if (ehcType === 'Secondary') {
      const ehcClient: EhcClient = this.ehc.ehcClient as EhcClient;
      if (ehcClient.id != null) {
        this.ehcClientService.delete(ehcClient.id).subscribe(() => {
          this.confirmDeleteEmitter.emit();
        });
      }
    } else {
      if (this.ehc.id != null) {
        this.ehcService.delete(this.ehc.id).subscribe(() => {
          this.confirmDeleteEmitter.emit();
        });
      }
    }
  }

  getEhcType() {
    if (this.ehc?.ehcClient) {
      return this.ehc.ehcClient.ehcType;
    }
    return '';
  }
}
