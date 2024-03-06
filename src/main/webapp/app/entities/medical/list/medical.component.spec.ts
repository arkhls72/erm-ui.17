import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedicalService } from '../service/medical.service';

import { MedicalComponent } from './medical.component';

describe('Medical Management Component', () => {
  let comp: MedicalComponent;
  let fixture: ComponentFixture<MedicalComponent>;
  let service: MedicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'medical', component: MedicalComponent }]),
        HttpClientTestingModule,
        MedicalComponent,
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
      .overrideTemplate(MedicalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MedicalService);

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
    expect(comp.medicals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to medicalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMedicalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMedicalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
