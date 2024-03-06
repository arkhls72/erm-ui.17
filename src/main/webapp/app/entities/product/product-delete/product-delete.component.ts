import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Product } from 'app/entities/product/product.model';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { NgIf } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'jhi-product-delete',
  templateUrl: './product-delete.component.html',
  imports: [NgIf, AlertErrorComponent, FaIconComponent],
})
export class ProductDeleteComponent implements OnInit {
  product?: Product;

  constructor(
    protected productService: ProductService,
    public activeModal: NgbActiveModal,
    public activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
    window.history.back();
  }

  confirmDelete(id: number): void {
    this.productService.delete(id).subscribe(() => {
      this.activeModal.close();
      this.router.navigate(['/product']);
    });
  }
}
