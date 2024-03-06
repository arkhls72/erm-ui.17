import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseLevelDetailComponent } from './exercise-level-detail.component';

describe('ExerciseLevel Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseLevelDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExerciseLevelDetailComponent,
              resolve: { exerciseLevel: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExerciseLevelDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exerciseLevel on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExerciseLevelDetailComponent);

      // THEN
      expect(instance.exerciseLevel).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
