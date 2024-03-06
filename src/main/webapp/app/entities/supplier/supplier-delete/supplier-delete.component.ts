import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from '../service/supplier.service';
@Component({
  selector: 'jhi-product-delete',
  templateUrl: './supplier-delete.component.html',
})
export class SupplierDeleteComponent implements OnInit {
  supplier?: Supplier;

  constructor(
    protected supplierService: SupplierService,
    public activeModal: NgbActiveModal,
    public activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supplier }) => {
      this.supplier = supplier;
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
    window.history.back();
  }

  confirmDelete(id: number): void {
    this.supplierService.delete(id).subscribe(() => {
      this.activeModal.close();
      this.router.navigate(['/supplier']);
    });
  }
}
