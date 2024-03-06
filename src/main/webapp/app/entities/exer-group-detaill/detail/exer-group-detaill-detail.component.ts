import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ExerGroupDetaill } from '../exer-group-detaill.model';

@Component({
  standalone: true,
  selector: 'jhi-exer-group-detaill-detail',
  templateUrl: './exer-group-detaill-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ExerGroupDetaillDetailComponent {
  @Input() exerGroupDetaill: ExerGroupDetaill | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
