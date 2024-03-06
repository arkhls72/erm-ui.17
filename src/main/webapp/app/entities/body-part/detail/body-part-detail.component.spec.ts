import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BodyPartDetailComponent } from './body-part-detail.component';

describe('BodyPart Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyPartDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BodyPartDetailComponent,
              resolve: { bodyPart: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BodyPartDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load bodyPart on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BodyPartDetailComponent);

      // THEN
      expect(instance.bodyPart).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
