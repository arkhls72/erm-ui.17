import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProvinceDetailComponent } from './province-detail.component';

describe('Province Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProvinceDetailComponent,
              resolve: { province: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProvinceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load province on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProvinceDetailComponent);

      // THEN
      expect(instance.province).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
