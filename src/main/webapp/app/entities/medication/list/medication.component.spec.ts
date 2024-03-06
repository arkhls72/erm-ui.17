import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedicationService } from '../service/medication.service';

import { MedicationComponent } from './medication.component';

describe('Medication Management Component', () => {
  let comp: MedicationComponent;
  let fixture: ComponentFixture<MedicationComponent>;
  let service: MedicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'medication', component: MedicationComponent }]),
        HttpClientTestingModule,
        MedicationComponent,
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
      .overrideTemplate(MedicationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MedicationService);

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
    expect(comp.medications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to medicationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMedicationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMedicationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
