import BoardFillController from "../Controllers/BoardFillController";
import RegularItemFactory from "../Factories/RegularItemFactory";
import BaseBoardItem, { BaseBoardItemEvents } from "./BoardItems/BaseBoardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Board extends cc.Component {
    // Editor region
    @property(cc.Node)
    private gridHolder: cc.Node = null;

    @property(RegularItemFactory)
    private regularItemFactory: RegularItemFactory = null;

    @property(BoardFillController)
    private boardFillController: BoardFillController = null;

    // Private region
    private boardSize: cc.Vec2 = cc.v2(2,2);
    private itemsOffset: cc.Vec2 = cc.v2(100, 100);
    private itemsScreenOffset: cc.Vec2 = cc.v2(150, -900);
    private grid: BaseBoardItem[][] = [];
    private eventTarget: cc.EventTarget = new cc.EventTarget();

    private setupBoard(): void {
        for (let i = 0; i < this.boardSize.x; i++) {
            this.grid[i] = [];

            for (let j = 0; j < this.boardSize.y; j++) {
                this.grid[i][j] = null;
            }
        }
    }

    private fillBoard(isInitial: boolean = false): void {
        for(let x = 0; x < this.boardSize.x; x++) {
            for (let y = 0; this.boardSize.y; y++) {
                if (this.grid[x][y] != null) {
                    continue;
                }

                let regularItem = this.regularItemFactory.createRegularItem();

                if (!regularItem) {
                    cc.error("Created regular item is null");
                    return;
                }

                let itemDesc = this.boardFillController.getRandomRegularItemDesc();
                regularItem.init(itemDesc);

                this.gridHolder.addChild(regularItem.node);
                let position: cc.Vec3 = cc.v3(x * this.itemsOffset.x + this.itemsScreenOffset.x, y * this.itemsOffset.y + this.itemsScreenOffset.y, 0);
                regularItem.node.setPosition(position);

                this.eventTarget.on(BaseBoardItemEvents.ON_CLICK, this.handleItemClicked);

                this.grid[x][y] = regularItem;
            }
        }
    }

    private removeItem(item: BaseBoardItem): void {
        if (item == null) {
            cc.error("Item is null");
            return;
        }

        let itemId = item.getId();
        this.grid[itemId.x][itemId.y] = null;

        this.regularItemFactory.returnItem(item);
    }

    private handleItemClicked(itemId: cc.Vec2): void {
        console.log("Input event handled");
        this.removeItem(this.grid[itemId.x][itemId.y])
    }

    // Public region
    public init(sizeX: number, sizeY: number): void {
        this.boardSize = cc.v2(sizeX, sizeY);
        this.setupBoard();
        this.fillBoard(true);
    }
}
