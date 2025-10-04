const {ccclass, property} = cc._decorator;

export class MovesControllerEvents {
    static ON_NO_MOVES_LEFT: string = "MOVES_CONTROLLER_NO_MOVES_LEFT";
}

@ccclass
export default class MovesController extends cc.Component {
    // Edtior region
    @property(cc.Label)
    private movesLabel: cc.Label = null;

    // Private region
    private eventTarget: cc.EventTarget = new cc.EventTarget();
    private allowedMoves: number = 0;

    private updateMovesLabel(): void {
        this.movesLabel.string = String(this.allowedMoves);
    }

    // Public region
    public init(movesCount: number): void {
        this.allowedMoves = movesCount;
        this.updateMovesLabel();
    }

    public getEventTarget(): cc.EventTarget {
        return this.eventTarget;
    }

    public decreseMovesCount(): void {
        this.allowedMoves--;
        this.updateMovesLabel();

        if (this.allowedMoves <= 0) {
            this.eventTarget.emit(MovesControllerEvents.ON_NO_MOVES_LEFT);
        }
    }

    public getRestMoves(): number {
        return this.allowedMoves;
    }
}
