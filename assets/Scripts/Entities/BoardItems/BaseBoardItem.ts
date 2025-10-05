import BaseBoardItemDesc from "../../Descs/BaseBoardItemDesc";
import { BoardEntitiesTypes } from "../../Globals/Globals";

const {ccclass, property} = cc._decorator;

export class BaseBoardItemEvents {
    static ON_CLICK: string = "BASE_BOARD_ITEM_ON_CLICK";
    static ON_WANT_TO_REMOVE: string = "BASE_BOARD_ITEM_ON_WANT_TO_REMOVE";
}

@ccclass
export default abstract class BaseBoardItem extends cc.Component {
    // Editor region
    @property(cc.Sprite)
    private sprite: cc.Sprite = null;

    // Private region
    private eventTarget: cc.EventTarget = new cc.EventTarget();
    private isChecked: boolean = false;

    // Protected region
    protected id: cc.Vec2 = cc.v2(-1, -1);

    protected subscribeEvents(): void {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.handleInputAction, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleInputAction, this);
    }

    protected unsubscribeEvents(): void {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.handleInputAction, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.handleInputAction, this);
    }

    protected handleInputAction(): void {
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

    public getEventTarget(): cc.EventTarget {
        return this.eventTarget;
    }

    public setChecked(isChecked: boolean): void {
        this.isChecked = isChecked;
    }

    public getChecked(): boolean {
        return this.isChecked;
    }

    public reset(): void {
        this.id = cc.v2(-1, -1);
        this.isChecked = false;
        this.unsubscribeEvents();
    }

    public fireWantToRemove(): void {
        this.eventTarget.emit(BaseBoardItemEvents.ON_WANT_TO_REMOVE, this);
    }
}
