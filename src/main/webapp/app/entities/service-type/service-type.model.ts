import { BaseEntity } from '../../shared/model/base-entity';

export class ServiceType implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}
export type NewServiceType = Omit<ServiceType, 'id'> & { id: null };
