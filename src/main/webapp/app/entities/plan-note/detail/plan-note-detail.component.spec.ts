import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PlanNoteDetailComponent } from './plan-note-detail.component';

describe('PlanNote Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanNoteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PlanNoteDetailComponent,
              resolve: { planNote: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PlanNoteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load planNote on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PlanNoteDetailComponent);

      // THEN
      expect(instance.planNote).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
