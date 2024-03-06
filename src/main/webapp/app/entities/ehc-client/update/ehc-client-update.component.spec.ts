import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EhcClientService } from '../service/ehc-client.service';
import { EhcClient } from '../ehc-client.model';
import { EhcClientFormService } from './ehc-client-form.service';

import { EhcClientUpdateComponent } from './ehc-client-update.component';

describe('EhcClient Management Update Component', () => {
  let comp: EhcClientUpdateComponent;
  let fixture: ComponentFixture<EhcClientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ehcClientFormService: EhcClientFormService;
  let ehcClientService: EhcClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EhcClientUpdateComponent],
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
      .overrideTemplate(EhcClientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EhcClientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ehcClientFormService = TestBed.inject(EhcClientFormService);
    ehcClientService = TestBed.inject(EhcClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ehcClient: EhcClient = { id: 456 };

      activatedRoute.data = of({ ehcClient });
      comp.ngOnInit();

      expect(comp.ehcClient).toEqual(ehcClient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EhcClient>>();
      const ehcClient = { id: 123 };
      jest.spyOn(ehcClientFormService, 'getEhcClient').mockReturnValue(ehcClient);
      jest.spyOn(ehcClientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehcClient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ehcClient }));
      saveSubject.complete();

      // THEN
      expect(ehcClientFormService.getEhcClient).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ehcClientService.update).toHaveBeenCalledWith(expect.objectContaining(ehcClient));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EhcClient>>();
      const ehcClient = { id: 123 };
      jest.spyOn(ehcClientFormService, 'getEhcClient').mockReturnValue({ id: null });
      jest.spyOn(ehcClientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehcClient: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ehcClient }));
      saveSubject.complete();

      // THEN
      expect(ehcClientFormService.getEhcClient).toHaveBeenCalled();
      expect(ehcClientService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EhcClient>>();
      const ehcClient = { id: 123 };
      jest.spyOn(ehcClientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ehcClient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ehcClientService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
