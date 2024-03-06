import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ProgExerciseInstruction } from '../prog-exercise-instruction.model';

@Component({
  standalone: true,
  selector: 'jhi-prog-exercise-instruction-detail',
  templateUrl: './prog-exercise-instruction-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ProgExerciseInstructionDetailComponent {
  @Input() progExerciseInstruction: ProgExerciseInstruction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
