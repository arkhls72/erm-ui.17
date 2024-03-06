import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MyProductFeeService } from '../service/my-product-fee.service';
import { MyProductFee } from '../my-product-fee.model';
import { MyProductFeeFormService } from './my-product-fee-form.service';

import { MyProductFeeUpdateComponent } from './my-product-fee-update.component';

describe('MyProductFee Management Update Component', () => {
  let comp: MyProductFeeUpdateComponent;
  let fixture: ComponentFixture<MyProductFeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let myProductFeeFormService: MyProductFeeFormService;
  let myProductFeeService: MyProductFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MyProductFeeUpdateComponent],
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
      .overrideTemplate(MyProductFeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MyProductFeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    myProductFeeFormService = TestBed.inject(MyProductFeeFormService);
    myProductFeeService = TestBed.inject(MyProductFeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const myProductFee: MyProductFee = { id: 456 };

      activatedRoute.data = of({ myProductFee });
      comp.ngOnInit();

      expect(comp.myProductFee).toEqual(myProductFee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyProductFee>>();
      const myProductFee = { id: 123 };
      jest.spyOn(myProductFeeFormService, 'getMyProductFee').mockReturnValue(myProductFee);
      jest.spyOn(myProductFeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myProductFee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myProductFee }));
      saveSubject.complete();

      // THEN
      expect(myProductFeeFormService.getMyProductFee).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(myProductFeeService.update).toHaveBeenCalledWith(expect.objectContaining(myProductFee));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyProductFee>>();
      const myProductFee = { id: 123 };
      jest.spyOn(myProductFeeFormService, 'getMyProductFee').mockReturnValue({ id: null });
      jest.spyOn(myProductFeeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myProductFee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myProductFee }));
      saveSubject.complete();

      // THEN
      expect(myProductFeeFormService.getMyProductFee).toHaveBeenCalled();
      expect(myProductFeeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyProductFee>>();
      const myProductFee = { id: 123 };
      jest.spyOn(myProductFeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myProductFee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(myProductFeeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
