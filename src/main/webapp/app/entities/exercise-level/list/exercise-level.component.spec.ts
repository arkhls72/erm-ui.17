import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseLevelService } from '../service/exercise-level.service';

import { ExerciseLevelComponent } from './exercise-level.component';

describe('ExerciseLevel Management Component', () => {
  let comp: ExerciseLevelComponent;
  let fixture: ComponentFixture<ExerciseLevelComponent>;
  let service: ExerciseLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'exercise-level', component: ExerciseLevelComponent }]),
        HttpClientTestingModule,
        ExerciseLevelComponent,
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
      .overrideTemplate(ExerciseLevelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseLevelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExerciseLevelService);

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
    expect(comp.exerciseLevels?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to exerciseLevelService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExerciseLevelIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExerciseLevelIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
