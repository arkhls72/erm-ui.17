import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InjuryService } from '../service/injury.service';

import { InjuryComponent } from './injury.component';

describe('Injury Management Component', () => {
  let comp: InjuryComponent;
  let fixture: ComponentFixture<InjuryComponent>;
  let service: InjuryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'injury', component: InjuryComponent }]), HttpClientTestingModule, InjuryComponent],
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
      .overrideTemplate(InjuryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InjuryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InjuryService);

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
    expect(comp.injuries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to injuryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInjuryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInjuryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
