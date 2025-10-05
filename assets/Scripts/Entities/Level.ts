import MovesController, { MovesControllerEvents } from "../Controllers/ScoreControllers/MovesController";
import ScoreController, { ScoreControllerEvents } from "../Controllers/ScoreControllers/ScoreController";
import FinishGamePopupUiController from "../Controllers/UiControllers/FinishGameUiController";
import Board, { BoardEvents, IBoardConfig } from "./Board";

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

    @property({
        type: cc.Integer,
        min: 1, 
        max: 10
    })
    private allowedBoardRefreshesCount: number = 1; 

    // Private region
    private subscribeEvents(): void {
        this.board.getEventTarget().on(BoardEvents.ON_MOVE, this.handleMove);
        this.board.getEventTarget().on(BoardEvents.ON_NO_AVAILABLE_MATCHES, () => {this.handleFinishGame(false)});
        this.movesController.getEventTarget().on(MovesControllerEvents.ON_NO_MOVES_LEFT, () => {this.handleFinishGame(false)});
        this.scoreController.getEventTarget().on(ScoreControllerEvents.ON_SCORE_SUCCESS, () => {this.handleFinishGame(true)});
    }

    private handleFinishGame(isWin: boolean): void {
        this.finishGamePopup.init(isWin);
        this.finishGamePopup.node.active = true;
    }

    private handleMove = (groupSize: number): void => {
        this.scoreController.updateScore(groupSize);
        this.movesController.decreaseMovesCount();
    }

    // Protected region
    protected onLoad(): void {
        if (!this.board) {
            console.error("Board component is null");
            return;
        }

        if (!this.movesController) {
            console.error("MovesController component is null");
            return;
        }

        if (!this.scoreController) {
            console.error("ScoreController component is null");
            return;
        }
        
        let boardConfig: IBoardConfig = {
            boardSize: cc.v2(this.boardSizeX, this.boardSizeY),
            maxBoardRefreshCount: this.allowedBoardRefreshesCount,
            minItemGroupSize: this.minItemsGroupSize
        };

        this.board.init(boardConfig);
        this.movesController.init(this.allowedMoves);
        this.scoreController.init(this.requiredScore, this.scoreMultiplier);
        this.subscribeEvents();
    }
}
