import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductInvoiceDetailComponent } from './product-invoice-detail.component';

describe('ProductInvoice Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInvoiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProductInvoiceDetailComponent,
              resolve: { productInvoice: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProductInvoiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load productInvoice on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProductInvoiceDetailComponent);

      // THEN
      expect(instance.productInvoice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
