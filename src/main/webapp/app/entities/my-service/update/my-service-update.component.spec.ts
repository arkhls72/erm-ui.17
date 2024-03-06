import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MyServiceService } from '../service/my-service.service';
import { MyService } from '../my-service.model';
import { MyServiceFormService } from './my-service-form.service';

import { MyServiceUpdateComponent } from './my-service-update.component';

describe('MyService Management Update Component', () => {
  let comp: MyServiceUpdateComponent;
  let fixture: ComponentFixture<MyServiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let myServiceFormService: MyServiceFormService;
  let myServiceService: MyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MyServiceUpdateComponent],
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
      .overrideTemplate(MyServiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MyServiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    myServiceFormService = TestBed.inject(MyServiceFormService);
    myServiceService = TestBed.inject(MyServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const myService: MyService = { id: 456 };

      activatedRoute.data = of({ myService });
      comp.ngOnInit();

      expect(comp.myService).toEqual(myService);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyService>>();
      const myService = { id: 123 };
      jest.spyOn(myServiceFormService, 'getMyService').mockReturnValue(myService);
      jest.spyOn(myServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myService }));
      saveSubject.complete();

      // THEN
      expect(myServiceFormService.getMyService).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(myServiceService.update).toHaveBeenCalledWith(expect.objectContaining(myService));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyService>>();
      const myService = { id: 123 };
      jest.spyOn(myServiceFormService, 'getMyService').mockReturnValue({ id: null });
      jest.spyOn(myServiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myService: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myService }));
      saveSubject.complete();

      // THEN
      expect(myServiceFormService.getMyService).toHaveBeenCalled();
      expect(myServiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyService>>();
      const myService = { id: 123 };
      jest.spyOn(myServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(myServiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
