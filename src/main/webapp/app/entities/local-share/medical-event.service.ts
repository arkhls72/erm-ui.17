import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { MedicalEvent } from './medicalEvent';

@Injectable()
export class MedicalEventService {
  private publisher = new Subject<MedicalEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: MedicalEvent): void {
    // const x: any = this.publisher.next(evt);
    //   setTimeout(x, 0);
    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: MedicalEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
