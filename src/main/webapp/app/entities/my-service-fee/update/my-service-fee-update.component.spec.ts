import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MyServiceFeeService } from '../service/my-service-fee.service';
import { MyServiceFee } from '../my-service-fee.model';
import { MyServiceFeeFormService } from './my-service-fee-form.service';

import { MyServiceFeeUpdateComponent } from './my-service-fee-update.component';

describe('MyServiceFee Management Update Component', () => {
  let comp: MyServiceFeeUpdateComponent;
  let fixture: ComponentFixture<MyServiceFeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let myServiceFeeFormService: MyServiceFeeFormService;
  let myServiceFeeService: MyServiceFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MyServiceFeeUpdateComponent],
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
      .overrideTemplate(MyServiceFeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MyServiceFeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    myServiceFeeFormService = TestBed.inject(MyServiceFeeFormService);
    myServiceFeeService = TestBed.inject(MyServiceFeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const myServiceFee: MyServiceFee = { id: 456 };

      activatedRoute.data = of({ myServiceFee });
      comp.ngOnInit();

      expect(comp.myServiceFee).toEqual(myServiceFee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyServiceFee>>();
      const myServiceFee = { id: 123 };
      jest.spyOn(myServiceFeeFormService, 'getMyServiceFee').mockReturnValue(myServiceFee);
      jest.spyOn(myServiceFeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myServiceFee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myServiceFee }));
      saveSubject.complete();

      // THEN
      expect(myServiceFeeFormService.getMyServiceFee).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(myServiceFeeService.update).toHaveBeenCalledWith(expect.objectContaining(myServiceFee));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyServiceFee>>();
      const myServiceFee = { id: 123 };
      jest.spyOn(myServiceFeeFormService, 'getMyServiceFee').mockReturnValue({ id: null });
      jest.spyOn(myServiceFeeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myServiceFee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myServiceFee }));
      saveSubject.complete();

      // THEN
      expect(myServiceFeeFormService.getMyServiceFee).toHaveBeenCalled();
      expect(myServiceFeeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyServiceFee>>();
      const myServiceFee = { id: 123 };
      jest.spyOn(myServiceFeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myServiceFee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(myServiceFeeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
