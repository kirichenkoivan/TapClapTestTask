import BaseBoardItem from "../../Entities/BoardItems/BaseBoardItem";
import RegularBoardItem from "../../Entities/BoardItems/RegularBoardItem";
import { BoardEntitiesTypes } from "../../Globals/GlobalConstants";

const {ccclass} = cc._decorator;
const directions: cc.Vec2[] = [cc.v2(0,-1), cc.v2(0,1), cc.v2(-1,0), cc.v2(1,0)];

@ccclass
export default class BoardDestroyController extends cc.Component {    
    // Private region
    private minItemsGroupSize: number = 2;
    private grid: BaseBoardItem[][] = null;
    private gridSize: cc.Vec2 = cc.v2(0,0);

    private isSafeId(id: cc.Vec2): boolean {
        return id.x < this.gridSize.x && id.x >= 0 && id.y < this.gridSize.y && id.y >= 0;
    }

    private resetItemsCheched(): void {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (this.grid[x][y] == null) {
                    continue;
                } 

                this.grid[x][y].setChecked(false);
            }
        }
    }

    private getNeighbors( id: cc.Vec2): BaseBoardItem[] {
        let stack: cc.Vec2[] = [];
        let nedighbours: BaseBoardItem[] = [];

        const startItem = this.grid[id.x][id.y];
        
        if (!(startItem instanceof RegularBoardItem)) {
            return [startItem];
        }

        stack.push(id);
        startItem.setChecked(true);

        let type = startItem.getRegularType();

        while(stack.length > 0) {
            const pos = stack.pop();

            nedighbours.push(this.grid[pos.x][pos.y]);

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

        return nedighbours;
    }

    // Public region
    public init(grid: BaseBoardItem[][], size: cc.Vec2, minItemsGroupSize: number): void {
        this.grid = grid;
        this.gridSize = size;
        this.minItemsGroupSize = minItemsGroupSize;
    }

    public tryDestroyItemsGroup(id: cc.Vec2): number {
        const group = this.getNeighbors(id);

        if (group.length < this.minItemsGroupSize) {
            this.resetItemsCheched();
            return 0;
        }

        for (let i = 0; i < group.length; i++) {
            let id: cc.Vec2 = group[i].getId();
            group[i].fireWantToRemove();
            this.grid[id.x][id.y] = null;
        }

        this.resetItemsCheched();
        return group.length;
    }

    public hasAnyMatch(): boolean {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                const type = this.grid[x][y];
                const group = this.getNeighbors(cc.v2(x,y));

                if (group.length >= this.minItemsGroupSize) {
                    this.resetItemsCheched();
                    return true;
                }
            }
        }

        return false;
    }
}
