import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SoapNoteDetailComponent } from './soap-note-detail.component';

describe('SoapNote Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoapNoteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SoapNoteDetailComponent,
              resolve: { soapNote: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SoapNoteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load soapNote on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SoapNoteDetailComponent);

      // THEN
      expect(instance.soapNote).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
