import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { OrderEvent } from './orderEvent';
@Injectable()
export class OrderEventService {
  private publisher = new Subject<OrderEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: OrderEvent): void {
    // const x: any = this.publisher.next(evt);
    // setTimeout(x, 0);
    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: OrderEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
