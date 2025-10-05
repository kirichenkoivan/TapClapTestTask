import BaseBoardItem, { BaseBoardItemEvents } from "../Entities/BoardItems/BaseBoardItem";
import SpecialBoardItem from "../Entities/BoardItems/SpecialBoardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpecialItemFactory extends cc.Component {
    // Editor region
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null;

    // Protected region
    protected onLoad(): void {
        if (this.itemPrefab == null) {
            console.error("Item prefab is null");
        }    
    }

    // Public region
    public createSpecialItem(): BaseBoardItem {
        const node = cc.instantiate(this.itemPrefab);
        const comp = node.getComponent(SpecialBoardItem);

        if (!comp) {
            cc.error("Special item prefab err");
            return null;
        }

        comp.getEventTarget().on(BaseBoardItemEvents.ON_WANT_TO_REMOVE, this.destroySpecialItem, this);
        
        return comp;
    }

    public destroySpecialItem = (item : BaseBoardItem): void => {
        if (!item) {
            return;
        }

        item.reset();
        
        item.node.stopAllActions();
        item.destroy();
    }
}   
