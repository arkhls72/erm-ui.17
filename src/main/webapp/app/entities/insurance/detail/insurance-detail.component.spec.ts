import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InsuranceDetailComponent } from './insurance-detail.component';

describe('Insurance Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InsuranceDetailComponent,
              resolve: { insurance: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InsuranceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load insurance on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InsuranceDetailComponent);

      // THEN
      expect(instance.insurance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
