jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseTypeService } from '../service/exercise-type.service';

import { ExerciseTypeDeleteDialogComponent } from './exercise-type-delete-dialog.component';

describe('ExerciseType Management Delete Component', () => {
  let comp: ExerciseTypeDeleteDialogComponent;
  let fixture: ComponentFixture<ExerciseTypeDeleteDialogComponent>;
  let service: ExerciseTypeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ExerciseTypeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ExerciseTypeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExerciseTypeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExerciseTypeService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
