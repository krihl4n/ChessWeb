import { PAWN } from "src/app/model/typings";
import { BoardSetup } from "./board-setup";

export class Piece {

    imagePath: string
    htmlElement: any
    desiredHeight: number
    listener: any; // todo collection

    constructor(public color: string, public type: string, private fieldSize: number) {
        this.imagePath = `assets/${color}_${type}.svg`
        this.setDesiredHeight()
    }

    setHtmlElement(htmlElement: any) {
        this.htmlElement = htmlElement
        this.htmlElement.addEventListener('mousedown', (e:MouseEvent)=> {
            this.listener(e, this)
        })
    }

    setMouseDownListener(listener: any) { // todo type
        this.listener = listener
    }

    setDesiredHeight() {
        if(this.type == PAWN){
            this.desiredHeight = this.fieldSize * 0.7 
        } else {
            this.desiredHeight = this.fieldSize * 0.8 
        }
    }
}
