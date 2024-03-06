import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClinicDetailComponent } from './clinic-detail.component';

describe('Clinic Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClinicDetailComponent,
              resolve: { clinic: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ClinicDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load clinic on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClinicDetailComponent);

      // THEN
      expect(instance.clinic).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
