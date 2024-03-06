import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EhcClientDetailComponent } from './ehc-client-detail.component';

describe('EhcClient Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EhcClientDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EhcClientDetailComponent,
              resolve: { ehcClient: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EhcClientDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load ehcClient on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EhcClientDetailComponent);

      // THEN
      expect(instance.ehcClient).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
