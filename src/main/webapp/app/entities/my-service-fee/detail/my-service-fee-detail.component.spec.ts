import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MyServiceFeeDetailComponent } from './my-service-fee-detail.component';

describe('MyServiceFee Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyServiceFeeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MyServiceFeeDetailComponent,
              resolve: { myServiceFee: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MyServiceFeeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load myServiceFee on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MyServiceFeeDetailComponent);

      // THEN
      expect(instance.myServiceFee).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
