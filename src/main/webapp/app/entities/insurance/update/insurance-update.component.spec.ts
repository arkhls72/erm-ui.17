import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InsuranceService } from '../service/insurance.service';
import { Insurance } from '../insurance.model';
import { InsuranceFormService } from './insurance-form.service';

import { InsuranceUpdateComponent } from './insurance-update.component';

describe('Insurance Management Update Component', () => {
  let comp: InsuranceUpdateComponent;
  let fixture: ComponentFixture<InsuranceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let insuranceFormService: InsuranceFormService;
  let insuranceService: InsuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InsuranceUpdateComponent],
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
      .overrideTemplate(InsuranceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InsuranceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    insuranceFormService = TestBed.inject(InsuranceFormService);
    insuranceService = TestBed.inject(InsuranceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const insurance: Insurance = { id: 456 };

      activatedRoute.data = of({ insurance });
      comp.ngOnInit();

      expect(comp.insurance).toEqual(insurance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Insurance>>();
      const insurance = { id: 123 };
      jest.spyOn(insuranceFormService, 'getInsurance').mockReturnValue(insurance);
      jest.spyOn(insuranceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insurance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insurance }));
      saveSubject.complete();

      // THEN
      expect(insuranceFormService.getInsurance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(insuranceService.update).toHaveBeenCalledWith(expect.objectContaining(insurance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Insurance>>();
      const insurance = { id: 123 };
      jest.spyOn(insuranceFormService, 'getInsurance').mockReturnValue({ id: null });
      jest.spyOn(insuranceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insurance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insurance }));
      saveSubject.complete();

      // THEN
      expect(insuranceFormService.getInsurance).toHaveBeenCalled();
      expect(insuranceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Insurance>>();
      const insurance = { id: 123 };
      jest.spyOn(insuranceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insurance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(insuranceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
