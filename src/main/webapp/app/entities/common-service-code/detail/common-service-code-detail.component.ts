import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { CommonServiceCode } from '../common-service-code.model';
import SharedModule from '../../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-common-service-code-detail',
  templateUrl: './common-service-code-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CommonServiceCodeDetailComponent {
  @Input() commonServiceCode: CommonServiceCode | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
