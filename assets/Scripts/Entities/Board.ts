import BoardFillController from "../Controllers/BoardFillController";
import RegularItemFactory from "../Factories/RegularItemFactory";
import BaseBoardItem from "./BoardItems/BaseBoardItem";

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

    private setupBoard(): void {
        for (let i = 0; i < this.boardSize.x; i++) {
            this.grid[i] = [];

            for (let j = 0; j < this.boardSize.y; j++) {
                this.grid[i][j] = null;
            }
        }
    }

    private fillBoard(isInitial: boolean = false): void {
        if (isInitial) {
            for (let i = 0; i < this.boardSize.x; i++) {
                for (let j = 0; j < this.boardSize.y; j++) {
                    let regularItem = this.regularItemFactory.createRegularItem();

                    if (!regularItem) {
                        console.error("Regular item is null");
                        return;
                    }

                    this.gridHolder.addChild(regularItem.node);
                    let position = cc.v3(i * this.itemsOffset.x + this.itemsScreenOffset.x, j * this.itemsOffset.y + this.itemsScreenOffset.y, 0);
                    regularItem.node.setPosition(position);
                    let desc = this.boardFillController.getRandomRegularItemDesc(); 
                    this.grid[i][j] = regularItem;
                    this.grid[i][j].init(desc);
                }
            }
        }
    }

    // Public region
    public init(sizeX: number, sizeY: number): void {
        this.boardSize = cc.v2(sizeX, sizeY);
        this.setupBoard();
        this.fillBoard(true);
    }
}
