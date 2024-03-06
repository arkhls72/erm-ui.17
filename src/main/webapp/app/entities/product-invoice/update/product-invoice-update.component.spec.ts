import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductInvoiceService } from '../service/product-invoice.service';
import { ProductInvoice } from '../product-invoice.model';
import { ProductInvoiceFormService } from './product-invoice-form.service';

import { ProductInvoiceUpdateComponent } from './product-invoice-update.component';

describe('ProductInvoice Management Update Component', () => {
  let comp: ProductInvoiceUpdateComponent;
  let fixture: ComponentFixture<ProductInvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productInvoiceFormService: ProductInvoiceFormService;
  let productInvoiceService: ProductInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProductInvoiceUpdateComponent],
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
      .overrideTemplate(ProductInvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductInvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productInvoiceFormService = TestBed.inject(ProductInvoiceFormService);
    productInvoiceService = TestBed.inject(ProductInvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productInvoice: ProductInvoice = { id: 456 };

      activatedRoute.data = of({ productInvoice });
      comp.ngOnInit();

      expect(comp.productInvoice).toEqual(productInvoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductInvoice>>();
      const productInvoice = { id: 123 };
      jest.spyOn(productInvoiceFormService, 'getProductInvoice').mockReturnValue(productInvoice);
      jest.spyOn(productInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productInvoice }));
      saveSubject.complete();

      // THEN
      expect(productInvoiceFormService.getProductInvoice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productInvoiceService.update).toHaveBeenCalledWith(expect.objectContaining(productInvoice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductInvoice>>();
      const productInvoice = { id: 123 };
      jest.spyOn(productInvoiceFormService, 'getProductInvoice').mockReturnValue({ id: null });
      jest.spyOn(productInvoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productInvoice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productInvoice }));
      saveSubject.complete();

      // THEN
      expect(productInvoiceFormService.getProductInvoice).toHaveBeenCalled();
      expect(productInvoiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductInvoice>>();
      const productInvoice = { id: 123 };
      jest.spyOn(productInvoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productInvoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productInvoiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
