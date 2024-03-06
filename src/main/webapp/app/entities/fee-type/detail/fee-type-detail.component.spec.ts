import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FeeTypeDetailComponent } from './fee-type-detail.component';

describe('FeeType Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeTypeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FeeTypeDetailComponent,
              resolve: { feeType: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FeeTypeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load feeType on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FeeTypeDetailComponent);

      // THEN
      expect(instance.feeType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
