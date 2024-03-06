import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProgGroupInstructionDetailComponent } from './prog-group-instruction-detail.component';

describe('ProgGroupInstruction Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgGroupInstructionDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProgGroupInstructionDetailComponent,
              resolve: { progGroupInstruction: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProgGroupInstructionDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load progGroupInstruction on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProgGroupInstructionDetailComponent);

      // THEN
      expect(instance.progGroupInstruction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
