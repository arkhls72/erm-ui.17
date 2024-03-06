import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WsibService } from '../service/wsib.service';
import { Wsib } from '../wsib.model';
import { WsibFormService } from './wsib-form.service';

import { WsibUpdateComponent } from './wsib-update.component';

describe('Wsib Management Update Component', () => {
  let comp: WsibUpdateComponent;
  let fixture: ComponentFixture<WsibUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let wsibFormService: WsibFormService;
  let wsibService: WsibService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), WsibUpdateComponent],
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
      .overrideTemplate(WsibUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WsibUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    wsibFormService = TestBed.inject(WsibFormService);
    wsibService = TestBed.inject(WsibService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const wsib: Wsib = { id: 456 };

      activatedRoute.data = of({ wsib });
      comp.ngOnInit();

      expect(comp.wsib).toEqual(wsib);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Wsib>>();
      const wsib = { id: 123 };
      jest.spyOn(wsibFormService, 'getWsib').mockReturnValue(wsib);
      jest.spyOn(wsibService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wsib });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: wsib }));
      saveSubject.complete();

      // THEN
      expect(wsibFormService.getWsib).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(wsibService.update).toHaveBeenCalledWith(expect.objectContaining(wsib));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Wsib>>();
      const wsib = { id: 123 };
      jest.spyOn(wsibFormService, 'getWsib').mockReturnValue({ id: null });
      jest.spyOn(wsibService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wsib: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: wsib }));
      saveSubject.complete();

      // THEN
      expect(wsibFormService.getWsib).toHaveBeenCalled();
      expect(wsibService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Wsib>>();
      const wsib = { id: 123 };
      jest.spyOn(wsibService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wsib });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(wsibService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
