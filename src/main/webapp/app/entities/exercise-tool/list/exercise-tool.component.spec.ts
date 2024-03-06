import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseToolService } from '../service/exercise-tool.service';

import { ExerciseToolComponent } from './exercise-tool.component';

describe('ExerciseTool Management Component', () => {
  let comp: ExerciseToolComponent;
  let fixture: ComponentFixture<ExerciseToolComponent>;
  let service: ExerciseToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'exercise-tool', component: ExerciseToolComponent }]),
        HttpClientTestingModule,
        ExerciseToolComponent,
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
      .overrideTemplate(ExerciseToolComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseToolComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExerciseToolService);

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
    expect(comp.exerciseTools?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to exerciseToolService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExerciseToolIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExerciseToolIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
