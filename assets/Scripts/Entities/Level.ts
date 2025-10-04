import MovesController, { MovesControllerEvents } from "../Controllers/ScoreControllers/MovesController";
import ScoreController, { ScoreControllerEvents } from "../Controllers/ScoreControllers/ScoreController";
import FinishGamePopupUiController from "../Controllers/UiControllers/FinishGameUiController";
import Board, { BoardEvents } from "./Board";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    // Editor region
    @property(Board)
    private board: Board = null;

    @property(MovesController)
    private movesController: MovesController = null;

    @property(ScoreController)
    private scoreController: ScoreController = null;

    @property(FinishGamePopupUiController)
    private finishGamePopup: FinishGamePopupUiController = null;

    @property({
        type: cc.Integer,
        min: 2,
        max: 10
    })
    private boardSizeX: number = 2;

    @property({
        type: cc.Integer,
        min: 2,
        max: 10
    })
    private boardSizeY: number = 2;

    @property({
        type: cc.Integer,
        min: 1,
        max: 10
    })
    private minItemsGroupSize: number = 2;

    @property({
        type: cc.Integer,
        min: 1,
        max: 100
    })
    private allowedMoves: number = 1;

    @property({
        type: cc.Integer,
        min: 1,
        max: 1000
    })
    private requiredScore: number = 1;

    @property({
        min: 1.0,
        max: 10.0
    })
    private scoreMultiplier: number = 1.0;

    // Private region
    private subsriveEvents(): void {
        this.board.getEventTarget().on(BoardEvents.ON_MOVE, this.handleMove);
        this.movesController.getEventTarget().on(MovesControllerEvents.ON_NO_MOVES_LEFT, () => {this.handleFinishGame(false)});
        this.scoreController.getEventTarget().on(ScoreControllerEvents.ON_SCORE_SUCCESS, () => {this.handleFinishGame(true)});
    }

    private handleFinishGame(isWin: boolean): void {
        this.finishGamePopup.init(isWin);
        this.finishGamePopup.node.active = true;
    }

    private handleMove = (groupSize: number): void => {
        this.scoreController.updateScore(groupSize);
        this.movesController.decreseMovesCount();
    }

    // Protected region
    protected onLoad(): void {
        if (!this.board) {
            console.error("Board component is null");
            return;
        }
        
        this.board.init(this.boardSizeX, this.boardSizeY, this.minItemsGroupSize);
        this.movesController.init(this.allowedMoves);
        this.scoreController.init(this.requiredScore, this.scoreMultiplier);
        this.subsriveEvents();
    }
}
