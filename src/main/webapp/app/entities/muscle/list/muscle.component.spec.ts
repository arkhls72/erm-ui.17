import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MuscleService } from '../service/muscle.service';

import { MuscleComponent } from './muscle.component';

describe('Muscle Management Component', () => {
  let comp: MuscleComponent;
  let fixture: ComponentFixture<MuscleComponent>;
  let service: MuscleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'muscle', component: MuscleComponent }]), HttpClientTestingModule, MuscleComponent],
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
      .overrideTemplate(MuscleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MuscleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MuscleService);

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
    expect(comp.muscles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to muscleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMuscleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMuscleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
