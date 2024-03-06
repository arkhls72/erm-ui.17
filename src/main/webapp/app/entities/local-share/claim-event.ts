export enum ClaimEventType {
  CLAIM,
  WSIB_EDIT,
  WSIB_ADD,
  WSIB_COVERAGE,
  WSIB_ADDRESS,
  BACK,
  WSIB_DELETE,
  MVA_EDIT,
  MVA_ADD,
  MVA_COVERAGE,
  MVA_ADDRESS,
  MVA_DELETE,
}
export class ClaimEvent {
  constructor(
    public type?: ClaimEventType,
    public button?: string,
    public source?: string,
  ) {}
}
