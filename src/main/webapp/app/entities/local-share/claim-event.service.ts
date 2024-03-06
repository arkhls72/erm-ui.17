import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {} from 'rxjs';
import { ClaimEvent } from './claim-event';

@Injectable()
export class ClaimEventService {
  private publisher = new Subject<ClaimEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: ClaimEvent): void {
    // const x: any = this.publisher.next(evt)
    // setTimeout(x, 0);
    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: ClaimEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
