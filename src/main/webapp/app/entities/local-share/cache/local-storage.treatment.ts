import { Injectable } from '@angular/core';
import { PlanNote } from 'app/entities/plan-note/plan-note.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageTreatment {
  public existNote = 'existNote-';

  cleanUpLocalStorage(): void {
    localStorage.removeItem(this.existNote);
  }

  getCurrentNote(): PlanNote {
    return <PlanNote>JSON.parse(localStorage.getItem(this.existNote) as string);
  }

  addCurrentNote(source?: PlanNote): void {
    localStorage.removeItem(this.existNote);
    localStorage.setItem(this.existNote, JSON.stringify(source));
  }
}
