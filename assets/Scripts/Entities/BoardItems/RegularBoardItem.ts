import BaseBoardItem from "./BaseBoardItem";
import { BoardEntitiesTypes, STR_NONE_TYPE } from "../../Globals/GlobalConstants";
import BaseBoardItemDesc from "../../Descs/BaseBoardItemDesc";
import RegularItemDesc from "../../Descs/RegularItemDesc";

const {ccclass} = cc._decorator;

@ccclass
export default class RegularBoardItem extends BaseBoardItem {
    // Private region
    private regularType: string = STR_NONE_TYPE;

    // Public region
    public init(desc: BaseBoardItemDesc): void {
        if (!desc) {
            console.error("Regular item desc is null");
            return;
        }

        let regularItemDesc =  desc as RegularItemDesc;
        this.regularType = regularItemDesc.getType();
        this.setSpriteFrame(regularItemDesc.getSpriteFrame());
    }

    public getEntityType(): BoardEntitiesTypes {
        return BoardEntitiesTypes.REGULAR_ITEM;
    }

    public setRegularType(regularType: string): void {
        this.regularType = regularType;
    }

    public getRegularType(): string {
        return this.regularType;
    }
}
