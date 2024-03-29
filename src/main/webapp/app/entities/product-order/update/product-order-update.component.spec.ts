import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductOrderService } from '../service/product-order.service';
import { ProductOrder } from '../product-order.model';
import { ProductOrderFormService } from './product-order-form.service';

import { ProductOrderUpdateComponent } from './product-order-update.component';

describe('ProductOrder Management Update Component', () => {
  let comp: ProductOrderUpdateComponent;
  let fixture: ComponentFixture<ProductOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productOrderFormService: ProductOrderFormService;
  let productOrderService: ProductOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProductOrderUpdateComponent],
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
      .overrideTemplate(ProductOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productOrderFormService = TestBed.inject(ProductOrderFormService);
    productOrderService = TestBed.inject(ProductOrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productOrder: ProductOrder = { id: 456 };

      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      expect(comp.productOrder).toEqual(productOrder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductOrder>>();
      const productOrder = { id: 123 };
      jest.spyOn(productOrderFormService, 'getProductOrder').mockReturnValue(productOrder);
      jest.spyOn(productOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productOrder }));
      saveSubject.complete();

      // THEN
      expect(productOrderFormService.getProductOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productOrderService.update).toHaveBeenCalledWith(expect.objectContaining(productOrder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductOrder>>();
      const productOrder = { id: 123 };
      jest.spyOn(productOrderFormService, 'getProductOrder').mockReturnValue({ id: null });
      jest.spyOn(productOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productOrder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productOrder }));
      saveSubject.complete();

      // THEN
      expect(productOrderFormService.getProductOrder).toHaveBeenCalled();
      expect(productOrderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductOrder>>();
      const productOrder = { id: 123 };
      jest.spyOn(productOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productOrderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
