import SpecialBoardItemDesc from "../../Descs/SpecialBoardItemDesc";
import BaseBoardItem from "../../Entities/BoardItems/BaseBoardItem";
import SpecialBoardItem from "../../Entities/BoardItems/SpecialBoardItem";
import { BoardEntitiesTypes, SpecialItemsAbilityTypes } from "../../Globals/GlobalConstants";
import BoardDestroyController from "./BoardDestroyController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoardSpecialItemsController extends cc.Component {
    // Editor region
    @property(BoardDestroyController)
    private boardDestroyController: BoardDestroyController = null;

    @property({type: [SpecialBoardItemDesc]})
    private specialItemsDescs: SpecialBoardItemDesc[] = [];

    // Private region
    private clearItemsInRow(id: cc.Vec2): void {
        this.boardDestroyController.destroyItemsInRow(id);
    }

    private clearItemsInLine(id: cc.Vec2): void {

    }

    private clearItemsInRadius(id: cc.Vec2, radius: number): void {

    }

    private clearAllItem(): void {

    }

    // Protected region
    protected onLoad(): void {
        if (this.specialItemsDescs.length == 0) {
            return;
        }

        this.specialItemsDescs.sort(
            (a: SpecialBoardItemDesc, b:SpecialBoardItemDesc): number => {
                return b.getItemsAmountForSpawn() - a.getItemsAmountForSpawn();
            });
    }

    // Public region
    public activateSpecialItemAbility(item: BaseBoardItem): void {
        if (item == null) {
            return;
        }
        
        if (item.getEntityType() != BoardEntitiesTypes.SPECIAL_ITEM) {
            return;
        }

        const specialItem = item as SpecialBoardItem;
        const abilityType = specialItem.getAbilityType();

        switch(abilityType) {
            case SpecialItemsAbilityTypes.CLEAR_ITEMS_IN_ROW:
                this.clearItemsInRow(specialItem.getId());
                break;
            case SpecialItemsAbilityTypes.CLEAR_ITEMS_IN_LINE:
                this.clearItemsInLine(specialItem.getId());
                break;
            case SpecialItemsAbilityTypes.CLEAR_ITEMS_IN_RADIUS:
                this.clearItemsInRadius(specialItem.getId(), 1);
                break;
            case SpecialItemsAbilityTypes.CLEAR_ALL_ITEMS:
                this.clearAllItem();
                break;
            default:
                cc.error("Unknown ability type");
        }
    }

    public getSpecialItemDescByAmount(amount: number): SpecialBoardItemDesc {
        if (amount <= 0) {
            return null;
        }

        const desc = this.specialItemsDescs.find(item => item.getItemsAmountForSpawn()  <= amount);
        return desc;
    }
}
