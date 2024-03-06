import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from 'app/entities/media/media.model';
import { Movement } from 'app/entities/movement/movement.model';
import { Position } from 'app/entities/position/position.model';
import { Muscle } from 'app/entities/muscle/muscle.model';
import { BodyPart } from 'app/entities/body-part/body-part.model';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseDetail } from 'app/entities/exercise/detail/exercise-detail-model';
import { ExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { ExerciseTool } from 'app/entities/exercise-tool/exercise-tool.model';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { ExerciseEventType } from 'app/entities/local-share/ExerciseEvent';
import { ExerciseService } from '../service/exercise.service';
import { ExerciseInfoComponent } from './left-panel/exercise-info.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { ExerMediaRightComponent } from './right-panel/exer-media-right.component';
import { ExerciseInfoInstructionComponent } from './left-panel/exercise-info-instruction.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'jhi-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    AlertErrorComponent,
    AlertComponent,
    ExerciseInfoComponent,
    ExerMediaRightComponent,
    ExerciseInfoInstructionComponent,
  ],
})
export class ExerciseDetailComponent implements OnInit {
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
  firstMediaId!: number;
  secondMediaId!: number;
  exerciseEvent = ExerciseEventType.EXER_EDIT;
  constructor(
    protected activatedRoute: ActivatedRoute,
    private exerciseService: ExerciseService,
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ exercise }) => (this.exercise = exercise));
    this.isSaving = false;
    if (!this.exercise) {
      this.exercise = {} as Exercise;
    }
    this.load();
  }

  previousState() {
    window.history.back();
  }

  getMedia(index?: number) {
    if (index === 1) {
      return this.medias.find(p => p.id === this.exercise.firstMediaId);
    }
    if (index === 2) {
      return this.medias.find(p => p.id === this.exercise.secondMediaId);
    }

    return {} as Media;
  }

  displayMedia(mediaId?: number) {
    if (mediaId) {
      if (this.medias) {
        const findMedia = this.medias.filter(p => p.id === mediaId);
        if (findMedia && findMedia[0] && findMedia[0].contentType) {
          return 'data:' + findMedia[0].contentType + ';base64,' + findMedia[0].value;
        }
      }
    }
    return null;
  }

  load() {
    if (this.exercise && this.exercise.id) {
      this.exerciseService.findExerciseMedia(this.exercise.id).subscribe(res => {
        const response: ExerciseMedia | null = res.body;
        if (response) {
          if (response.exercises) {
            this.exercise = response.exercises[0];
            if (this.exercise.firstMediaId) {
              this.firstMediaId = this.exercise.firstMediaId;
            }
            if (this.exercise.secondMediaId) {
              this.secondMediaId = this.exercise.secondMediaId;
            }
          }
          if (response.medias) {
            this.medias = response.medias;
          }
        }
        if (this.exercise.firstMediaId) {
          this.firstMedia = this.medias.filter(i => i.id === this.exercise.firstMediaId)[0];
        }
        if (this.exercise.secondMediaId !== undefined || this.exercise.secondMediaId !== null) {
          this.secondMedia = this.medias.filter(i => i.id === this.exercise.secondMediaId)[0];
        }
      });
    }
  }
  goInstruction() {
    this.exerciseEvent = ExerciseEventType.EXER_EDIT_INSTRUCTION;
  }
  closeInstruction() {
    this.exerciseEvent = ExerciseEventType.EXER_EDIT;
  }
}
