// Constants
export const STR_NONE_TYPE = "NONE_TYPE";

export enum BoardEntitiesTypes {
    NONE = 0,
    REGULAR_ITEM, 
    SPECIAL_ITEM
}

export enum SpecialItemsAbilityTypes {
  NONE = 0,
  CLEAR_ITEMS_IN_ROW,
  CLEAR_ITEMS_IN_LINE,
  CLEAR_ITEMS_IN_RADIUS,
  CLEAR_ALL_ITEMS
}

// Functions
export const randomInt = (min, max): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getPositionById = (id: cc.Vec2, offset: cc.Vec2, screenOffest: cc.Vec2): cc.Vec3 => {
  return cc.v3(id.x * offset.x + screenOffest.x, id.y * offset.y + screenOffest.y, 0)
}