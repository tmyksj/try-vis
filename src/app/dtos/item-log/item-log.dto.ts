import { ItemLogTypeDto } from "../item-log-type/item-log-type.dto";

export interface ItemLogDto {

  readonly id: number | null;

  readonly itemId: number | null;

  readonly type: ItemLogTypeDto | null;

  readonly createdAt: Date | null;

}
