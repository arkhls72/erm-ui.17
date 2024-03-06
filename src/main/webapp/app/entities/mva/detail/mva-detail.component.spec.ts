import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MvaDetailComponent } from './mva-detail.component';

describe('Mva Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MvaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MvaDetailComponent,
              resolve: { mva: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MvaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load mva on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MvaDetailComponent);

      // THEN
      expect(instance.mva).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
