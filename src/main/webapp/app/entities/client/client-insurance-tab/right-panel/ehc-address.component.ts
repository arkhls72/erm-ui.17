import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ehc } from 'app/entities/ehc/ehc.model';
import { Province } from 'app/entities/province/province.model';
import { Countries } from 'app/entities/countries/countries.model';
import { HttpResponse } from '@angular/common/http';
import { Address } from 'app/entities/address/address.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../address/service/address.service';
import { ProvinceService } from '../../../province/service/province.service';
import { CountriesService } from '../../../countries/service/countries.service';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import dayjs from 'dayjs/esm';
import { NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'bc-ehc-address',
  templateUrl: './ehc-address.component.html',
  imports: [ReactiveFormsModule, NgIf, FormsModule],
})
export class EhcAddressComponent implements OnInit {
  editMode = false;
  @Input()
  ehc!: Ehc;
  isSaving!: boolean;
  address!: Address;
  provinces!: Province[];
  public countryList: Countries[] = new Array<Countries>();

  editForm = this.fb.group({
    id: [],
    streetNumber: [null, [Validators.required, Validators.maxLength(50)]],
    streetName: [null, [Validators.required, Validators.maxLength(50)]],
    unitNumber: [null, [Validators.maxLength(20)]],
    postalCode: [null, [Validators.required, Validators.maxLength(6)]],
    city: [null, [Validators.required, Validators.maxLength(30)]],
    poBox: [null, [Validators.maxLength(30)]],
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
    if (this.ehc && this.ehc.addressId) {
      this.addressService.find(this.ehc.addressId).subscribe(res => {
        if (res && res.body) {
          this.address = res.body;
          this.updateForm(this.address);
        }
      });
    } else {
      this.initAddress();
    }
    this.isSaving = false;

    this.provinceService.query().subscribe(res => {
      this.provinces = res.body || [];
    });

    this.countriesService.query().subscribe(res => {
      this.countryList = res.body || [];
    });
  }
  save() {
    this.isSaving = true;
    const ehc: any = this.ehc;
    const address = this.createFromToSave();
    address.countries = this.address.countries;
    address.province = this.address.province;

    if (this.address && this.address.id) {
      this.subscribeToSaveResponse(this.addressService.createForEhc(address, ehc.id));
    } else {
      this.subscribeToSaveResponse(this.addressService.updateForEhc(address, ehc.id));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Address>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(result: HttpResponse<Address>): void {
    this.isSaving = false;
    const address: any = result.body;
    this.address = address;
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackProvinceById(index: number, item: Province) {
    return item.id;
  }

  changeProvince(event: Event) {
    const valueId: number = this.findIntegerValue(event);
    if (valueId) {
      this.address.province = this.provinces.find(p => p.id === valueId);
    } else {
      const address: any = this.address;
      address.province = null;
      this.address.province = address;
    }
  }

  changeCountries(event: Event) {
    const valueId: number = this.findIntegerValue(event);
    if (valueId) {
      this.address.countries = this.countryList.find(p => p.id === valueId);
    } else {
      const countries: any = null;
      this.address.countries = countries;
    }
  }

  initAddress() {
    this.address = {} as Address;
    const province = {} as Province;
    province.id = 1;
    province.name = 'Ontario';

    const country = {} as Countries;
    country.id = 1;
    country.name = 'Canada';

    this.address.province = province;
    this.address.countries = country;
  }
  private findIntegerValue(e: Event) {
    return parseInt((e.target as HTMLInputElement).value, 10);
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
      poBox: address.poBox,
      lastModifiedDate: address.lastModifiedDate ? address.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }
  createFromToSave(): Address {
    const address = {} as Address;

    (address.id = this.editForm.get(['id'])!.value),
      (address.streetNumber = this.editForm.get(['streetNumber'])!.value),
      (address.streetName = this.editForm.get(['streetName'])!.value),
      (address.unitNumber = this.editForm.get(['unitNumber'])!.value),
      (address.postalCode = this.editForm.get(['postalCode'])!.value),
      (address.city = this.editForm.get(['city'])!.value),
      (address.poBox = this.editForm.get(['poBox'])!.value),
      (address.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value
        ? dayjs(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : null);

    return address;
  }
  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
  }

  getProvince() {
    if (this.ehc && this.ehc.addressId && this.address) {
      const found = this.provinces.find(p => p.id === this.address.province!.id);
      if (found) {
        return found.name;
      }
    }

    return '';
  }

  getCountry() {
    if (this.ehc && this.ehc.addressId && this.address) {
      const found = this.countryList.find(p => p.id === this.address.countries!.id);
      if (found) {
        return found.name;
      }
    }

    return '';
  }
}
