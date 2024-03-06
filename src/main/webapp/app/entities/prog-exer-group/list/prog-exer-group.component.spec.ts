import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProgExerGroupService } from '../service/prog-exer-group.service';

import { ProgExerGroupComponent } from './prog-exer-group.component';

describe('ProgExerGroup Management Component', () => {
  let comp: ProgExerGroupComponent;
  let fixture: ComponentFixture<ProgExerGroupComponent>;
  let service: ProgExerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'prog-exer-group', component: ProgExerGroupComponent }]),
        HttpClientTestingModule,
        ProgExerGroupComponent,
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
      .overrideTemplate(ProgExerGroupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgExerGroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProgExerGroupService);

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
    expect(comp.progExerGroups?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to progExerGroupService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProgExerGroupIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProgExerGroupIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
