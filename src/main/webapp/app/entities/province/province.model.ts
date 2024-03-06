import { BaseEntity } from '../../shared/model/base-entity';

export class Province implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}
export type NewProvince = Omit<Province, 'id'> & { id: null };
