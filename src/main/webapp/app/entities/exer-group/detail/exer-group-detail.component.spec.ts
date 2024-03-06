import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerGroupDetailComponent } from './exer-group-detail.component';

describe('ExerGroup Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerGroupDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExerGroupDetailComponent,
              resolve: { exerGroup: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExerGroupDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exerGroup on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExerGroupDetailComponent);

      // THEN
      expect(instance.exerGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
