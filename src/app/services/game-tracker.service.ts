import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldOccupation } from '../model/field-occupation.model';
import { PiecePositionUpdate } from '../model/piece-position-update.model';
import { Piece } from '../model/piece.model';
import { GameControlService } from './game-control.service';

@Injectable({
  providedIn: 'root'
})
export class GameTrackerService {

  private unknownPiece = "X_X"
  captures: String[] = []

  positions = new Map<String, String>()

  constructor(private gameControlService: GameControlService) {
    this.init()
  }

  init(): void {
    // TODO learn about ngrx and observables and subjects and do it better
    this.subscribeToFieldOccupationUpdates();
    this.subscribeToPiecePositionUpdates();
  }

  private subscribeToFieldOccupationUpdates() {
    this.gameControlService.getPiecePositionsSubscription().subscribe((piecePositions: FieldOccupation[]) => {
      for (let i = 0; i < piecePositions.length; i++) {
        this.positions.set(piecePositions[i].field, this.getTokenFor(piecePositions[i].piece));
      }
    });
  }

  private subscribeToPiecePositionUpdates() {
    this.gameControlService.getPiecePositionUpdatesSubscription().subscribe((update: PiecePositionUpdate) => {
      if (!update.reverted) {
        this.handleMove(update);
      } else {
        this.handleMoveReverted(update);
      }
    });
  }

  private handleMove(update: PiecePositionUpdate) {
    let piece = this.positions.get(update.primaryMove.from);
    this.positions.delete(update.primaryMove.from);
    this.positions.set(update.primaryMove.to, piece || this.unknownPiece);

    if (update.secondaryMove) {
      let piece = this.positions.get(update.secondaryMove.from);
      this.positions.delete(update.secondaryMove.from);
      this.positions.set(update.secondaryMove.to, piece || this.unknownPiece);
    }

    if (update.pieceCapture) {
      this.captures.push(this.getTokenFor(update.pieceCapture.capturedPiece))
    }
  }

  private handleMoveReverted(update: PiecePositionUpdate) {
    let piece = this.positions.get(update.primaryMove.to);
    this.positions.delete(update.primaryMove.to);
    this.positions.set(update.primaryMove.from, piece || this.unknownPiece);

    if (update.secondaryMove) {
      let piece = this.positions.get(update.secondaryMove.to);
      this.positions.delete(update.secondaryMove.to);
      this.positions.set(update.secondaryMove.from, piece || this.unknownPiece);
    }

    if (update.pieceCapture) {
      this.captures.pop()
    }
  }

  private getTokenFor(piece: Piece): String {
    if (piece == null) {
      return "";
    }

    let token = "";
    token += this.getTokenForColor(piece.color);
    token += "_";
    token += this.getTokenForType(piece.type);
    return token;
  }

  private getTokenForColor(color: String): String {
    if (color === 'WHITE') {
      return "W"
    } else {
      return "B"
    }
  }

  private getTokenForType(type: String): String {
    switch (type) {
      case "KING": {
        return "K"
      }
      case "QUEEN": {
        return "Q"
      }
      case "KNIGHT": {
        return "N"
      }
      case "BISHOP": {
        return "B"
      }
      case "ROOK": {
        return "R"
      }
      case "PAWN": {
        return "P"
      }
      default: {
        return ""
      }
    }
  }
}
