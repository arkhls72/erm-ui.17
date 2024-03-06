import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedicalDetailComponent } from './medical-detail.component';

describe('Medical Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MedicalDetailComponent,
              resolve: { medical: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MedicalDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load medical on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MedicalDetailComponent);

      // THEN
      expect(instance.medical).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
