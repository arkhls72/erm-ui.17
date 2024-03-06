import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { MyServiceFee } from '../my-service-fee.model';

@Component({
  standalone: true,
  selector: 'jhi-my-service-fee-detail',
  templateUrl: './my-service-fee-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class MyServiceFeeDetailComponent {
  @Input() myServiceFee: MyServiceFee | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
