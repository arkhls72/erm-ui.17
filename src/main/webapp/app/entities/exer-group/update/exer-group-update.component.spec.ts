import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerGroupService } from '../service/exer-group.service';
import { ExerGroup } from '../exer-group.model';
import { ExerGroupFormService } from './exer-group-form.service';

import { ExerGroupUpdateComponent } from './exer-group-update.component';

describe('ExerGroup Management Update Component', () => {
  let comp: ExerGroupUpdateComponent;
  let fixture: ComponentFixture<ExerGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerGroupFormService: ExerGroupFormService;
  let exerGroupService: ExerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExerGroupUpdateComponent],
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
      .overrideTemplate(ExerGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerGroupFormService = TestBed.inject(ExerGroupFormService);
    exerGroupService = TestBed.inject(ExerGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exerGroup: ExerGroup = { id: 456 };

      activatedRoute.data = of({ exerGroup });
      comp.ngOnInit();

      expect(comp.exerGroup).toEqual(exerGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerGroup>>();
      const exerGroup = { id: 123 };
      jest.spyOn(exerGroupFormService, 'getExerGroup').mockReturnValue(exerGroup);
      jest.spyOn(exerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerGroup }));
      saveSubject.complete();

      // THEN
      expect(exerGroupFormService.getExerGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerGroupService.update).toHaveBeenCalledWith(expect.objectContaining(exerGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerGroup>>();
      const exerGroup = { id: 123 };
      jest.spyOn(exerGroupFormService, 'getExerGroup').mockReturnValue({ id: null });
      jest.spyOn(exerGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exerGroup }));
      saveSubject.complete();

      // THEN
      expect(exerGroupFormService.getExerGroup).toHaveBeenCalled();
      expect(exerGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExerGroup>>();
      const exerGroup = { id: 123 };
      jest.spyOn(exerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
