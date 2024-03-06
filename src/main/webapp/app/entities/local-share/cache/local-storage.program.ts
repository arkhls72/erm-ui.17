import { Injectable } from '@angular/core';
import { ProgNote } from 'app/entities/prog-note/prog-note.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageProgram {
  public existNote = 'progNote-';

  cleanUpLocalStorage(): void {
    localStorage.removeItem(this.existNote);
  }

  getCurrentNote(): ProgNote {
    return <ProgNote>JSON.parse(localStorage.getItem(this.existNote) as string);
  }

  addCurrentNote(source?: ProgNote): void {
    localStorage.removeItem(this.existNote);
    localStorage.setItem(this.existNote, JSON.stringify(source));
  }
}
