const {ccclass, property} = cc._decorator;

@ccclass
export default class FinishGamePopupUiController extends cc.Component {
    // Editor region
    @property(cc.Label)
    private popupLabel: cc.Label = null;

    // Public region
    public init(isWin: boolean): void {
        if (isWin) {
            this.popupLabel.string = "Победа!";
        } else {
            this.popupLabel.string = "Проигрыш";
        }
    }

    public restartGame(): void {
        cc.director.loadScene(cc.director.getScene().name);
    }
}
