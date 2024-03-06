import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MovementService } from '../service/movement.service';
import { Movement } from '../movement.model';
import { MovementFormService } from './movement-form.service';

import { MovementUpdateComponent } from './movement-update.component';

describe('Movement Management Update Component', () => {
  let comp: MovementUpdateComponent;
  let fixture: ComponentFixture<MovementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let movementFormService: MovementFormService;
  let movementService: MovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MovementUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MovementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MovementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    movementFormService = TestBed.inject(MovementFormService);
    movementService = TestBed.inject(MovementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const movement: Movement = { id: 456 };

      activatedRoute.data = of({ movement });
      comp.ngOnInit();

      expect(comp.movement).toEqual(movement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Movement>>();
      const movement = { id: 123 };
      jest.spyOn(movementFormService, 'getMovement').mockReturnValue(movement);
      jest.spyOn(movementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movement }));
      saveSubject.complete();

      // THEN
      expect(movementFormService.getMovement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(movementService.update).toHaveBeenCalledWith(expect.objectContaining(movement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Movement>>();
      const movement = { id: 123 };
      jest.spyOn(movementFormService, 'getMovement').mockReturnValue({ id: null });
      jest.spyOn(movementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movement }));
      saveSubject.complete();

      // THEN
      expect(movementFormService.getMovement).toHaveBeenCalled();
      expect(movementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Movement>>();
      const movement = { id: 123 };
      jest.spyOn(movementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(movementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
