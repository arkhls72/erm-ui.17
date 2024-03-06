import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProgExerciseInstructionDetailComponent } from './prog-exercise-instruction-detail.component';

describe('ProgExerciseInstruction Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgExerciseInstructionDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProgExerciseInstructionDetailComponent,
              resolve: { progExerciseInstruction: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProgExerciseInstructionDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load progExerciseInstruction on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProgExerciseInstructionDetailComponent);

      // THEN
      expect(instance.progExerciseInstruction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
