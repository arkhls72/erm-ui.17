import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { Prog } from 'app/entities/prog/prog.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { BaseEntity } from '../../shared/model/base-entity';

export class ProgEdit implements BaseEntity {
  constructor(
    public id?: number,
    public group?: ExerGroup,
    public exercise?: Exercise,
    public progGroupInstruction?: ProgGroupInstruction,
    public prog?: Prog,
  ) {}
}
