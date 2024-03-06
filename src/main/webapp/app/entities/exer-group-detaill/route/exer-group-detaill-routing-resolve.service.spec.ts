import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerGroupDetaill } from '../exer-group-detaill.model';
import { ExerGroupDetaillService } from '../service/exer-group-detaill.service';

import exerGroupDetaillResolve from './exer-group-detaill-routing-resolve.service';

describe('ExerGroupDetaill routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: ExerGroupDetaillService;
  let resultExerGroupDetaill: ExerGroupDetaill | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(ExerGroupDetaillService);
    resultExerGroupDetaill = undefined;
  });

  describe('resolve', () => {
    it('should return ExerGroupDetaill returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        exerGroupDetaillResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultExerGroupDetaill = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExerGroupDetaill).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        exerGroupDetaillResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultExerGroupDetaill = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultExerGroupDetaill).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ExerGroupDetaill>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        exerGroupDetaillResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultExerGroupDetaill = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExerGroupDetaill).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
