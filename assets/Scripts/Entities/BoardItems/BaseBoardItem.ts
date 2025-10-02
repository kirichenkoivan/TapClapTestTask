import BaseBoardItemDesc from "../../Descs/BaseBoardItemDesc";
import { BoardEntitiesTypes } from "../../Globals/GlobalConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class BaseBoardItem extends cc.Component {
    // Editor region
    @property(cc.Sprite)
    private sprite: cc.Sprite = null;

    // Public region
    public abstract init(desc: BaseBoardItemDesc): void;

    public getEntityType(): BoardEntitiesTypes {
        return BoardEntitiesTypes.NONE;
    }

    public setSpriteFrame(spriteFrame: cc.SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }
}
