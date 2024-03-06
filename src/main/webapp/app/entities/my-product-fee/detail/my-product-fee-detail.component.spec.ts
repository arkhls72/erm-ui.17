import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MyProductFeeDetailComponent } from './my-product-fee-detail.component';

describe('MyProductFee Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProductFeeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MyProductFeeDetailComponent,
              resolve: { myProductFee: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MyProductFeeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load myProductFee on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MyProductFeeDetailComponent);

      // THEN
      expect(instance.myProductFee).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
