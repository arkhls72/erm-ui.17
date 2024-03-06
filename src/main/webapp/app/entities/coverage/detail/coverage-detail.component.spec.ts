import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CoverageDetailComponent } from './coverage-detail.component';

describe('Coverage Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverageDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CoverageDetailComponent,
              resolve: { coverage: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CoverageDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load coverage on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CoverageDetailComponent);

      // THEN
      expect(instance.coverage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
