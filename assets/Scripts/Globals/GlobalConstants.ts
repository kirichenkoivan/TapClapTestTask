// Constants
export const STR_NONE_TYPE = "NONE_TYPE";

export enum BoardEntitiesTypes {
    NONE = 0,
    REGULAR_ITEM, 
    SPECIAL_ITEM
}

// Functions
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;