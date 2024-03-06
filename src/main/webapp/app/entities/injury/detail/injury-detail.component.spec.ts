import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InjuryDetailComponent } from './injury-detail.component';

describe('Injury Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjuryDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InjuryDetailComponent,
              resolve: { injury: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InjuryDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load injury on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InjuryDetailComponent);

      // THEN
      expect(instance.injury).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
