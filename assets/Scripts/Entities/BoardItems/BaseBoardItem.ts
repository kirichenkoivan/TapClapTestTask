import BaseBoardItemDesc from "../../Descs/BaseBoardItemDesc";
import { BoardEntitiesTypes } from "../../Globals/GlobalConstants";

const {ccclass, property} = cc._decorator;

export class BaseBoardItemEvents {
    static ON_CLICK: string = "BASE_BOARD_ITEM_ON_CLICK";
}

@ccclass
export default abstract class BaseBoardItem extends cc.Component {
    // Editor region
    @property(cc.Sprite)
    private sprite: cc.Sprite = null;

    private eventTarget: cc.EventTarget = new cc.EventTarget;
    private id: cc.Vec2 = cc.v2(-1, -1);

    // Protected region
    protected subscribeEvents(): void {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.handleMouseDown);
    }

    protected unsubscribeEvents(): void {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.handleMouseDown);
    }

    protected handleMouseDown(): void {
        this.eventTarget.emit(BaseBoardItemEvents.ON_CLICK, this.id);
    }

    // Public region
    public abstract init(desc: BaseBoardItemDesc): void;

    public getEntityType(): BoardEntitiesTypes {
        return BoardEntitiesTypes.NONE;
    }

    public setSpriteFrame(spriteFrame: cc.SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }

    public setId(id: cc.Vec2): void {
        if (id.x < 0 || id.y < 0) {
            cc.error("Id cannot be a negative value");
        }

        this.id = id;
    }

    public getId(): cc.Vec2 { 
        return this.id;
    }

    public reset(): void {
        this.id = cc.v2(-1, -1);
        this.unsubscribeEvents();
    }
}
