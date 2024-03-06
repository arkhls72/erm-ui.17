import { Component, OnInit } from '@angular/core';
import { MyService } from 'app/entities/my-service/my-service.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MyServiceService } from '../service/my-service.service';

@Component({
  selector: 'jhi-my-service-delete',
  templateUrl: './my-service-delete.component.html',
})
export class MyServiceDeleteComponent implements OnInit {
  myService?: MyService;
  private subscription!: Subscription;
  constructor(
    protected myServiceService: MyServiceService,
    protected activeModal: NgbActiveModal,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myService }) => {
      this.myService = myService;
    });
  }

  cancel(): void {
    window.history.back();
  }

  confirmDelete(id: number): void {
    this.myServiceService.delete(id).subscribe(() => {
      // this.eventManager.broadcast('myServiceListModification');
      this.activeModal.close();
      this.router.navigate(['/my-service']);
    });
  }
}
