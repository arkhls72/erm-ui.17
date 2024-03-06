import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AssessmentDetailComponent } from './assessment-detail.component';

describe('Assessment Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AssessmentDetailComponent,
              resolve: { assessment: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AssessmentDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load assessment on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AssessmentDetailComponent);

      // THEN
      expect(instance.assessment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
