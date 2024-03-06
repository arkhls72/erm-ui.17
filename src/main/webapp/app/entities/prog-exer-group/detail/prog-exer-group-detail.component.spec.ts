import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProgExerGroupDetailComponent } from './prog-exer-group-detail.component';

describe('ProgExerGroup Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgExerGroupDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProgExerGroupDetailComponent,
              resolve: { progExerGroup: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProgExerGroupDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load progExerGroup on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProgExerGroupDetailComponent);

      // THEN
      expect(instance.progExerGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
