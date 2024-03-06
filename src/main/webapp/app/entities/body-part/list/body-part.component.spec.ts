import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BodyPartService } from '../service/body-part.service';

import { BodyPartComponent } from './body-part.component';

describe('BodyPart Management Component', () => {
  let comp: BodyPartComponent;
  let fixture: ComponentFixture<BodyPartComponent>;
  let service: BodyPartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'body-part', component: BodyPartComponent }]),
        HttpClientTestingModule,
        BodyPartComponent,
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
      .overrideTemplate(BodyPartComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BodyPartComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BodyPartService);

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
    expect(comp.bodyParts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bodyPartService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBodyPartIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBodyPartIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
