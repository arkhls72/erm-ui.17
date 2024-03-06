import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CommonServiceCodeDetailComponent } from './common-service-code-detail.component';

describe('CommonServiceCode Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonServiceCodeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CommonServiceCodeDetailComponent,
              resolve: { commonServiceCode: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CommonServiceCodeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load commonServiceCode on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CommonServiceCodeDetailComponent);

      // THEN
      expect(instance.commonServiceCode).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
