import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice } from 'app/entities/invoice/invoice.model';
import { InvoiceItemDetail } from './invoice-Item-detail.model';
import { InvoiceItemSave } from './invoiceItemSave.model';
import { Item } from '../invoice/item.model';
import { ApplicationConfigService } from '../../core/config/application-config.service';

type EntityResponseType = HttpResponse<InvoiceItemDetail>;
type EntityResponseDeleteType = HttpResponse<Item>;

@Injectable({ providedIn: 'root' })
export class InvoiceItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoice-item');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}
  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Invoice>(`${this.resourceUrl}/${id}`, { observe: 'response' }).pipe(map((res: EntityResponseType) => res));
  }

  updateItems(invoiceItemSave: InvoiceItemSave): Observable<EntityResponseType> {
    const copy = invoiceItemSave;
    return this.http.put<Invoice>(this.resourceUrl, copy, { observe: 'response' }).pipe(map((res: EntityResponseType) => res));
  }

  findItemsByInvoiceId(id?: number): Observable<EntityResponseType> {
    return this.http.get<Invoice>(`${this.resourceUrl}/invoice/${id}`, { observe: 'response' }).pipe(map((res: EntityResponseType) => res));
  }

  delete(item?: Item): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/item/${item?.itemId}/type/${item?.type}`, { observe: 'response' });
  }

  protected convertDateFromClient(invoice: Invoice) {
    const copy: Invoice = Object.assign({}, invoice, {
      createdDate: invoice.createdDate && invoice.createdDate.isValid() ? invoice.createdDate.toJSON() : undefined,
      lastModifiedDate: invoice.lastModifiedDate && invoice.lastModifiedDate.isValid() ? invoice.lastModifiedDate.toJSON() : undefined,
    });
    return copy;
  }
}
