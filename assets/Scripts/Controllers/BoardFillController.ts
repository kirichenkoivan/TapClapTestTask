import RegularItemDesc from "../Descs/RegularItemDesc";
import { randomInt } from "../Globals/GlobalConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoardFillController extends cc.Component {
    // Editor region
    @property([RegularItemDesc])
    private regularItemsDescs: RegularItemDesc[] = [];

    // Private region

    // Public region
    public getRandomRegularItemDesc(): RegularItemDesc {
        if (this.regularItemsDescs.length == 0) {
            return null;
        }
        let rndId = randomInt(0, this.regularItemsDescs.length - 1);
        return this.regularItemsDescs[rndId];
    }
}
