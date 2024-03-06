import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PositionDetailComponent } from './position-detail.component';

describe('Position Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PositionDetailComponent,
              resolve: { position: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PositionDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load position on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PositionDetailComponent);

      // THEN
      expect(instance.position).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
