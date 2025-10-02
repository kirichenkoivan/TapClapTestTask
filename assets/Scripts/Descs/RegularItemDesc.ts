import { STR_NONE_TYPE } from "../Globals/GlobalConstants";
import BaseBoarItemDesc from "./BaseBoardItemDesc";

const {ccclass, property} = cc._decorator;

@ccclass('RegularItemDesc')
export default class RegularItemDesc extends BaseBoarItemDesc {
    // Editor region
    @property(cc.String)
    private type: string = STR_NONE_TYPE;

    @property(cc.SpriteFrame)
    private spriteFrame: cc.SpriteFrame = null;

    // Public region
    public getType(): string {
        return this.type;
    }

    public getSpriteFrame(): cc.SpriteFrame {
        return this.spriteFrame;
    }
}
