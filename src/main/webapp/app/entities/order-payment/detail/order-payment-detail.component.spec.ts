import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrderPaymentDetailComponent } from './order-payment-detail.component';

describe('OrderPayment Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPaymentDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: OrderPaymentDetailComponent,
              resolve: { orderPayment: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OrderPaymentDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load orderPayment on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OrderPaymentDetailComponent);

      // THEN
      expect(instance.orderPayment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
