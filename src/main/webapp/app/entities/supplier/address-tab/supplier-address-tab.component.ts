import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Province } from 'app/entities/province/province.model';
import { Countries } from 'app/entities/countries/countries.model';
import { HttpResponse } from '@angular/common/http';
import { Address } from 'app/entities/address/address.model';
import { Supplier } from 'app/entities/supplier/supplier.model';
import { AddressService } from '../../address/service/address.service';
import { ProvinceService } from '../../province/service/province.service';
import { CountriesService } from '../../countries/service/countries.service';
import { add } from 'husky';
@Component({
  selector: 'bc-supplier-address-tab',
  templateUrl: './supplier-address-tab.component.html',
})
export class SupplierAddressTabComponent implements OnInit {
  @Input()
  supplier!: Supplier;
  isSaving!: boolean;
  address!: Address;
  provinces!: Province[];
  public countryList = new Array<Countries>();
  eventSubscriber!: Subscription;
  insuranceEventSubscription!: Subscription;
  constructor(
    private addressService: AddressService,
    private provinceService: ProvinceService,
    private countriesService: CountriesService,
  ) {
    //
    // private insuranceEventService: InsuranceEventService
  }
  ngOnInit() {
    // this.insuranceEventSubscription = this.insuranceEventService.subscribe(this.onInsuranceEvent.bind(this));
    if (this.supplier.addressId !== undefined && this.supplier.addressId !== null) {
      this.addressService.find(this.supplier.addressId).subscribe(res => {
        const address: any = res.body;
        this.address = address;
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
    const supplier: any = this.supplier;
    if (this.address === undefined || this.address === null || this.address.id === undefined || this.address.id === null) {
      this.subscribeToSaveResponse(this.addressService.createForSupplier(this.address, supplier.id));
    } else {
      this.subscribeToSaveResponse(this.addressService.updateForSupplier(this.address, supplier.id));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Address>>) {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(result: HttpResponse<Address>) {
    this.isSaving = false;
    const address: any = result.body;
    this.address = address;
    this.supplier.addressId = this.address.id;
  }

  protected onSaveError() {
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
    const address: Address = {} as Address;
    const province = new Province(1, 'Onario');

    const country = new Countries(1, 'Canada');
    country.id = 1;
    country.name = 'Canada';
    this.address.province = province;
    this.address.countries = country;
  }
  // returen the number Integer asscociated the event that happens to select element
  private findIntegerValue(e: Event) {
    return parseInt((e.target as HTMLInputElement).value, 10);
  }
}
