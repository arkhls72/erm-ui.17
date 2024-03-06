import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductSpecificationService } from '../service/product-specification.service';
import { ProductSpecification } from '../product-specification.model';
import { ProductSpecificationFormService } from './product-specification-form.service';

import { ProductSpecificationUpdateComponent } from './product-specification-update.component';

describe('ProductSpecification Management Update Component', () => {
  let comp: ProductSpecificationUpdateComponent;
  let fixture: ComponentFixture<ProductSpecificationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productSpecificationFormService: ProductSpecificationFormService;
  let productSpecificationService: ProductSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProductSpecificationUpdateComponent],
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
      .overrideTemplate(ProductSpecificationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductSpecificationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productSpecificationFormService = TestBed.inject(ProductSpecificationFormService);
    productSpecificationService = TestBed.inject(ProductSpecificationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productSpecification: ProductSpecification = { id: 456 };

      activatedRoute.data = of({ productSpecification });
      comp.ngOnInit();

      expect(comp.productSpecification).toEqual(productSpecification);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductSpecification>>();
      const productSpecification = { id: 123 };
      jest.spyOn(productSpecificationFormService, 'getProductSpecification').mockReturnValue(productSpecification);
      jest.spyOn(productSpecificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productSpecification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productSpecification }));
      saveSubject.complete();

      // THEN
      expect(productSpecificationFormService.getProductSpecification).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productSpecificationService.update).toHaveBeenCalledWith(expect.objectContaining(productSpecification));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductSpecification>>();
      const productSpecification = { id: 123 };
      jest.spyOn(productSpecificationFormService, 'getProductSpecification').mockReturnValue({ id: null });
      jest.spyOn(productSpecificationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productSpecification: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productSpecification }));
      saveSubject.complete();

      // THEN
      expect(productSpecificationFormService.getProductSpecification).toHaveBeenCalled();
      expect(productSpecificationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductSpecification>>();
      const productSpecification = { id: 123 };
      jest.spyOn(productSpecificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productSpecification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productSpecificationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
