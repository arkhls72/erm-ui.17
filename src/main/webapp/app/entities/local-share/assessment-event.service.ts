import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AssessmentEvent } from './assessmentEvent';

@Injectable()
export class AssessmentEventService {
  private publisher = new Subject<AssessmentEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: AssessmentEvent): void {
    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: AssessmentEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
