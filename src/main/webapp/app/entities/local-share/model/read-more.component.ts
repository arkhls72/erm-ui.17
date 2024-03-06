import { Component, Input, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'bc-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class ReadMoreComponent {
  @Input() dataLength!: boolean;
  public isCollapsed = true;
  constructor() {}
}
