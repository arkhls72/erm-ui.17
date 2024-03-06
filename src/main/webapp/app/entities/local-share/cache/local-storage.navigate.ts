import { Injectable } from '@angular/core';
// cache the navigation from withinn client-tab
// gets the value from ClientTabEventType
@Injectable({ providedIn: 'root' })
export class LocalStorageNavigate {
  public clientTab = 'client-tab';

  cleanUpLocalStorage(): void {
    localStorage.removeItem(this.clientTab);
  }

  getClientTab(): string {
    return <string>JSON.parse(localStorage.getItem(this.clientTab) as string);
  }

  addClientTab(source?: string): void {
    localStorage.removeItem(this.clientTab);
    localStorage.setItem(this.clientTab, JSON.stringify(source));
  }
}
