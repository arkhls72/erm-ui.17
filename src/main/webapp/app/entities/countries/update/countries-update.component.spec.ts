import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CountriesService } from '../service/countries.service';
import { Countries } from '../countries.model';
import { CountriesFormService } from './countries-form.service';

import { CountriesUpdateComponent } from './countries-update.component';

describe('Countries Management Update Component', () => {
  let comp: CountriesUpdateComponent;
  let fixture: ComponentFixture<CountriesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let countriesFormService: CountriesFormService;
  let countriesService: CountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CountriesUpdateComponent],
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
      .overrideTemplate(CountriesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CountriesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    countriesFormService = TestBed.inject(CountriesFormService);
    countriesService = TestBed.inject(CountriesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const countries: Countries = { id: 456 };

      activatedRoute.data = of({ countries });
      comp.ngOnInit();

      expect(comp.countries).toEqual(countries);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Countries>>();
      const countries = { id: 123 };
      jest.spyOn(countriesFormService, 'getCountries').mockReturnValue(countries);
      jest.spyOn(countriesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ countries });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: countries }));
      saveSubject.complete();

      // THEN
      expect(countriesFormService.getCountries).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(countriesService.update).toHaveBeenCalledWith(expect.objectContaining(countries));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Countries>>();
      const countries = { id: 123 };
      jest.spyOn(countriesFormService, 'getCountries').mockReturnValue({ id: null });
      jest.spyOn(countriesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ countries: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: countries }));
      saveSubject.complete();

      // THEN
      expect(countriesFormService.getCountries).toHaveBeenCalled();
      expect(countriesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Countries>>();
      const countries = { id: 123 };
      jest.spyOn(countriesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ countries });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(countriesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
