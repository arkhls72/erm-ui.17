import { Client } from 'app/entities/client/client.model';

export enum ClientEventType {
  None,
  Get,
  Init,
}

export class ClientEvent {
  constructor(
    public type?: ClientEventType,
    public client?: Client,
    public source?: string,
    public inUse?: any,
  ) {}
}
