const {ccclass, property} = cc._decorator;

export class ScoreControllerEvents {
    static ON_SCORE_SUCCESS: string = "SCORE_CONTROLLER_SCORE_SUCCESS";
}

@ccclass
export default class ScoreController extends cc.Component {
    // Editor region
    @property(cc.Label)
    private scoreLabel: cc.Label = null;

    // Private region
    private eventTarget: cc.EventTarget = new cc.EventTarget();
    private requiredScore: number = 0;
    private currentScore: number = 0;
    private scoreMultiplier: number = 1.0;

    private updateScoreLabel(): void {
        this.scoreLabel.string = String(this.currentScore) + "/" + String(this.requiredScore); 
    }

    // Public region
    public init(requiredScore: number, scoreMultiplier: number): void {
        this.requiredScore = requiredScore;
        this.scoreMultiplier = scoreMultiplier;

        this.updateScoreLabel();
    }

    public getEventTarget(): cc.EventTarget {
        return this.eventTarget;
    }

    public updateScore(itemsDestroyed: number): void {
        this.currentScore += itemsDestroyed * this.scoreMultiplier; 
        this.updateScoreLabel();

        if (this.currentScore >= this.requiredScore) {
            this.eventTarget.emit(ScoreControllerEvents.ON_SCORE_SUCCESS);
        }
    }
}
