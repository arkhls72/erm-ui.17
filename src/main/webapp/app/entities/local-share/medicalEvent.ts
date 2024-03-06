export enum MedicalEventType {
  MEDICAL,
  CONDITION,
  MEDICATION,
  INJURY,
  OPERATION,
  SELECTED,
  UNSELECTED,
  BACK,
  MEDICATION_DELETE,
  INJURY_DELETE,
  OPERATION_DELETE,
}

export class MedicalEvent {
  constructor(
    public type?: MedicalEventType,
    public button?: string,
    public source?: string,
  ) {}
}
