import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { SupplierEvent } from 'app/entities/local-share/supplier-event';

@Injectable()
export class SupplierEventService {
  private publisher = new Subject<SupplierEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: SupplierEvent): void {
    // const x: any = this.publisher.next(evt);
    // setTimeout( x , 0 );
    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: SupplierEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
