import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'app/entities/product/product.model';
import { MyProductFee } from 'app/entities/my-product-fee/my-product-fee.model';
import { FeeType } from 'app/entities/fee-type/fee-type.model';
import { ProductService } from '../service/product.service';
import { MyProductFeeService } from '../../my-product-fee/service/my-product-fee.service';
import { FeeTypeService } from '../../fee-type/service/fee-type.service';
import { ShortProductFee } from './short-product-fee.model';

@Component({
  selector: 'bc-product-fee-package-tab',
  templateUrl: './product-fee-package-tab.component.html',
})
export class ProductFeePackageTabComponent implements OnInit {
  @Input()
  product!: Product;
  isSaving = false;

  myProductFees: MyProductFee[] = [];
  feeTypes: FeeType[] = [];
  displayProductFees: MyProductFee[] = [];

  constructor(
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected myProductFeeService: MyProductFeeService,
    protected feeTypeService: FeeTypeService,
  ) {}

  ngOnInit(): void {
    this.initfeeType();
  }

  private initDisplayForType() {
    const product: any = this.product;
    if (this.feeTypes !== undefined && this.feeTypes !== null) {
      for (let i = 0; i < this.feeTypes.length; i++) {
        const newMyFee = {} as MyProductFee;
        newMyFee.feeTypeId = this.feeTypes[i].id;
        newMyFee.feeTypeName = this.feeTypes[i].name;
        newMyFee.myProductId = this.product.id;
        this.displayProductFees.push(newMyFee);
      }
    }
    this.myProductFeeService.queryByProductId(product.id).subscribe(res => {
      const myProductFees: any = res.body;
      this.myProductFees = myProductFees;
      this.initDisplayForFee();
    });
  }

  private initDisplayForFee() {
    for (let i = 0; i < this.displayProductFees.length; i++) {
      const foundProduct = this.myProductFees.find(x => x.feeTypeId === this.displayProductFees[i].feeTypeId);
      if (foundProduct !== null && foundProduct !== undefined) {
        this.displayProductFees[i].fee = foundProduct.fee;
        this.displayProductFees[i].id = foundProduct.id;
      }
    }
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product: any = this.product;
    const toSaveOrUpDate = this.initForSaveOrUpdate();
    this.subscribeToSaveResponse(this.myProductFeeService.updateList(toSaveOrUpDate, product.id));
  }

  private initForSaveOrUpdate() {
    const toSaveOrUpDate: ShortProductFee[] = [];

    for (let i = 0; i < this.displayProductFees.length; i++) {
      if (
        (this.displayProductFees[i].id !== undefined && this.displayProductFees[i].id != null) ||
        (this.displayProductFees[i].fee !== undefined && this.displayProductFees[i].fee !== 0)
      ) {
        const s: ShortProductFee = new ShortProductFee();
        s.id = this.displayProductFees[i].id;
        s.feeTypeId = this.displayProductFees[i].feeTypeId;
        s.fee = this.displayProductFees[i].fee;
        toSaveOrUpDate.push(s);
      }
    }

    return toSaveOrUpDate;
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<MyProductFee[]>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res.body),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(res: any): void {
    this.isSaving = false;
    this.myProductFees = res;
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  initfeeType() {
    this.feeTypeService.query().subscribe(res => {
      const feeTypes: any = res.body;
      this.feeTypes = feeTypes;
      this.initDisplayForType();
    });
  }
}
