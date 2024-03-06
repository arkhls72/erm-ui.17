import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClinicService } from '../service/clinic.service';
import { Clinic } from '../clinic.model';
import { ClinicFormService } from './clinic-form.service';

import { ClinicUpdateComponent } from './clinic-update.component';

describe('Clinic Management Update Component', () => {
  let comp: ClinicUpdateComponent;
  let fixture: ComponentFixture<ClinicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clinicFormService: ClinicFormService;
  let clinicService: ClinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ClinicUpdateComponent],
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
      .overrideTemplate(ClinicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClinicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clinicFormService = TestBed.inject(ClinicFormService);
    clinicService = TestBed.inject(ClinicService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const clinic: Clinic = { id: 456 };

      activatedRoute.data = of({ clinic });
      comp.ngOnInit();

      expect(comp.clinic).toEqual(clinic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Clinic>>();
      const clinic = { id: 123 };
      jest.spyOn(clinicFormService, 'getClinic').mockReturnValue(clinic);
      jest.spyOn(clinicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clinic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clinic }));
      saveSubject.complete();

      // THEN
      expect(clinicFormService.getClinic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clinicService.update).toHaveBeenCalledWith(expect.objectContaining(clinic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Clinic>>();
      const clinic = { id: 123 };
      jest.spyOn(clinicFormService, 'getClinic').mockReturnValue({ id: null });
      jest.spyOn(clinicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clinic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clinic }));
      saveSubject.complete();

      // THEN
      expect(clinicFormService.getClinic).toHaveBeenCalled();
      expect(clinicService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Clinic>>();
      const clinic = { id: 123 };
      jest.spyOn(clinicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clinic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clinicService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
