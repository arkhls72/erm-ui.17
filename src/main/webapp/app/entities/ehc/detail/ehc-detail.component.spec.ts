import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EhcDetailComponent } from './ehc-detail.component';

describe('Ehc Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EhcDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EhcDetailComponent,
              resolve: { ehc: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EhcDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load ehc on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EhcDetailComponent);

      // THEN
      expect(instance.ehc).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
