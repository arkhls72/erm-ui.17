import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseDetailComponent } from './exercise-detail.component';

describe('Exercise Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExerciseDetailComponent,
              resolve: { exercise: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExerciseDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exercise on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExerciseDetailComponent);

      // THEN
      expect(instance.exercise).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
