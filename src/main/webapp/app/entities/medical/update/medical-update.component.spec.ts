import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MedicalService } from '../service/medical.service';
import { Medical } from '../medical.model';
import { MedicalFormService } from './medical-form.service';

import { MedicalUpdateComponent } from './medical-update.component';

describe('Medical Management Update Component', () => {
  let comp: MedicalUpdateComponent;
  let fixture: ComponentFixture<MedicalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medicalFormService: MedicalFormService;
  let medicalService: MedicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MedicalUpdateComponent],
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
      .overrideTemplate(MedicalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medicalFormService = TestBed.inject(MedicalFormService);
    medicalService = TestBed.inject(MedicalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const medical: Medical = { id: 456 };

      activatedRoute.data = of({ medical });
      comp.ngOnInit();

      expect(comp.medical).toEqual(medical);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Medical>>();
      const medical = { id: 123 };
      jest.spyOn(medicalFormService, 'getMedical').mockReturnValue(medical);
      jest.spyOn(medicalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medical });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medical }));
      saveSubject.complete();

      // THEN
      expect(medicalFormService.getMedical).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medicalService.update).toHaveBeenCalledWith(expect.objectContaining(medical));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Medical>>();
      const medical = { id: 123 };
      jest.spyOn(medicalFormService, 'getMedical').mockReturnValue({ id: null });
      jest.spyOn(medicalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medical: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medical }));
      saveSubject.complete();

      // THEN
      expect(medicalFormService.getMedical).toHaveBeenCalled();
      expect(medicalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Medical>>();
      const medical = { id: 123 };
      jest.spyOn(medicalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medical });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medicalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
