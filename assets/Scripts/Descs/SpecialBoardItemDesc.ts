import { SpecialItemsAbilityTypes } from "../Globals/GlobalConstants";
import BaseBoardItemDesc from "./BaseBoardItemDesc";

const {ccclass, property} = cc._decorator;

@ccclass("SpecialItemDesc")
export default class SpecialBoardItemDesc extends BaseBoardItemDesc {
    // Editor region
    @property({type: cc.Enum(SpecialItemsAbilityTypes)})
    private abilityType: SpecialItemsAbilityTypes = SpecialItemsAbilityTypes.NONE;

    @property({
        type: cc.Integer,
        min: 1,
        max: 20
    })
    private itemsAmountForSpawn: number = 1;

    @property(cc.SpriteFrame)
    private spriteFrame: cc.SpriteFrame = null;

    // Public region
    public getAbilityType(): SpecialItemsAbilityTypes {
        return this.abilityType;
    }

    public getItemsAmountForSpawn(): number {
        return this.itemsAmountForSpawn;
    }

    public getSpriteFrame(): cc.SpriteFrame {
        return this.spriteFrame;
    }
}
