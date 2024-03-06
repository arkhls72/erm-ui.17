import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Wsib } from 'app/entities/wsib/wsib.model';
import { ClaimEventService } from 'app/entities/local-share/claim-event.service';
import { ClaimService } from 'app/entities/claim/claim.service';
import { WsibService } from '../../../wsib/service/wsib.service';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';

@Component({
  standalone: true,
  selector: 'bc-wsib-delete',
  templateUrl: './wsib-delete.component.html',
  imports: [AlertErrorComponent],
})
export class WsibDeleteComponent {
  @Input()
  wsib!: Wsib;

  @Output()
  confirmDeleteWsibEmitter = new EventEmitter();

  @Output()
  cancelDeleteWsibEmitter = new EventEmitter();

  constructor(
    private claimService: ClaimService,
    private wsibService: WsibService,
    public eventService: ClaimEventService,
  ) {}

  clear() {
    this.cancelDeleteWsibEmitter.emit();
  }

  confirmDelete() {
    const wsib: any = this.wsib;
    this.wsibService.delete(wsib.id).subscribe(() => {
      this.confirmDeleteWsibEmitter.emit();
    });
  }
}
