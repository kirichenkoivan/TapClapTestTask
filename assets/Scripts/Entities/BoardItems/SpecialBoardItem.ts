import BaseBoardItemDesc from "../../Descs/BaseBoardItemDesc";
import SpecialBoardItemDesc from "../../Descs/SpecialBoardItemDesc";
import { BoardEntitiesTypes, SpecialItemsAbilityTypes, STR_NONE_TYPE } from "../../Globals/Globals";
import BaseBoardItem from "./BaseBoardItem";

const {ccclass} = cc._decorator;

@ccclass
export default class SpecialBoardItem extends BaseBoardItem {
    // Private region
    private abilityType: SpecialItemsAbilityTypes = SpecialItemsAbilityTypes.NONE;
    private additionalArgs: number[] = [];

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
        this.additionalArgs = specialItemDesc.getAdditionalArgs();
    }

    public getEntityType(): BoardEntitiesTypes {
        return BoardEntitiesTypes.SPECIAL_ITEM;
    }

    public getAbilityType(): SpecialItemsAbilityTypes {
        return this.abilityType;
    }

    public getAdditionalArgs(): number[] {
        return this.additionalArgs;
    }
}
