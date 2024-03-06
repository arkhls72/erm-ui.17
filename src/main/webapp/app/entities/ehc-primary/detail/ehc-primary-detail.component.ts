import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { EhcPrimary } from '../ehc-primary.model';

@Component({
  standalone: true,
  selector: 'jhi-ehc-primary-detail',
  templateUrl: './ehc-primary-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EhcPrimaryDetailComponent {
  @Input() ehcPrimary: EhcPrimary | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
