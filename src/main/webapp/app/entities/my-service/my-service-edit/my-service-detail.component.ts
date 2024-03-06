import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MyService } from 'app/entities/my-service/my-service.model';

@Component({
  selector: 'jhi-my-service-detail',
  templateUrl: './my-service-detail.component.html',
})
export class MyServiceDetailComponent implements OnInit {
  myService: MyService | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myService }) => (this.myService = myService));
  }

  previousState(): void {
    window.history.back();
  }
  refreshMyServiceByChild(myService: MyService) {
    this.myService = myService;
  }
}
