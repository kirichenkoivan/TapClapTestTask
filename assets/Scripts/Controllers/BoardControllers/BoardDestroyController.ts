import BaseBoardItem from "../../Entities/BoardItems/BaseBoardItem";
import RegularBoardItem from "../../Entities/BoardItems/RegularBoardItem";
import { BoardEntitiesTypes } from "../../Globals/Globals";
import BoardSpecialItemsController from "./BoardSpecialItemsController";

const {ccclass, property} = cc._decorator;
const directions: cc.Vec2[] = [cc.v2(0,-1), cc.v2(0,1), cc.v2(-1,0), cc.v2(1,0)];

export class BoardDestroyControllerEvents {
    static ON_ITEMS_GROUP_DESTROYED: string = "BOARD_DESTROY_CONTROLLER_ITEMS_GROUP_DESTROYED";
}

export interface IBoardDestroyControllerConfig {
    grid: BaseBoardItem[][],
    gridSize: cc.Vec2,
    minItemsGroupSize: number
}

@ccclass
export default class BoardDestroyController extends cc.Component {    
    // Editor region
    @property(BoardSpecialItemsController)
    private boardSpecialItemsController: BoardSpecialItemsController = null;

    // Private region
    private minItemsGroupSize: number = 2;
    private grid: BaseBoardItem[][] = null;
    private gridSize: cc.Vec2 = cc.v2(0,0);
    private eventTarget: cc.EventTarget = new cc.EventTarget();

    private isSafeId(id: cc.Vec2): boolean {
        return id.x < this.gridSize.x && id.x >= 0 && id.y < this.gridSize.y && id.y >= 0;
    }

    private resetItemsChecked(): void {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (this.grid[x][y] == null) {
                    continue;
                } 

                this.grid[x][y].setChecked(false);
            }
        }
    }

    private getNeighbors(id: cc.Vec2): BaseBoardItem[] {
        let stack: cc.Vec2[] = [];
        let neighbors: BaseBoardItem[] = [];

        const startItem = this.grid[id.x][id.y];
        
        if (startItem.getEntityType() != BoardEntitiesTypes.REGULAR_ITEM) {
            return [startItem];
        }

        stack.push(id);
        startItem.setChecked(true);

        let type = (startItem as RegularBoardItem).getRegularType();

        while(stack.length > 0) {
            const pos = stack.pop();

            neighbors.push(this.grid[pos.x][pos.y]);

            for(let i = 0; i < directions.length; i++) {
                let nx = pos.x + directions[i].x;
                let ny = pos.y + directions[i].y;

                if (!this.isSafeId(cc.v2(nx, ny))) {
                    continue;
                }

                const item = this.grid[nx][ny];

                if (!item || item.getChecked() || item.getEntityType() != BoardEntitiesTypes.REGULAR_ITEM) {
                    continue;
                }

                const regularItem = item as RegularBoardItem;

                regularItem.setChecked(true);

                if (regularItem.getRegularType() != type) {
                    continue;
                }

                stack.push(cc.v2(nx, ny));
            }
        }

        return neighbors;
    }

    // Public region
    public init(config: IBoardDestroyControllerConfig): void {
        this.grid = config.grid;
        this.gridSize = config.gridSize;
        this.minItemsGroupSize = config.minItemsGroupSize;
    }

    public getEventTarget(): cc.EventTarget {
        return this.eventTarget;
    }

    public tryDestroyItemsGroup(id: cc.Vec2): void {
        const item = this.grid[id.x][id.y];

        if (item.getEntityType() == BoardEntitiesTypes.SPECIAL_ITEM) {
            this.boardSpecialItemsController.activateSpecialItemAbility(item);
            return;
        }

        const group = this.getNeighbors(id);

        if (group.length < this.minItemsGroupSize) {
            this.resetItemsChecked();
            return;
        }

        for (let i = 0; i < group.length; i++) {
            let id: cc.Vec2 = group[i].getId();
            group[i].fireWantToRemove();
            this.grid[id.x][id.y] = null;
        }

        this.resetItemsChecked();
        this.eventTarget.emit(BoardDestroyControllerEvents.ON_ITEMS_GROUP_DESTROYED, group.length, id, false);
    }

    public hasAnyMatch(): boolean {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                const group = this.getNeighbors(cc.v2(x,y));

                if (group.length >= this.minItemsGroupSize) {
                    this.resetItemsChecked();
                    return true;
                }
            }
        }

        this.resetItemsChecked();
        return false;
    }

    public destroyItemsInRow(id: cc.Vec2): void {
        for(let y = 0; y < this.gridSize.y; y++) {
            if (this.grid[id.x][y] == null) {
                continue;
            }

            this.grid[id.x][y].fireWantToRemove();
            this.grid[id.x][y] = null;
        }

        this.eventTarget.emit(BoardDestroyControllerEvents.ON_ITEMS_GROUP_DESTROYED, this.gridSize.y, id, true);
    }

    public destroyItemsInLine(id: cc.Vec2): void {
        for (let x = 0; x < this.gridSize.x; x++) {
            if (this.grid[x][id.y] == null) {
                continue;
            }

            this.grid[x][id.y].fireWantToRemove();
            this.grid[x][id.y] = null;
        }

        this.eventTarget.emit(BoardDestroyControllerEvents.ON_ITEMS_GROUP_DESTROYED, this.gridSize.x, id, true);
    }

    public destroyItemsInRadius(id: cc.Vec2, radius: number): void {
        let group: BaseBoardItem[] = [];

        for(let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                if (Math.max(Math.abs(x), Math.abs(y)) > radius) {
                    continue; 
                }

                const nx = id.x + x;
                const ny = id.y + y;

                if (!this.isSafeId(cc.v2(nx, ny))) {
                    continue;
                }

                group.push(this.grid[nx][ny]);
                this.grid[nx][ny] = null;
            }
        }

        for (let i = 0; i < group.length; i++) {
            group[i].fireWantToRemove();
        }

        this.eventTarget.emit(BoardDestroyControllerEvents.ON_ITEMS_GROUP_DESTROYED, group.length, id, true);
    }

    public destroyAllItems(id: cc.Vec2): void {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (this.grid[x][y] == null) {
                    continue;
                }

                this.grid[x][y].fireWantToRemove();
                this.grid[x][y] = null;
            }
        }

        this.eventTarget.emit(BoardDestroyControllerEvents.ON_ITEMS_GROUP_DESTROYED, this.gridSize.x * this.gridSize.y, id, true);
    }
}
