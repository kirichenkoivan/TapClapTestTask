import Board from "./Board";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    // Editor region
    @property(Board)
    private board: Board = null;

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

    // Private region

    onLoad(): void {
        if (!this.board) {
            console.error("Board component is null");
            return;
        }
        
        this.board.init(this.boardSizeX, this.boardSizeY);
    }

    // Public region    
}
