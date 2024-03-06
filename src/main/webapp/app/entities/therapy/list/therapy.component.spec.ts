import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TherapyService } from '../service/therapy.service';

import { TherapyComponent } from './therapy.component';

describe('Therapy Management Component', () => {
  let comp: TherapyComponent;
  let fixture: ComponentFixture<TherapyComponent>;
  let service: TherapyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'therapy', component: TherapyComponent }]),
        HttpClientTestingModule,
        TherapyComponent,
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
      .overrideTemplate(TherapyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TherapyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TherapyService);

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
    expect(comp.therapies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to therapyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTherapyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTherapyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
