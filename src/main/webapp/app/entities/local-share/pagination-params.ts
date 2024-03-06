export class PaginationParams {
  public itemsPerPage!: number;
  public maxSize!: number;
  public totalItems!: number;
  public queryCount!: number;
  public currentPage!: number;
  // public previousPage: number;
  public destinationPage!: number;
  public reverse!: boolean;
  public predicate!: string;
  // public links: string[] = new Array<string>();
  public links: any = {};
}
