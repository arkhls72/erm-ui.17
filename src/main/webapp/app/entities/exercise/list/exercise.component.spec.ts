import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExerciseService } from '../service/exercise.service';

import { ExerciseComponent } from './exercise.component';
import SpyInstance = jest.SpyInstance;

describe('Exercise Management Component', () => {
  let comp: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;
  let service: ExerciseService;
  let routerNavigateSpy: SpyInstance<Promise<boolean>>;

  //   beforeEach((object: T, method: M) => {
  //     TestBed.configureTestingModule({
  //       imports: [
  //         RouterTestingModule.withRoutes([{ path: 'exercise', component: ExerciseComponent }]),
  //         HttpClientTestingModule,
  //         ExerciseComponent,
  //       ],
  //       providers: [
  //         {
  //           provide: ActivatedRoute,
  //           useValue: {
  //             data: of({
  //               defaultSort: 'id,asc',
  //             }),
  //             queryParamMap: of(
  //               jest.requireActual('@angular/router').convertToParamMap({
  //                 page: '1',
  //                 size: '1',
  //                 sort: 'id,desc',
  //               }),
  //             ),
  //             snapshot: { queryParams: {} },
  //           },
  //         },
  //       ],
  //     })
  //       .overrideTemplate(ExerciseComponent, '')
  //       .compileComponents();
  //
  //     fixture = TestBed.createComponent(ExerciseComponent);
  //     comp = fixture.componentInstance;
  //     service = TestBed.inject(ExerciseService);
  //     routerNavigateSpy = jest.spyOn(comp.router, 'navigate');
  //
  //     const headers = new HttpHeaders();
  //     jest.spyOn(service, 'query').mockReturnValue(
  //       of(
  //         new HttpResponse({
  //           body: [{ id: 123 }],
  //           headers,
  //         }),
  //       ),
  //     );
  //   });
  //
  //   it('Should call load all on init', () => {
  //     // WHEN
  //     comp.ngOnInit();
  //
  //     // THEN
  //     expect(service.query).toHaveBeenCalled();
  //     expect(comp.exercises?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  //   });
  //
  //   describe('trackId', () => {
  //     it('Should forward to exerciseService', () => {
  //       const entity = { id: 123 };
  //       jest.spyOn(service, 'getExerciseIdentifier');
  //       const id = comp.trackId(0, entity);
  //       expect(service.getExerciseIdentifier).toHaveBeenCalledWith(entity);
  //       expect(id).toBe(entity.id);
  //     });
  //   });
  //
  //   it('should load a page', () => {
  //     // WHEN
  //     comp.navigateToPage(1);
  //
  //     // THEN
  //     expect(routerNavigateSpy).toHaveBeenCalled();
  //   });
  //
  //   it('should calculate the sort attribute for an id', () => {
  //     // WHEN
  //     comp.ngOnInit();
  //
  //     // THEN
  //     expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['id,desc'] }));
  //   });
  //
  //   it('should calculate the sort attribute for a non-id attribute', () => {
  //     // GIVEN
  //     comp.predicate = 'name';
  //
  //     // WHEN
  //     comp.navigateToWithComponentValues();
  //
  //     // THEN
  //     expect(routerNavigateSpy).toHaveBeenLastCalledWith(
  //       expect.anything(),
  //       expect.objectContaining({
  //         queryParams: expect.objectContaining({
  //           sort: ['name,asc'],
  //         }),
  //       }),
  //     );
  //   });
});
