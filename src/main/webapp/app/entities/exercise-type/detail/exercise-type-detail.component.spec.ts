import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseTypeDetailComponent } from './exercise-type-detail.component';

describe('ExerciseType Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTypeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExerciseTypeDetailComponent,
              resolve: { exerciseType: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExerciseTypeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exerciseType on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExerciseTypeDetailComponent);

      // THEN
      expect(instance.exerciseType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
