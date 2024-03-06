import { Prog } from 'app/entities/prog/prog.model';
export enum ProgramEventType {
  PROGRAM_VIEW,
  PROGRAM_ADD,
  PROGRAM_SELECT_ASSESSMENT,
  PROGRAM_DELETE,
  PROGRAM_SELECT_GROUP,
  PROGRAM_SELECT_GROUP_EXERCISE,
  PROGRAM_ADD_INSTRUCTION,
  PROGRAM_EDIT_INSTRUCTION,
  PROGRAM_SELECT_EXERCISE,
  PROGRAM_SELECT_EXERCISE_INSTRUCTION,
}
export class ProgramEvent {
  constructor(
    public type?: ProgramEventType,
    public prog?: Prog,
  ) {}
}
