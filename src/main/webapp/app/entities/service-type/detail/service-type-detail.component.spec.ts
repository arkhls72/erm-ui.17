import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServiceTypeDetailComponent } from './service-type-detail.component';

describe('ServiceType Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ServiceTypeDetailComponent,
              resolve: { serviceType: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ServiceTypeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load serviceType on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ServiceTypeDetailComponent);

      // THEN
      expect(instance.serviceType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
