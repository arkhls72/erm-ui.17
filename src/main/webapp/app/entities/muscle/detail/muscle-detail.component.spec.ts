import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MuscleDetailComponent } from './muscle-detail.component';

describe('Muscle Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MuscleDetailComponent,
              resolve: { muscle: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MuscleDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load muscle on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MuscleDetailComponent);

      // THEN
      expect(instance.muscle).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
