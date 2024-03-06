import { Ehc } from 'app/entities/ehc/ehc.model';

export enum InsuranceEventType {
  EHC,
  EHC_EDIT,
  EHC_ADD_PRIMARY,
  EHC_COVERAGE,
  EHC_ADDRESS,
  EHC_SECONDARY,
  EHC_PRIMARY_SELECTED,
  EHC_PRIMARY_UNSELECTED,
  BACK,
  EHC_DELETE = 9,
  EHC_LIST = 10,
  EHC_SECONDARY_EDIT,
}
export class InsuranceEvent {
  constructor(
    public type?: InsuranceEventType,
    public ehc?: Ehc,
    public source?: string,
  ) {}
}
