export interface ParentNode {
  // using type any to avoid methods complaining of invalid type
  id?: number;
  groupId?: number;
  instructionId?: number;
  name: string;
  firstId?: number;
  secondId?: number;
  children?: ParentNode[];
}
