import BoardDestroyController from "../Controllers/BoardControllers/BoardDestroyController";
import BoardFillController from "../Controllers/BoardControllers/BoardFillController";
import BoardItemsMoveController from "../Controllers/BoardControllers/BoardItemsMoveController";
import BaseBoardItem from "./BoardItems/BaseBoardItem";

const {ccclass, property} = cc._decorator;

export class BoardEvents {
    static ON_MOVE: string = "BOARD_ON_MOVE";
    static ON_NO_AVAILABLE_MATCHES: string = "BOARD_ON_NO_AVAILABLE_MATCHES";
}

export interface IBoardConfig {
    boardSize: cc.Vec2;
    minItemGroupSize: number;
    maxBoardRefreshCount: number;
}

@ccclass
export default class Board extends cc.Component {
    // Editor region
    @property(BoardFillController)
    private boardFillController: BoardFillController = null;

    @property(BoardDestroyController)
    private boardDestroyController: BoardDestroyController = null;

    @property(BoardItemsMoveController)
    private boardItemsMoveController: BoardItemsMoveController = null;

    @property(cc.Vec2) 
    private itemsOffset: cc.Vec2 = cc.v2(100, 100);
    
    @property(cc.Vec2)
    private itemsScreenOffset: cc.Vec2 = cc.v2(150, -900);

    // Private region
    private boardSize: cc.Vec2 = cc.v2(2,2);
    private grid: BaseBoardItem[][] = [];
    private eventTarget: cc.EventTarget = new cc.EventTarget();
    private isItemsFalling: boolean = false;
    private maxBoardRefreshCount: number = 0;
    private currentBoardRefreshCount: number = 0;

    private tryFillBoard(isInitial: boolean = false): void {
        while(this.currentBoardRefreshCount <= this.maxBoardRefreshCount) {
            this.boardFillController.fillBoard();

            if (this.boardDestroyController.hasAnyMatch()) {
                return;
            }

            this.boardFillController.cleanBoard();
            this.currentBoardRefreshCount++;
        }

        this.eventTarget.emit(BoardEvents.ON_NO_AVAILABLE_MATCHES);
    }

    private handleItemClicked = async (itemId: cc.Vec2): Promise<void> => {
        if (this.isItemsFalling) {
            return;
        }

        this.isItemsFalling = true;
        const destroyedGroupSize = this.boardDestroyController.tryDestroyItemsGroup(itemId);

        if (destroyedGroupSize > 0) {
            await this.boardItemsMoveController.dropDownItems();
            this.tryFillBoard();

            this.eventTarget.emit(BoardEvents.ON_MOVE, destroyedGroupSize);  
        }

        this.isItemsFalling = false;
    }

    // Public region
    public init(config: IBoardConfig): void {
        this.boardSize = config.boardSize;
        this.maxBoardRefreshCount = config.minItemGroupSize;

        this.boardFillController.init(this.grid, this.boardSize, this.itemsOffset, this.itemsScreenOffset);
        this.boardFillController.setRegularItemClickCb(this.handleItemClicked);

        this.boardDestroyController.init(this.grid, this.boardSize, config.minItemGroupSize);
        this.boardItemsMoveController.init(this.grid, this.boardSize, this.itemsOffset, this.itemsScreenOffset);

        this.boardFillController.cleanBoard(true);
        this.tryFillBoard(true);
    }

    public getEventTarget(): cc.EventTarget {
        return this.eventTarget;
    }
}
