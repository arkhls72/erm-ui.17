import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClientInvoiceDetailComponent } from './client-invoice-detail.component';

describe('ClientInvoice Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInvoiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClientInvoiceDetailComponent,
              resolve: { clientInvoice: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ClientInvoiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load clientInvoice on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClientInvoiceDetailComponent);

      // THEN
      expect(instance.clientInvoice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
