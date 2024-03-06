import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TherapyDetailComponent } from './therapy-detail.component';

describe('Therapy Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapyDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TherapyDetailComponent,
              resolve: { therapy: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TherapyDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load therapy on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TherapyDetailComponent);

      // THEN
      expect(instance.therapy).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
