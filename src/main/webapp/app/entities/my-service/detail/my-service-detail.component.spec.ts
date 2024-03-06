import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MyServiceDetailComponent } from './my-service-detail.component';

describe('MyService Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyServiceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MyServiceDetailComponent,
              resolve: { myService: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MyServiceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load myService on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MyServiceDetailComponent);

      // THEN
      expect(instance.myService).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
