import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Countries } from '../countries.model';
import { CountriesService } from '../service/countries.service';
import { CountriesFormService, CountriesFormGroup } from './countries-form.service';

@Component({
  standalone: true,
  selector: 'jhi-countries-update',
  templateUrl: './countries-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CountriesUpdateComponent implements OnInit {
  isSaving = false;
  countries: Countries | null = null;

  editForm: CountriesFormGroup = this.countriesFormService.createCountriesFormGroup();

  constructor(
    protected countriesService: CountriesService,
    protected countriesFormService: CountriesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ countries }) => {
      this.countries = countries;
      if (countries) {
        this.updateForm(countries);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const countries = this.countriesFormService.getCountries(this.editForm);
    if (countries.id !== null) {
      this.subscribeToSaveResponse(this.countriesService.update(countries));
    } else {
      this.subscribeToSaveResponse(this.countriesService.create(countries));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Countries>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(countries: Countries): void {
    this.countries = countries;
    this.countriesFormService.resetForm(this.editForm, countries);
  }
}
