import { Injectable } from '@angular/core';
import { GroupExerciseMediaWrapper } from 'app/entities/exercise/group-exercise-media-wraper.model';
import { ExerciseMediaWrapper } from 'app/entities/exercise/exercise-media-wraper.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageTree {
  public treeGroup = 'tree-group-exercise';
  public treeExercise = 'tree-exercise';

  cleanUpLocalGroupStorage(): void {
    localStorage.removeItem(this.treeGroup);
  }

  cleanUpLocalExerciseStorage(): void {
    localStorage.removeItem(this.treeGroup);
  }
  getTreeGroup(): GroupExerciseMediaWrapper {
    return JSON.parse(localStorage.getItem(this.treeGroup) as string);
  }

  getTreeExercise(): ExerciseMediaWrapper {
    return JSON.parse(localStorage.getItem(this.treeExercise) as string);
  }

  addTreeGroup(source?: GroupExerciseMediaWrapper): void {
    localStorage.removeItem(this.treeGroup);
    localStorage.setItem(this.treeGroup, JSON.stringify(source));
  }
  addTreeExercise(source?: ExerciseMediaWrapper): void {
    localStorage.removeItem(this.treeExercise);
    localStorage.setItem(this.treeExercise, JSON.stringify(source));
  }
}
