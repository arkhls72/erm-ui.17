import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CountriesService } from '../service/countries.service';

import { CountriesComponent } from './countries.component';

describe('Countries Management Component', () => {
  let comp: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;
  let service: CountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'countries', component: CountriesComponent }]),
        HttpClientTestingModule,
        CountriesComponent,
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
      .overrideTemplate(CountriesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CountriesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CountriesService);

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
    expect(comp.countries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to countriesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCountriesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCountriesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
