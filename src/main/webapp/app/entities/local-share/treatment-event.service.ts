import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TreatmentEvent } from './treatmentEvent';
@Injectable()
export class TreatmentEventService {
  private publisher = new Subject<TreatmentEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: TreatmentEvent): void {
    // const x:  any= this.publisher.next(evt);
    // setTimeout(x, 0);

    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: TreatmentEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
