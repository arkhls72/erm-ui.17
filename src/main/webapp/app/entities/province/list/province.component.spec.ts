import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProvinceService } from '../service/province.service';

import { ProvinceComponent } from './province.component';

describe('Province Management Component', () => {
  let comp: ProvinceComponent;
  let fixture: ComponentFixture<ProvinceComponent>;
  let service: ProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'province', component: ProvinceComponent }]),
        HttpClientTestingModule,
        ProvinceComponent,
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
      .overrideTemplate(ProvinceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProvinceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProvinceService);

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
    expect(comp.provinces?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to provinceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProvinceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProvinceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
