import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ExerGroupService } from '../../../exer-group/service/exer-group.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'bc-exer-group-list-delete',
  templateUrl: './exer-group-list-delete.component.html',
  imports: [FaIconComponent, CommonModule, AlertErrorComponent, FormsModule],
})
export class ExerGroupListDeleteComponent {
  @Input()
  exerGroup?: ExerGroup;

  @Output()
  cancelDeleteExerGroup = new EventEmitter();

  @Output()
  confirmDeleteExerGroup = new EventEmitter();

  constructor(
    protected exerGroupService: ExerGroupService,
    public activeModal: NgbActiveModal,
    public ngIf: NgIf,
    public ngFor: NgFor<any>,
  ) {}

  cancel(): void {
    this.cancelDeleteExerGroup.emit();
  }

  confirmDelete(id: number): void {
    this.exerGroupService.delete(id).subscribe(() => {
      this.confirmDeleteExerGroup.emit();
    });
  }
}
