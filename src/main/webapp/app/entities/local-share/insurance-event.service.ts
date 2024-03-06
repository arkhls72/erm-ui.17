import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { InsuranceEvent } from './InsuranceEvent';

@Injectable()
export class InsuranceEventService {
  private publisher = new Subject<InsuranceEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: InsuranceEvent): void {
    // const x: any = this.publisher.next(evt)
    // setTimeout(x, 0);
    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: InsuranceEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
