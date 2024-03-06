import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseToolDetailComponent } from './exercise-tool-detail.component';

describe('ExerciseTool Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseToolDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExerciseToolDetailComponent,
              resolve: { exerciseTool: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExerciseToolDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exerciseTool on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExerciseToolDetailComponent);

      // THEN
      expect(instance.exerciseTool).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
