import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from 'app/entities/province/province.model';
import { Address } from 'app/entities/address/address.model';
import { Countries } from 'app/entities/countries/countries.model';
import { HttpResponse } from '@angular/common/http';
import { ClaimEventType } from 'app/entities/local-share/claim-event';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mva } from 'app/entities/mva/mva.model';
import { AddressService } from '../../../address/service/address.service';
import { ProvinceService } from '../../../province/service/province.service';
import { CountriesService } from '../../../countries/service/countries.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import dayjs from 'dayjs/esm';
import { NgForOf, NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-mva-address',
  templateUrl: './mva-address.component.html',
  imports: [ReactiveFormsModule, FormsModule, NgForOf, NgIf],
})
export class MvaAddressComponent implements OnInit {
  editMode = false;

  @Input()
  mva!: Mva;
  address!: Address;
  isSaving!: boolean;

  claimEventType: ClaimEventType = ClaimEventType.MVA_ADDRESS;
  provinces: Province[] = [];
  public countryList: Countries[] = new Array<Countries>();

  editForm = this.fb.group({
    id: [],
    streetNumber: [null, [Validators.required, Validators.maxLength(50)]],
    streetName: [null, [Validators.required, Validators.maxLength(50)]],
    unitNumber: [null, [Validators.maxLength(20)]],
    postalCode: [null, [Validators.required, Validators.maxLength(6)]],
    city: [null, [Validators.required, Validators.maxLength(30)]],
    provinceId: [null],
    countryId: [null],
    lastModifiedBy: [null],
    lastModifiedDate: [null],
  });

  constructor(
    private addressService: AddressService,
    private provinceService: ProvinceService,
    private countriesService: CountriesService,
    private fb: FormBuilder,
  ) {}
  ngOnInit() {
    this.initCountryProvince();
    if (this.mva.addressId) {
      this.addressService.find(this.mva.addressId).subscribe(res => {
        if (res && res.body) {
          this.address = res.body;
          this.updateForm(this.address);
        } else {
          this.initAddress();
        }
      });
    } else {
      this.initAddress();
    }
  }
  updateForm(address: any): void {
    this.editForm.patchValue({
      id: address.id,
      streetNumber: address.streetNumber,
      streetName: address.streetName,
      unitNumber: address.unitNumber,
      postalCode: address.postalCode,
      city: address.city,
      provinceId: address.province,
      countryId: address.countries,
      lastModifiedDate: address.lastModifiedDate ? address.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  private createFromToSave(): Address {
    const address: Address = {} as Address;
    (address.id = this.editForm.get(['id'])!.value),
      (address.streetNumber = this.editForm.get(['streetNumber'])!.value),
      (address.streetName = this.editForm.get(['streetName'])!.value),
      (address.unitNumber = this.editForm.get(['unitNumber'])!.value),
      (address.postalCode = this.editForm.get(['postalCode'])!.value),
      (address.city = this.editForm.get(['city'])!.value),
      (address.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined);

    return address;
  }

  save() {
    this.isSaving = true;
    const mvaAddress: any = this.createFromToSave();
    mvaAddress.countries = this.address.countries;
    mvaAddress.province = this.address.province;
    if (this.mva && this.mva.id) {
      if (!this.address.id) {
        this.subscribeToSaveResponse(this.addressService.createForMva(mvaAddress, this.mva.id));
      } else {
        this.subscribeToSaveResponse(this.addressService.updateForMva(mvaAddress, this.mva.id));
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Address>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onError(),
    );
  }

  protected onSaveSuccess(address: Address | null): void {
    if (address) {
      this.address = address;
      this.mva.addressId = address.id;
      this.address = address;
      this.updateForm(address);
    }
  }

  private onError() {
    this.isSaving = false;
  }

  changeProvince(event: Event) {
    const valueId: number = this.findIntegerValue(event);
    if (valueId) {
      this.address.province = this.provinces.find(p => p.id === valueId);
    } else {
      this.address.province = this.provinces.find(p => p.id === 1);
    }
  }

  changeCountries(event: Event) {
    const valueId: number = this.findIntegerValue(event);
    if (valueId) {
      this.address.countries = this.countryList.find(p => p.id === valueId);
    } else {
      this.address.countries = this.countryList.find(p => p.id === 1);
    }
  }

  private initCountryProvince() {
    this.provinceService.query().subscribe(res => {
      const provinces: any = res.body;
      this.provinces = provinces;
    });

    this.countriesService.query().subscribe(res => {
      const countryList: any = res.body;
      this.countryList = countryList;
    });
  }

  initAddress() {
    if (this.address === undefined || this.address === null) {
      this.address = {} as Address;
    }

    const province = {} as Province;
    province.id = 1;
    province.name = 'Ontario';

    const country = {} as Countries;
    country.id = 1;
    country.name = 'Canada';

    this.address.province = province;
    this.address.countries = country;

    this.provinces.push(province);
    this.countryList.push(country);
  }

  private findIntegerValue(e: Event) {
    return parseInt((e.target as HTMLInputElement).value, 10);
  }

  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
  }

  getCountry() {
    if (this.address && this.address.countries) {
      const found = this.countryList.find(p => p.id === this.address.countries!.id);
      if (found) {
        return found.name;
      }
    }
    return '';
  }

  getProvince() {
    if (this.address && this.address.province) {
      const found = this.provinces.find(p => p.id === this.address.province!.id);
      if (found) {
        return found.name;
      }
    }
    return '';
  }
}
