import { Component, Input, OnInit } from '@angular/core';

import { Media } from 'app/entities/media/media.model';

import { Movement } from 'app/entities/movement/movement.model';
import { Position } from 'app/entities/position/position.model';

import { Muscle } from 'app/entities/muscle/muscle.model';

import { BodyPart } from 'app/entities/body-part/body-part.model';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ExerciseType } from 'app/entities/exercise-type/exercise-type.model';
import { ExerciseTool } from 'app/entities/exercise-tool/exercise-tool.model';
import { ExerciseService } from '../../service/exercise.service';
import { MediaEditComponent } from '../../../../shared/media/media-edit.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';
import { AlertComponent } from '../../../../shared/alert/alert.component';
import { ExerciseInfoComponent } from '../left-panel/exercise-info.component';
import { ExerciseInfoInstructionComponent } from '../left-panel/exercise-info-instruction.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-exer-media-right',
  templateUrl: './exer-media-right.component.html',
  imports: [MediaEditComponent, CommonModule],
})
export class ExerMediaRightComponent implements OnInit {
  @Input()
  exercise!: Exercise;

  mediaIds!: number[];
  medias!: Media[];
  bodyParts!: BodyPart[];
  muscles!: Muscle[];
  types!: ExerciseType[];
  positions!: Position[];
  movements!: Movement[];
  tools!: ExerciseTool[];
  firstMedia!: Media;
  firstMediaId!: number;
  secondMediaId!: number;
  secondMedia!: Media;
  isSaving!: boolean;
  constructor(
    protected activatedRoute: ActivatedRoute,
    private exerciseService: ExerciseService,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}
  // this MediaIds mus be added to Medias
  ngOnInit() {
    const mediaIds = [];
    if (!this.exercise) {
      this.exercise = new Exercise();
    }
    if (this.exercise.firstMediaId) {
      this.firstMediaId = this.exercise.firstMediaId;
      mediaIds.push(this.firstMediaId);
    }

    if (this.exercise.secondMediaId) {
      this.secondMediaId = this.exercise.secondMediaId;
      mediaIds.push(this.secondMediaId);
    }
    this.mediaIds = mediaIds;
  }

  byteSize(field: string) {
    // return this.dataUtils.byteSize(field);
  }

  openFile(contentType: string, field: string) {
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

  getMedia(index?: number) {
    if (this.medias) {
      if (index === 1) {
        return this.medias.find(p => p.id === this.exercise.firstMediaId);
      }
      if (index === 2) {
        return this.medias.find(p => p.id === this.exercise.secondMediaId);
      }
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
}
