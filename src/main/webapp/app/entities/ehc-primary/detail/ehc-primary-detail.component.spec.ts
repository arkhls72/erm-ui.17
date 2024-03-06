import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EhcPrimaryDetailComponent } from './ehc-primary-detail.component';

describe('EhcPrimary Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EhcPrimaryDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EhcPrimaryDetailComponent,
              resolve: { ehcPrimary: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EhcPrimaryDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load ehcPrimary on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EhcPrimaryDetailComponent);

      // THEN
      expect(instance.ehcPrimary).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
