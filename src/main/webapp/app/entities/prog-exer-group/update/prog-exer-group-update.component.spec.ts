import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgExerGroupService } from '../service/prog-exer-group.service';
import { ProgExerGroup } from '../prog-exer-group.model';
import { ProgExerGroupFormService } from './prog-exer-group-form.service';

import { ProgExerGroupUpdateComponent } from './prog-exer-group-update.component';

describe('ProgExerGroup Management Update Component', () => {
  let comp: ProgExerGroupUpdateComponent;
  let fixture: ComponentFixture<ProgExerGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let progExerGroupFormService: ProgExerGroupFormService;
  let progExerGroupService: ProgExerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProgExerGroupUpdateComponent],
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
      .overrideTemplate(ProgExerGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgExerGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    progExerGroupFormService = TestBed.inject(ProgExerGroupFormService);
    progExerGroupService = TestBed.inject(ProgExerGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const progExerGroup: ProgExerGroup = { id: 456 };

      activatedRoute.data = of({ progExerGroup });
      comp.ngOnInit();

      expect(comp.progExerGroup).toEqual(progExerGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgExerGroup>>();
      const progExerGroup = { id: 123 };
      jest.spyOn(progExerGroupFormService, 'getProgExerGroup').mockReturnValue(progExerGroup);
      jest.spyOn(progExerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progExerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progExerGroup }));
      saveSubject.complete();

      // THEN
      expect(progExerGroupFormService.getProgExerGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(progExerGroupService.update).toHaveBeenCalledWith(expect.objectContaining(progExerGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgExerGroup>>();
      const progExerGroup = { id: 123 };
      jest.spyOn(progExerGroupFormService, 'getProgExerGroup').mockReturnValue({ id: null });
      jest.spyOn(progExerGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progExerGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progExerGroup }));
      saveSubject.complete();

      // THEN
      expect(progExerGroupFormService.getProgExerGroup).toHaveBeenCalled();
      expect(progExerGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgExerGroup>>();
      const progExerGroup = { id: 123 };
      jest.spyOn(progExerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progExerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(progExerGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
