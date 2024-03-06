import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Client } from '../client.model';
import { HttpResponse } from '@angular/common/http';
import { ClientService } from '../service/client.service';
import { ClientPersonalComponent } from './client-personal/client-personal.component';
import { ClientAddressComponent } from './client-address/client-address.component';

@Component({
  standalone: true,
  selector: 'bc-client-general-tab',
  templateUrl: './client-general-tab.component.html',
  imports: [ClientPersonalComponent, ClientAddressComponent],
})
export class ClientGeneralTabComponent implements OnInit {
  isSaving!: boolean;
  genders!: string[];

  @Input()
  client!: Client;
  subscription!: Subscription;
  private eventSubscriber!: Subscription;
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {}

  load(id: any) {
    this.clientService.find(id).subscribe((data: any) => {
      this.client = data;
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.clientService.update(this.client));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Client>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  validateDate(value: any) {
    return value ? value : null;
  }
  private initGenders() {
    this.genders = [];
    this.genders.push('Male');
    this.genders.push('Female');
  }
  changeGender(client: Client, target: any) {
    this.client.gender = target.toString();
  }
}
