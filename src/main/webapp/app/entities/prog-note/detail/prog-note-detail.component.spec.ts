import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProgNoteDetailComponent } from './prog-note-detail.component';

describe('ProgNote Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgNoteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProgNoteDetailComponent,
              resolve: { progNote: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProgNoteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load progNote on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProgNoteDetailComponent);

      // THEN
      expect(instance.progNote).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
