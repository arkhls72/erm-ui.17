import { Injectable } from '@angular/core';
import { ClientEvent } from './client-event';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

@Injectable()
export class ClientEventService {
  private publisher = new Subject<ClientEvent>();
  private subscriber = this.publisher.asObservable();

  publish(evt: ClientEvent): void {
    // const x: any = this.publisher.next(evt);
    // setTimeout( x , 0 );

    return this.publisher.next(evt);
  }

  subscribe(fun: (arg0: ClientEvent) => void): Subscription {
    return this.subscriber.subscribe(fun);
  }
}
