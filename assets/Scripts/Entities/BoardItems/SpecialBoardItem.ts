import BaseBoardItemDesc from "../../Descs/BaseBoardItemDesc";
import SpecialBoardItemDesc from "../../Descs/SpecialBoardItemDesc";
import { BoardEntitiesTypes, SpecialItemsAbilityTypes, STR_NONE_TYPE } from "../../Globals/GlobalConstants";
import BaseBoardItem from "./BaseBoardItem";

const {ccclass} = cc._decorator;

@ccclass
export default class SpecialBoardItem extends BaseBoardItem {
    // Private region
    private abilityType: SpecialItemsAbilityTypes = SpecialItemsAbilityTypes.NONE;

    // Public region
    public init(desc: BaseBoardItemDesc): void {
        if (!desc) {
            cc.error("Special item desc is null");
            return;
        }

        this.subscribeEvents();
        const specialItemDesc = desc as SpecialBoardItemDesc;
        this.abilityType = specialItemDesc.getAbilityType();
        this.setSpriteFrame(specialItemDesc.getSpriteFrame());
    }

    public getEntityType(): BoardEntitiesTypes {
        return BoardEntitiesTypes.SPECIAL_ITEM;
    }

    public getAbilityType(): SpecialItemsAbilityTypes {
        return this.abilityType;
    }
}
