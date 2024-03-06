import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseTypeService } from '../service/exercise-type.service';

import { ExerciseTypeComponent } from './exercise-type.component';

describe('ExerciseType Management Component', () => {
  let comp: ExerciseTypeComponent;
  let fixture: ComponentFixture<ExerciseTypeComponent>;
  let service: ExerciseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'exercise-type', component: ExerciseTypeComponent }]),
        HttpClientTestingModule,
        ExerciseTypeComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ExerciseTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExerciseTypeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.exerciseTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to exerciseTypeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExerciseTypeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExerciseTypeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
