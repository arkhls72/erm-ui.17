import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServiceInvoiceDetailComponent } from './service-invoice-detail.component';

describe('ServiceInvoice Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceInvoiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ServiceInvoiceDetailComponent,
              resolve: { serviceInvoice: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ServiceInvoiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load serviceInvoice on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ServiceInvoiceDetailComponent);

      // THEN
      expect(instance.serviceInvoice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
