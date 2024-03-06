import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InjuryService } from '../service/injury.service';
import { Injury } from '../injury.model';
import { InjuryFormService } from './injury-form.service';

import { InjuryUpdateComponent } from './injury-update.component';

describe('Injury Management Update Component', () => {
  let comp: InjuryUpdateComponent;
  let fixture: ComponentFixture<InjuryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let injuryFormService: InjuryFormService;
  let injuryService: InjuryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InjuryUpdateComponent],
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
      .overrideTemplate(InjuryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InjuryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    injuryFormService = TestBed.inject(InjuryFormService);
    injuryService = TestBed.inject(InjuryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const injury: Injury = { id: 456 };

      activatedRoute.data = of({ injury });
      comp.ngOnInit();

      expect(comp.injury).toEqual(injury);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Injury>>();
      const injury = { id: 123 };
      jest.spyOn(injuryFormService, 'getInjury').mockReturnValue(injury);
      jest.spyOn(injuryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ injury });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: injury }));
      saveSubject.complete();

      // THEN
      expect(injuryFormService.getInjury).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(injuryService.update).toHaveBeenCalledWith(expect.objectContaining(injury));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Injury>>();
      const injury = { id: 123 };
      jest.spyOn(injuryFormService, 'getInjury').mockReturnValue({ id: null });
      jest.spyOn(injuryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ injury: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: injury }));
      saveSubject.complete();

      // THEN
      expect(injuryFormService.getInjury).toHaveBeenCalled();
      expect(injuryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Injury>>();
      const injury = { id: 123 };
      jest.spyOn(injuryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ injury });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(injuryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
