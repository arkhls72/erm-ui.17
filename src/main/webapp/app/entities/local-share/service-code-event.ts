export enum ServiceCodeEventType {
  IMPORT_SERVICE_CODE,
}
export class ServiceCodeEvent {
  constructor(
    public type?: ServiceCodeEventType,
    public button?: string,
    public source?: string,
  ) {}
}
