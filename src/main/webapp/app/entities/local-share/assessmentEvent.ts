import { Assessment } from 'app/entities/assessment/assessment.model';
export enum AssessmentEventType {
  ASSESSMENT_VIEW,
  ASSESSMENT_ADD,
  ASSESSMENT_ADD_TREATMENT,
  ASSESSMENT_TREATMENT_VIEW,
  ASSESSMENT_DELETE,
  ASSESSMENT_TREATMENT_DELETE,
  BACK,
}
export class AssessmentEvent {
  constructor(
    public type?: AssessmentEventType,
    public ass?: Assessment,
    public source?: string,
    public assessments?: Assessment[],
  ) {}
}
