import BaseBoardItem from "../../Entities/BoardItems/BaseBoardItem";
const {ccclass, property} = cc._decorator;

export class BoardItemsMoveControllerEvents {
    static ON_ALL_ITEMS_DROPPED: string = "BOARD_ITEMS_MOVE_CONTROLLER_ALL_ITEMS_DROPPED";
}

@ccclass
export default class BoardItemsMoveController extends cc.Component {
    // Editor region
    @property()
    private itemsMoveSpeed: number = 0.05;

    // Private region
    private grid: BaseBoardItem[][] = null;
    private gridSize: cc.Vec2 = cc.v2(0,0);
    private itemsOffset: cc.Vec2 = cc.v2(100, 100);
    private itemsScreenOffset: cc.Vec2 = cc.v2(150, -900);
    private eventTarget: cc.EventTarget = new cc.EventTarget();
    private dropPromise: Promise<void> = null;

    private fallingItemsCount: number = 0;
    
    private getPositionFromId(id: cc.Vec2): cc.Vec2 {
        return cc.v2(id.x * this.itemsOffset.x + this.itemsScreenOffset.x, id.y * this.itemsOffset.y + this.itemsScreenOffset.y);
    }

    private handleItemsFalled = (): void => {
        this.fallingItemsCount--;

        if (this.fallingItemsCount <= 0) {
            this.eventTarget.emit(BoardItemsMoveControllerEvents.ON_ALL_ITEMS_DROPPED);
        }
    }

    // Public region
    public init(grid: BaseBoardItem[][], size: cc.Vec2, itemsOffset: cc.Vec2, itemsScreenOffset: cc.Vec2): void {
        this.grid = grid;
        this.gridSize = size;
        this.itemsOffset = itemsOffset;
        this.itemsScreenOffset = itemsScreenOffset;
    }

    public getEventTarger(): cc.EventTarget {
        return this.eventTarget;
    }

    public dropDownItems = (): Promise<void> => {
        if (this.dropPromise) {
            return this.dropPromise;
        }

        const promise = new Promise<void>((resolve) => {
            this.fallingItemsCount = 0;

            for (let x = 0; x < this.gridSize.x; x++) {
                let ny = 0;

                for (let y = 0; y < this.gridSize.y; y++) {
                    const item = this.grid[x][y];

                    if (item == null) {
                        continue;
                    }

                    if (y !== ny) {
                        const targetPos = this.getPositionFromId(cc.v2(x, ny));

                        this.grid[x][ny] = item;
                        this.grid[x][y] = null;
                        item.setId(cc.v2(x, ny));

                        this.fallingItemsCount++;

                        cc.tween(item.node)
                            .to(this.itemsMoveSpeed * (y - ny), { position: cc.v3(targetPos.x, targetPos.y, 0) })
                            .call(this.handleItemsFalled)
                            .start();
                    }

                    ny++;
                }

                for (let y = ny; y < this.gridSize.y; y++) {
                    this.grid[x][y] = null;
                }
            }

            if (this.fallingItemsCount <= 0) {
                resolve();
                return;
            }

            const handler = () => {
                this.eventTarget.off(BoardItemsMoveControllerEvents.ON_ALL_ITEMS_DROPPED, handler);
                resolve();
            };

            this.eventTarget.on(BoardItemsMoveControllerEvents.ON_ALL_ITEMS_DROPPED, handler);
        });

        this.dropPromise = promise;
        promise.then(() => {this.dropPromise = null}, () => {this.dropPromise = null;})

        return this.dropPromise;
    }
}
