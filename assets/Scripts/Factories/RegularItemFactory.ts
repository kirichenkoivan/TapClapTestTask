import RegularItemDesc from "../Descs/RegularItemDesc";
import BaseBoardItem, { BaseBoardItemEvents } from "../Entities/BoardItems/BaseBoardItem";
import RegularBoardItem from "../Entities/BoardItems/RegularBoardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RegularItemFactory extends cc.Component {
    // Editor region
    @property(cc.Prefab)
    private regularItemPrefab: cc.Prefab = null;

    // Private region
    private pool: cc.NodePool = new cc.NodePool();

    onLoad(): void {
        if (!this.regularItemPrefab) {
            console.error("Regular item prefab is null");
        }

        this.pool = new cc.NodePool();
    }

    // Public region
    public getRegularItem(): BaseBoardItem {
        let node: cc.Node = null;
        let isNew: boolean = false;

        if (this.pool.size() > 0) {
          node = this.pool.get();
        } else {
          node = cc.instantiate(this.regularItemPrefab);
          isNew = true;
        }
    
        const comp = node.getComponent(RegularBoardItem);

        if (!comp) {
          cc.error('RegularItemFactory: prefab не содержит BaseBoardItem');
          return null;
        }

        if (isNew) {
          comp.getEventTarget().on(BaseBoardItemEvents.ON_WANT_TO_REMOVE, this.returnRegularItem, this);
        }
    
        node.active = true;
        return comp;
    }

    public returnRegularItem = (item: BaseBoardItem): void => {
      if (item == null) {
        cc.error("Item to return is null");
        return;
      }

      item.reset();

      item.node.stopAllActions();
      item.node.removeFromParent(false); 
      item.node.active = false;
      this.pool.put(item.node);
    }
}
