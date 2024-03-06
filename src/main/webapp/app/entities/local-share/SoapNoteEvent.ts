import { Plan } from 'app/entities/plan/plan.model';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';

export enum SoapNoteEventType {
  SOAP_NOTE_VIEW,
  SOAP_NOTE_ADD,
  SOAP_NOTE_DELETE,
  SOAP_NOTE_ASSESSMENT_VIEW,
  SOAP_NOTE_TREATMENT_VIEW,
  SOAP_NOTE_TREATMENT_ADD = 5,
  SOAP_NOTE_TREATMENT_DELETE = 6,
  SOAP_NOTE_ASSESSMENT_ADD = 7,
  SOAP_NOTE_ASSESSMENT_DELETE = 8,
}
export class SoapNoteEvent {
  constructor(
    public type?: SoapNoteEventType,
    public soapNote?: SoapNote,
    public source?: string,
    public plans?: Plan[],
  ) {}
}
