import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PaymentInvoiceDetailComponent } from './payment-invoice-detail.component';

describe('PaymentInvoice Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentInvoiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PaymentInvoiceDetailComponent,
              resolve: { paymentInvoice: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PaymentInvoiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load paymentInvoice on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PaymentInvoiceDetailComponent);

      // THEN
      expect(instance.paymentInvoice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
