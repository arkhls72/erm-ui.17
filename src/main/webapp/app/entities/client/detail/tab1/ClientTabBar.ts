import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

/**
 * @title Basic use of the tab nav bar
 */
@Component({
  selector: 'client-tab',
  templateUrl: 'client-tab.html',
  styleUrl: 'client-tab.css',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule],
})
export class ClientTabBar {
  links = ['Client', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }
}
