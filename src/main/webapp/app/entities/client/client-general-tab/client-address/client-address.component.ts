import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Client } from '../../client.model';
import { Province } from 'app/entities/province/province.model';
import { Countries } from 'app/entities/countries/countries.model';
import { HttpResponse } from '@angular/common/http';
import { Address } from 'app/entities/address/address.model';
import { AddressService } from '../../../address/service/address.service';
import { ProvinceService } from '../../../province/service/province.service';
import { CountriesService } from '../../../countries/service/countries.service';
import { FormsModule } from '@angular/forms';
import FormatMediumDatetimePipe from '../../../../shared/date/format-medium-datetime.pipe';
@Component({
  standalone: true,
  selector: 'bc-client-address',
  templateUrl: './client-address.component.html',
  imports: [FormsModule, FormatMediumDatetimePipe, FormatMediumDatetimePipe, FormatMediumDatetimePipe, FormatMediumDatetimePipe],
})
export class ClientAddressComponent implements OnInit {
  @Input()
  client!: Client;
  isSaving!: boolean;
  provinces!: Province[];
  address!: Address;
  public countryList: Countries[] = new Array<Countries>();

  constructor(
    private addressService: AddressService,
    private provinceService: ProvinceService,
    private countriesService: CountriesService,
  ) {}
  ngOnInit() {
    this.isSaving = false;
    this.initAddress();
    this.provinceService.query().subscribe((res: HttpResponse<Province[]>) => (this.provinces = res.body || []));

    this.countriesService.query().subscribe((res: HttpResponse<Countries[]>) => (this.countryList = res.body || []));
  }
  save() {
    this.isSaving = true;
    this.client.address = this.address;
    if (this.address === null || this.address === undefined || this.address.id === null || this.address.id === undefined) {
      this.subscribeToSaveResponse(this.addressService.createForClient(this.address, this.client.id!));
    } else {
      this.subscribeToSaveResponse(this.addressService.updateForClient(this.address, this.client.id!));
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<Address>>): void {
    result.subscribe(
      x => this.onSaveSuccess(x.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(address: any): void {
    this.isSaving = false;
    this.address = address;
    this.client.address = address;
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  changeProvince(province: Event) {
    const valueId: number = this.findIntegerValue(province);
    if (valueId) {
      // this.client.address.province = this.provinces.find((p) => p.id === valueId);
      const foundProvince: any = this.provinces.find(p => p.id === valueId);
      this.address.province = foundProvince;
    }
  }

  changeCountries(event: Event) {
    const valueId: number = this.findIntegerValue(event);
    if (valueId) {
      const foundCountries: any = this.countryList.find(p => p.id === valueId);
      this.address.countries = foundCountries;
    }
  }

  private findIntegerValue(e: Event) {
    return parseInt((e.target as HTMLInputElement).value, 10);
  }

  initAddress() {
    const address: any = this.client.address;
    this.address = address;

    if (this.address === null || this.address === undefined) {
      this.address = {} as Address;
      const province = {} as Province;
      province.id = 1;
      province.name = 'Ontario';

      const countries = {} as Countries;
      countries.id = 1;
      countries.name = 'Canada';
      this.address.province = province;
      this.address.countries = countries;
    }
  }
}
