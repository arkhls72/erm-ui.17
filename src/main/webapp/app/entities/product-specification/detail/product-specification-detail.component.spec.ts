import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductSpecificationDetailComponent } from './product-specification-detail.component';

describe('ProductSpecification Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSpecificationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProductSpecificationDetailComponent,
              resolve: { productSpecification: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProductSpecificationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load productSpecification on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProductSpecificationDetailComponent);

      // THEN
      expect(instance.productSpecification).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
