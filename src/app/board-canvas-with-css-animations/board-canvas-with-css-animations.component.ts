import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawingService } from '../board-canvas/drawing.service';
import { FieldUtilsService } from '../board-canvas/field-utils.service';
import { PiecesLocations } from '../board-canvas/pieces-locations';
import { BoardSetup } from './board-setup';
import { CoordinationsUtil } from './coordinations-utils';
import { HtmlPieceReneder } from './html-piece-renderer';
import { PieceDragHandler } from './piece-drag-handler';
import { Piece } from './piece.model';
import { Pieces } from './pieces';

@Component({
  selector: 'app-board-canvas-with-css-animations',
  templateUrl: './board-canvas-with-css-animations.component.html',
  styleUrls: ['./board-canvas-with-css-animations.component.css']
})
export class BoardCanvasWithCssAnimationsComponent implements OnInit {

  constructor(
    private drawingService: DrawingService, 
    private locationUtilsService: FieldUtilsService,
    private renderer: Renderer2,
    private fieldUtils: FieldUtilsService) { }

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef;

  canvasContext: CanvasRenderingContext2D;

  @ViewChild('boardcontainer', { static: true }) 
  boardContainer: ElementRef<HTMLCanvasElement>;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  canvasSize: number;
  private fieldColorLight = "#D2C3C3";
  private fieldColorDark = "#75352B";
  private boardFlipped = false;
  private boardSetup: BoardSetup;

  readyForDrawing = false
  
  private htmlPieceRender: HtmlPieceReneder

  private pieces = new Pieces()
  private piecesLocations = new PiecesLocations()
  private dragHandler: PieceDragHandler;

  ngOnInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.boardSetup = new BoardSetup(false, window.outerHeight)
    this.canvasSize = this.boardSetup.boardSize
    this.locationUtilsService.initialize(this.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
    this.dragHandler = new PieceDragHandler(this.fieldUtils, this.boardSetup, this.piecesLocations, this.htmlPieceRender)
    
    this.pieces.initialize()

    this.piecesLocations.set("h8", this.pieces.whiteBishop)
    this.piecesLocations.set("a2", this.pieces.blackBishop)

    this.renderPieces()
    this.testPieceMovement()

    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      let leftClick = 0; // todo check other OSes
      if (e.button == leftClick) {
        const {x, y} = this.getEventLocationOnBoard(e)
        this.dragHandler.notifyMouseDownOnPieceEvent(x, y)
      }
    })

    window.addEventListener('mouseup', (e: MouseEvent) => {
      const {x, y} = this.getEventLocationOnBoard(e)
      this.dragHandler.notifyMouseUpEvent(x, y)
    })

    window.addEventListener('mousemove', (e: MouseEvent) => {
      const {x, y} = this.getEventLocationOnBoard(e)
      this.dragHandler.notifyMouseMove(x, y)
    })

    window.requestAnimationFrame(this.drawEverything.bind(this));
  }

  renderPieces() {
    this.piecesLocations.getAll().forEach((piece, field) => {
        this.htmlPieceRender.renderPieceAtField(field, piece)
        piece.setMouseDownListener(this.notifyPieceClicked.bind(this))
    })
  }

  notifyPieceClicked(e: MouseEvent, piece: Piece) {
      let leftClick = 0; // todo check other OSes
      if (e.button == leftClick) {
        const {x, y} = this.getEventLocationOnBoard(e)
        this.dragHandler.notifyMouseDownOnPieceEvent(x, y, piece)
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.boardSetup.windowHeightUpdated(window.outerHeight)
    this.locationUtilsService.initialize(this.boardFlipped, this.boardSetup.fieldSize)
    this.htmlPieceRender = new HtmlPieceReneder(this.renderer, this.fieldUtils, this.boardContainer.nativeElement, this.boardSetup.fieldSize)
  }
  
  private testPieceMovement() {
    let from1 = "a2"
    let to1 = "h2"

    let from2 = "h8"
    let to2 = "a1"
    setInterval(() => {
      const piece1 = this.piecesLocations.get(from1)
      if(piece1) {
        this.piecesLocations.delete(from1)
        this.htmlPieceRender.renderPieceMovement(to1, piece1)
        this.piecesLocations.set(to1, piece1)
        let tmp = from1
        from1 = to1
        to1 = tmp
      }

      const piece2 = this.piecesLocations.get(from2)
      if(piece2) {
        this.piecesLocations.delete(from2)
        this.htmlPieceRender.renderPieceMovement(to2, piece2)
        this.piecesLocations.set(to2, piece2)
        let tmp = from2
        from2 = to2
        to2 = tmp
      }
    }, 3000)
  }

  private getEventLocationOnBoard(e: MouseEvent): { x: number; y: number; } {
    return CoordinationsUtil.convertAbsoluteToBoardRelativeCoords(e.x, e.y, this.boardContainer);
  }
  
  private drawEverything() {
    this.drawBackground();
    window.requestAnimationFrame(this.drawEverything.bind(this))
  }

  private drawBackground() {
    
    let currentColor = this.fieldColorLight;
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        let colPos = col * this.boardSetup.fieldSize;
        let rowPos = row * this.boardSetup.fieldSize;
        this.drawingService.fillRectangle(this.canvasContext, colPos, rowPos, this.boardSetup.fieldSize, this.boardSetup.fieldSize, currentColor)

        if (col == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineRowAtPos(rowPos, this.boardSetup.fieldSize),
            this.oppositeOf(currentColor),
            colPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.1,
            rowPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.85,
            Math.floor(this.boardSetup.fieldSize / 6));
        }
        if (row == 7) {
          this.drawingService.fillText(
            this.canvasContext,
            this.locationUtilsService.determineColAtPos(colPos, this.boardSetup.fieldSize),
            this.oppositeOf(currentColor),
            colPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.95,
            rowPos + this.boardSetup.fieldSize - this.boardSetup.fieldSize * 0.05,
            Math.floor(this.boardSetup.fieldSize / 6));
        }
        currentColor = this.oppositeOf(currentColor)
      }
      currentColor = this.oppositeOf(currentColor)
    }
  }

  private oppositeOf(color: string): string {
    if (color == this.fieldColorLight) {
      return this.fieldColorDark
    } else {
      return this.fieldColorLight
    }
  }
}
