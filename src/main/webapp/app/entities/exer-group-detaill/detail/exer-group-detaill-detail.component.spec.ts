import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerGroupDetaillDetailComponent } from './exer-group-detaill-detail.component';

describe('ExerGroupDetaill Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerGroupDetaillDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExerGroupDetaillDetailComponent,
              resolve: { exerGroupDetaill: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExerGroupDetaillDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exerGroupDetaill on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExerGroupDetaillDetailComponent);

      // THEN
      expect(instance.exerGroupDetaill).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
