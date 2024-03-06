import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MvaService } from '../service/mva.service';
import { Mva } from '../mva.model';
import { MvaFormService } from './mva-form.service';

import { MvaUpdateComponent } from './mva-update.component';

describe('Mva Management Update Component', () => {
  let comp: MvaUpdateComponent;
  let fixture: ComponentFixture<MvaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mvaFormService: MvaFormService;
  let mvaService: MvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MvaUpdateComponent],
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
      .overrideTemplate(MvaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MvaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mvaFormService = TestBed.inject(MvaFormService);
    mvaService = TestBed.inject(MvaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mva: Mva = { id: 456 };

      activatedRoute.data = of({ mva });
      comp.ngOnInit();

      expect(comp.mva).toEqual(mva);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mva>>();
      const mva = { id: 123 };
      jest.spyOn(mvaFormService, 'getMva').mockReturnValue(mva);
      jest.spyOn(mvaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mva }));
      saveSubject.complete();

      // THEN
      expect(mvaFormService.getMva).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mvaService.update).toHaveBeenCalledWith(expect.objectContaining(mva));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mva>>();
      const mva = { id: 123 };
      jest.spyOn(mvaFormService, 'getMva').mockReturnValue({ id: null });
      jest.spyOn(mvaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mva: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mva }));
      saveSubject.complete();

      // THEN
      expect(mvaFormService.getMva).toHaveBeenCalled();
      expect(mvaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mva>>();
      const mva = { id: 123 };
      jest.spyOn(mvaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mvaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
