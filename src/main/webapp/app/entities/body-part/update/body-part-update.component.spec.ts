import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BodyPartService } from '../service/body-part.service';
import { BodyPart } from '../body-part.model';
import { BodyPartFormService } from './body-part-form.service';

import { BodyPartUpdateComponent } from './body-part-update.component';

describe('BodyPart Management Update Component', () => {
  let comp: BodyPartUpdateComponent;
  let fixture: ComponentFixture<BodyPartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bodyPartFormService: BodyPartFormService;
  let bodyPartService: BodyPartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BodyPartUpdateComponent],
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
      .overrideTemplate(BodyPartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BodyPartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bodyPartFormService = TestBed.inject(BodyPartFormService);
    bodyPartService = TestBed.inject(BodyPartService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bodyPart: BodyPart = { id: 456 };

      activatedRoute.data = of({ bodyPart });
      comp.ngOnInit();

      expect(comp.bodyPart).toEqual(bodyPart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BodyPart>>();
      const bodyPart = { id: 123 };
      jest.spyOn(bodyPartFormService, 'getBodyPart').mockReturnValue(bodyPart);
      jest.spyOn(bodyPartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bodyPart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bodyPart }));
      saveSubject.complete();

      // THEN
      expect(bodyPartFormService.getBodyPart).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bodyPartService.update).toHaveBeenCalledWith(expect.objectContaining(bodyPart));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BodyPart>>();
      const bodyPart = { id: 123 };
      jest.spyOn(bodyPartFormService, 'getBodyPart').mockReturnValue({ id: null });
      jest.spyOn(bodyPartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bodyPart: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bodyPart }));
      saveSubject.complete();

      // THEN
      expect(bodyPartFormService.getBodyPart).toHaveBeenCalled();
      expect(bodyPartService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BodyPart>>();
      const bodyPart = { id: 123 };
      jest.spyOn(bodyPartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bodyPart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bodyPartService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
