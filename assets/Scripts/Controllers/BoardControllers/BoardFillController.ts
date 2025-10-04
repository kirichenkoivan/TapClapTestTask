import RegularItemDesc from "../../Descs/RegularItemDesc";
import BaseBoardItem, { BaseBoardItemEvents } from "../../Entities/BoardItems/BaseBoardItem";
import RegularItemFactory from "../../Factories/RegularItemFactory";
import { randomInt } from "../../Globals/GlobalConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoardFillController extends cc.Component {
    // Editor region
    @property(cc.Node)
    private gridHolder: cc.Node = null;

    @property(RegularItemFactory)
    private regularItemFactory: RegularItemFactory = null;

    @property([RegularItemDesc])
    private regularItemsDescs: RegularItemDesc[] = [];

    // Private region
    private grid: BaseBoardItem[][] = null;
    private gridSize: cc.Vec2 = cc.v2(0,0);
    private itemsOffset: cc.Vec2 = cc.v2(100, 100);
    private itemsScreenOffset: cc.Vec2 = cc.v2(150, -900);

    private itemClickCb: Function = null;

    private getRandomRegularItemDesc(): RegularItemDesc {
        if (this.regularItemsDescs.length == 0) {
            return null;
        }
        
        let rndId = randomInt(0, this.regularItemsDescs.length - 1);
        return this.regularItemsDescs[rndId];
    }

    // Public region
    public init(grid: BaseBoardItem[][], size: cc.Vec2, itemsOffset: cc.Vec2, itemsScreenOffset: cc.Vec2): void {
        this.grid = grid;
        this.gridSize = size;
        this.itemsOffset = itemsOffset;
        this.itemsScreenOffset = itemsScreenOffset;
    }

    public setRegularItemClickCb(cb: (id: cc.Vec2) => void) {
        this.itemClickCb = cb;
    }

    public fillBoard(isInitial: boolean = false): void {
        if (isInitial) {
            this.cleanBoard();
        }

        for(let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (this.grid[x][y] != null) {
                    continue;
                }

                let regularItem = this.regularItemFactory.getRegularItem();

                if (!regularItem) {
                    cc.error("Created regular item is null");
                    return;
                }

                let itemDesc = this.getRandomRegularItemDesc();
                regularItem.init(itemDesc);
                regularItem.setId(cc.v2(x,y));

                this.gridHolder.addChild(regularItem.node);
                let position: cc.Vec3 = cc.v3(x * this.itemsOffset.x + this.itemsScreenOffset.x, y * this.itemsOffset.y + this.itemsScreenOffset.y, 0);
                regularItem.node.setPosition(position);

                regularItem.getEventTarget().on(BaseBoardItemEvents.ON_CLICK, this.itemClickCb, this);

                this.grid[x][y] = regularItem;
            }
        }
    }

    public removeItem(item: BaseBoardItem): void {
        if (item == null) {
            cc.error("Item is null");
            return;
        }

        item.node.removeFromParent(false);
        item.getEventTarget().off(BaseBoardItemEvents.ON_CLICK, this.itemClickCb, this)

        let itemId = item.getId();
        this.grid[itemId.x][itemId.y] = null;

        this.regularItemFactory.returnRegularItem(item);
    }

    public cleanBoard(): void {
        for (let i = 0; i < this.gridSize.x; i++) {
            this.grid[i] = [];

            for (let j = 0; j < this.gridSize.y; j++) {
                this.grid[i][j] = null;
            }
        }
    }
}