import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Client } from 'app/entities/client/client.model';
import { ClientService } from '../../service/client.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-client-personal',
  templateUrl: './client-personal.component.html',
  imports: [FormsModule, NgForOf],
})
export class ClientPersonalComponent implements OnInit {
  isSaving!: boolean;
  genders!: string[];

  @Input()
  client!: Client;
  subscription!: Subscription;
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.initGenders();
  }

  load(id: any) {
    this.clientService.find(id).subscribe((data: any) => {
      this.client = data;
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    const client = this.client;
    this.subscribeToSaveResponse(this.clientService.update(client));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Client>>): void {
    result.subscribe(() => this.onSaveSuccess());
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
  changeGender(target: Event) {
    this.client.gender = this.findElementStringValue(target);
  }
  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
}
