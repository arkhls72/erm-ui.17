import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ClaimEventType } from 'app/entities/local-share/claim-event';
import { ClaimEventService } from 'app/entities/local-share/claim-event.service';
import { ClaimService } from 'app/entities/claim/claim.service';

import { Mva } from 'app/entities/mva/mva.model';
import { MvaService } from '../../../mva/service/mva.service';
import { FormsModule } from '@angular/forms';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';

@Component({
  standalone: true,
  selector: 'bc-mva-delete',
  templateUrl: './mva-delete.component.html',
  imports: [FormsModule, AlertErrorComponent],
})
export class MvaDeleteComponent {
  @Input()
  mva!: Mva;
  claimEventType: ClaimEventType = ClaimEventType.WSIB_DELETE;

  @Output()
  cancelDeleteMvaEmitter = new EventEmitter();

  @Output()
  confirmDeleteMvaEmitter = new EventEmitter();

  constructor(
    private claimService: ClaimService,
    private mvaService: MvaService,
    public eventService: ClaimEventService,
  ) {}

  clear() {
    this.cancelDeleteMvaEmitter.emit();
  }

  confirmDelete() {
    const mva: any = this.mva;
    this.mvaService.delete(mva.id).subscribe(() => {
      this.confirmDeleteMvaEmitter.emit();
    });
  }
}
