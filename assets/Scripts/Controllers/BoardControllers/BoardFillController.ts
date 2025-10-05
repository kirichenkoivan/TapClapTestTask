import RegularItemDesc from "../../Descs/RegularItemDesc";
import SpecialBoardItemDesc from "../../Descs/SpecialBoardItemDesc";
import BaseBoardItem, { BaseBoardItemEvents } from "../../Entities/BoardItems/BaseBoardItem";
import RegularItemFactory from "../../Factories/RegularItemFactory";
import SpecialItemFactory from "../../Factories/SpecialItemFactory";
import { getPositionById, randomInt } from "../../Globals/GlobalConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoardFillController extends cc.Component {
    // Editor region
    @property(cc.Node)
    private gridHolder: cc.Node = null;

    @property(RegularItemFactory)
    private regularItemFactory: RegularItemFactory = null;

    @property(SpecialItemFactory) 
    private specialItemsFactory: SpecialItemFactory = null;

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
        
        const rndId = randomInt(0, this.regularItemsDescs.length - 1);
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

    public fillBoard(): void {
        for(let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (this.grid[x][y] != null) {
                    continue;
                }

                const regularItem = this.regularItemFactory.getRegularItem();

                if (!regularItem) {
                    cc.error("Created regular item is null");
                    return;
                }

                const itemDesc = this.getRandomRegularItemDesc();
                regularItem.init(itemDesc);
                regularItem.setId(cc.v2(x,y));

                this.gridHolder.addChild(regularItem.node);
                const position = getPositionById(cc.v2(x,y), this.itemsOffset, this.itemsScreenOffset);
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

    public cleanBoard(isInitial: boolean = false): void {
        for (let x = 0; x < this.gridSize.x; x++) {
            if (isInitial) {
                this.grid[x] = [];
            }

            for (let y = 0; y < this.gridSize.y; y++) {
                if (!isInitial && this.grid[x][y] != null) {
                    this.grid[x][y].fireWantToRemove();
                }

                this.grid[x][y] = null;
            }
        }
    }

    public createSpecialItem(desc: SpecialBoardItemDesc, id: cc.Vec2): void {
        if (desc == null) {
            return;
        }

        const specialItem = this.specialItemsFactory.createSpecialItem();
        
        if (specialItem == null) {
            cc.error("Cannot create special item");
            return;
        }

        specialItem.init(desc);
        specialItem.setId(id);
        
        this.gridHolder.addChild(specialItem.node);
        const position = getPositionById(id, this.itemsOffset, this.itemsScreenOffset);
        specialItem.node.setPosition(position);
        specialItem.getEventTarget().on(BaseBoardItemEvents.ON_CLICK, this.itemClickCb, this);
        this.grid[id.x][id.y] = specialItem;
    }
}