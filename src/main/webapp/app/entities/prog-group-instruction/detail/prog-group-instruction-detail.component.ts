import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ProgGroupInstruction } from '../prog-group-instruction.model';

@Component({
  standalone: true,
  selector: 'jhi-prog-group-instruction-detail',
  templateUrl: './prog-group-instruction-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ProgGroupInstructionDetailComponent {
  @Input() progGroupInstruction: ProgGroupInstruction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
