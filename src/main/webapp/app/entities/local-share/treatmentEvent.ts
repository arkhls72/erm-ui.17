import { Plan } from 'app/entities/plan/plan.model';

export enum TreatmentEventType {
  TREATMENT_VIEW,
  TREATMENT_LIST,
  TREATMENT_SELECT_ASSESSMENT,
  TREATMENT_ADD,
  TREATMENT_DELETE,

  BACK,
}
export class TreatmentEvent {
  constructor(
    public type?: TreatmentEventType,
    public plan?: Plan,
    public source?: string,
    public plans?: Plan[],
  ) {}
}
