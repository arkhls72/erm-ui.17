import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PaymentInvoiceDetailsDetailComponent } from './payment-invoice-details-detail.component';

describe('PaymentInvoiceDetails Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentInvoiceDetailsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PaymentInvoiceDetailsDetailComponent,
              resolve: { paymentInvoiceDetails: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PaymentInvoiceDetailsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load paymentInvoiceDetails on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PaymentInvoiceDetailsDetailComponent);

      // THEN
      expect(instance.paymentInvoiceDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
