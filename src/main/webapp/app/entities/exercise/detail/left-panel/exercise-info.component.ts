import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { Media } from 'app/entities/media/media.model';
import { ExerciseDetail } from 'app/entities/exercise/detail/exercise-detail-model';
import { ExerciseTool } from 'app/entities/exercise-tool/exercise-tool.model';
import { Movement } from 'app/entities/movement/movement.model';
import { Position } from 'app/entities/position/position.model';

import { ExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { Muscle } from 'app/entities/muscle/muscle.model';
import { Observable, Subject } from 'rxjs';
import { BodyPart } from 'app/entities/body-part/body-part.model';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ExerciseInfoInstructionComponent } from 'app/entities/exercise/detail/left-panel/exercise-info-instruction.component';
import { ExerciseService } from '../../service/exercise.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../../shared/alert/alert.component';
import { ExerMediaRightComponent } from '../right-panel/exer-media-right.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bc-exercise-info',
  templateUrl: './exercise-info.component.html',
  standalone: true,
  imports: [ExerciseInfoInstructionComponent, CommonModule, FormsModule],
})
export class ExerciseInfoComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @ViewChild(ExerciseInfoInstructionComponent) infoInstruction!: ExerciseInfoInstructionComponent;
  editMode = false;
  exercise: Exercise = {} as Exercise;
  medias!: Media[];
  exerciseDetail!: ExerciseDetail;
  bodyParts!: BodyPart[];
  muscles!: Muscle[];
  types!: ExerciseType[];
  positions!: Position[];
  movements!: Movement[];
  tools!: ExerciseTool[];
  firstMedia!: Media;
  secondMedia!: Media;
  isSaving!: boolean;
  constructor(
    protected activatedRoute: ActivatedRoute,
    private exerciseService: ExerciseService,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ exercise }) => (this.exercise = exercise));
    this.isSaving = false;
    if (!this.exercise) {
      this.exercise = {} as Exercise;
    }
    this.load();
  }

  load() {
    if (this.exercise) {
      this.exerciseService.findExerciseDetail().subscribe(exerciseDetail => {
        if (exerciseDetail && exerciseDetail.body) {
          this.exerciseDetail = exerciseDetail.body;
          if (this.exerciseDetail.bodyParts) {
            this.bodyParts = this.exerciseDetail.bodyParts;
          }
          if (this.exerciseDetail.muscles) {
            this.muscles = this.exerciseDetail.muscles;
          }

          if (this.exerciseDetail.types) {
            this.types = this.exerciseDetail.types;
          }

          if (this.exerciseDetail.positions) {
            this.positions = this.exerciseDetail.positions;
          }

          if (this.exerciseDetail.movements) {
            this.movements = this.exerciseDetail.movements;
          }

          if (this.exerciseDetail.tools) {
            this.tools = this.exerciseDetail.tools;
          }
        }
      });
    }
  }
  byteSize(field: string) {
    //  return this.dataUtils.byteSize(field);
  }

  openFile(contentType: string, field: string) {
    //
    // return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }

  changeBodyPart(event: Event) {
    const valueId: number = parseInt((event.target as HTMLInputElement).value, 10);

    if (valueId) {
      const bodyPart = this.bodyParts.find(p => p.id === valueId);
      if (bodyPart) {
        this.exercise.bodyPart = bodyPart;
      }
    } else {
      this.exercise.bodyPart = null;
    }
  }

  changeMuscle(event: Event) {
    const valueId: number = parseInt((event.target as HTMLInputElement).value, 10);
    if (valueId) {
      const muscle = this.muscles.find(p => p.id === valueId);
      if (muscle && this.exercise) {
        this.exercise.muscle = muscle;
      }
    } else {
      this.exercise.muscle = null;
    }
  }
  changeType(event: Event) {
    const valueId: number = parseInt((event.target as HTMLInputElement).value, 10);
    if (valueId) {
      this.exercise.type = this.types.find(p => p.id === valueId);
    } else {
      this.exercise.type = null;
    }
  }

  changePosition(event: Event) {
    const valueId: number = parseInt((event.target as HTMLInputElement).value, 10);
    if (valueId) {
      this.exercise.position = this.positions.find(p => p.id === valueId);
    } else {
      this.exercise.position = null;
    }
  }
  changeMovement(event: Event) {
    const valueId: number = parseInt((event.target as HTMLInputElement).value, 10);
    if (valueId && this.exercise) {
      const x = this.movements.find(p => p.id === valueId);
      if (x) {
        this.exercise.movement = x;
      }
    } else {
      this.exercise.movement = null;
    }
  }
  changeTools(event: Event) {
    const valueId: number = parseInt((event.target as HTMLInputElement).value, 10);
    if (valueId) {
      this.exercise.tool = this.tools.find(p => p.id === valueId);
    } else {
      this.exercise.tool = null;
    }
  }

  save() {
    this.isSaving = true;
    if (this.exercise && this.exercise.id) {
      this.subscribeToSaveResponse(this.exerciseService.update(this.exercise));
    } else {
      this.subscribeToSaveResponse(this.exerciseService.create(this.exercise));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Exercise>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }

  protected onSaveSuccess(res?: Exercise | null): void {
    this.isSaving = false;
    if (res) {
      this.exercise = res;
    }
  }

  addSrcMedia(mediaId?: number) {
    if (mediaId) {
      if (this.medias) {
        const findMedia = this.medias.filter(p => p.id === mediaId);
        if (findMedia !== undefined || findMedia !== null) {
          return 'data:' + findMedia[0].contentType + ';base64,' + findMedia[0].value;
        }
      }
    }
    return null;
  }
  initExerciseMedia() {
    const exerciseMedia: ExerciseMedia = new ExerciseMedia();
    const exercises: Exercise[] = [];
    exercises.push(this.exercise);
    exerciseMedia.exercises = exercises;
    exerciseMedia.medias = this.medias;
    return exerciseMedia;
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.editMode = true;
      return true;
    } else {
      this.editMode = false;
      return false;
    }
    this.editMode = false;
    return false;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
