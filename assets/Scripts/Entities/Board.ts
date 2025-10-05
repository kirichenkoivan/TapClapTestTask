import BoardDestroyController, { BoardDestroyControllerEvents, IBoardDestroyControllerConfig } from "../Controllers/BoardControllers/BoardDestroyController";
import BoardFillController, { IBoardFillControllerConfig } from "../Controllers/BoardControllers/BoardFillController";
import BoardItemsMoveController, { IBoardItemsMoveControllerConfig } from "../Controllers/BoardControllers/BoardItemsMoveController";
import BoardSpecialItemsController from "../Controllers/BoardControllers/BoardSpecialItemsController";
import BaseBoardItem from "./BoardItems/BaseBoardItem";

const {ccclass, property} = cc._decorator;

export class BoardEvents {
    static ON_MOVE: string = "BOARD_ON_MOVE";
    static ON_NO_AVAILABLE_MATCHES: string = "BOARD_ON_NO_AVAILABLE_MATCHES";
}

export interface IBoardConfig {
    gridSize: cc.Vec2;
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

    @property(BoardSpecialItemsController)
    private boardSpecialItemsController: BoardSpecialItemsController = null

    @property(cc.Vec2) 
    private itemsOffset: cc.Vec2 = cc.v2(100, 100);
    
    @property(cc.Vec2)
    private itemsScreenOffset: cc.Vec2 = cc.v2(150, -900);

    // Private region
    private gridSize: cc.Vec2 = cc.v2(2,2);
    private grid: BaseBoardItem[][] = [];
    private eventTarget: cc.EventTarget = new cc.EventTarget();
    private isItemsFalling: boolean = false;
    private maxBoardRefreshCount: number = 0;
    private currentBoardRefreshCount: number = 0;

    private tryFillBoard(): void {
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

    private handleItemClicked = (itemId: cc.Vec2): void => {
        if (this.isItemsFalling) {
            return;
        }

        this.boardDestroyController.tryDestroyItemsGroup(itemId);
    }

    private handleItemGroupDestroyed = async (groupSize: number, id: cc.Vec2, isBySpecialItem: boolean): Promise<void> => {
        if (this.isItemsFalling) {
            return;
        }

        this.isItemsFalling = true;

        if (groupSize > 0) {
            if (!isBySpecialItem) {
                const specialItemDesc = this.boardSpecialItemsController.getSpecialItemDescByAmount(groupSize);

                if (specialItemDesc != null) {
                    this.boardFillController.createSpecialItem(specialItemDesc, id);
                }
            }

            await this.boardItemsMoveController.dropDownItems();
            this.tryFillBoard();

            this.eventTarget.emit(BoardEvents.ON_MOVE, groupSize);  
        }  

        this.isItemsFalling = false;
    }

    // Public region
    public init(config: IBoardConfig): void {
        this.gridSize = config.gridSize;
        this.maxBoardRefreshCount = config.minItemGroupSize;

        const boardFillControllerConfig: IBoardFillControllerConfig = {
            grid: this.grid,
            gridSize: this.gridSize,
            itemsOffset: this.itemsOffset,
            itemsScreenOffset: this.itemsScreenOffset
        }

        this.boardFillController.init(boardFillControllerConfig);
        this.boardFillController.setRegularItemClickCb(this.handleItemClicked);

        const boardDestroyControllerConfig: IBoardDestroyControllerConfig = {
            grid: this.grid,
            gridSize: this.gridSize,
            minItemsGroupSize: config.minItemGroupSize
        }

        this.boardDestroyController.init(boardDestroyControllerConfig);
        this.boardDestroyController.getEventTarget().on(BoardDestroyControllerEvents.ON_ITEMS_GROUP_DESTROYED, this.handleItemGroupDestroyed, this);

        const boardItemsMoveControllerConfig: IBoardItemsMoveControllerConfig = {
            grid: this.grid,
            gridSize: this.gridSize,
            itemsOffset: this.itemsOffset,
            itemsScreenOffset: this.itemsScreenOffset
        }

        this.boardItemsMoveController.init(boardItemsMoveControllerConfig);

        this.boardFillController.cleanBoard(true);
        this.tryFillBoard();
    }

    public getEventTarget(): cc.EventTarget {
        return this.eventTarget;
    }
}
