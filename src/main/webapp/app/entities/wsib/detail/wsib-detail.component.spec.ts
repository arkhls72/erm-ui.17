import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WsibDetailComponent } from './wsib-detail.component';

describe('Wsib Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WsibDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: WsibDetailComponent,
              resolve: { wsib: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(WsibDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load wsib on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', WsibDetailComponent);

      // THEN
      expect(instance.wsib).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
