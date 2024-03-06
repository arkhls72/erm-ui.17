import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MovementDetailComponent } from './movement-detail.component';

describe('Movement Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MovementDetailComponent,
              resolve: { movement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MovementDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load movement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MovementDetailComponent);

      // THEN
      expect(instance.movement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
