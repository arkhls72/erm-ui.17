import { BaseEntity } from '../../shared/model/base-entity';

export class Medical implements BaseEntity {
  constructor(
    public id: number,
    public clientId?: number | null,
    public injuryId?: number | null,
    public medicationId?: number | null,
    public conditionId?: number | null,
    public operationId?: number | null,
  ) {}
}

export type NewMedical = Omit<Medical, 'id'> & { id: null };
