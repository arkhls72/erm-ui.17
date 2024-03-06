import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FeeTypeService } from '../service/fee-type.service';
import { FeeType } from '../fee-type.model';
import { FeeTypeFormService } from './fee-type-form.service';

import { FeeTypeUpdateComponent } from './fee-type-update.component';

describe('FeeType Management Update Component', () => {
  let comp: FeeTypeUpdateComponent;
  let fixture: ComponentFixture<FeeTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feeTypeFormService: FeeTypeFormService;
  let feeTypeService: FeeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FeeTypeUpdateComponent],
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
      .overrideTemplate(FeeTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeeTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feeTypeFormService = TestBed.inject(FeeTypeFormService);
    feeTypeService = TestBed.inject(FeeTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const feeType: FeeType = { id: 456 };

      activatedRoute.data = of({ feeType });
      comp.ngOnInit();

      expect(comp.feeType).toEqual(feeType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeType>>();
      const feeType = { id: 123 };
      jest.spyOn(feeTypeFormService, 'getFeeType').mockReturnValue(feeType);
      jest.spyOn(feeTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeType }));
      saveSubject.complete();

      // THEN
      expect(feeTypeFormService.getFeeType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(feeTypeService.update).toHaveBeenCalledWith(expect.objectContaining(feeType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeType>>();
      const feeType = { id: 123 };
      jest.spyOn(feeTypeFormService, 'getFeeType').mockReturnValue({ id: null });
      jest.spyOn(feeTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feeType }));
      saveSubject.complete();

      // THEN
      expect(feeTypeFormService.getFeeType).toHaveBeenCalled();
      expect(feeTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FeeType>>();
      const feeType = { id: 123 };
      jest.spyOn(feeTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feeType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feeTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
