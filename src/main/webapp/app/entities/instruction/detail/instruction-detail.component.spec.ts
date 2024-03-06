import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InstructionDetailComponent } from './instruction-detail.component';

describe('Instruction Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InstructionDetailComponent,
              resolve: { instruction: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InstructionDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load instruction on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InstructionDetailComponent);

      // THEN
      expect(instance.instruction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
