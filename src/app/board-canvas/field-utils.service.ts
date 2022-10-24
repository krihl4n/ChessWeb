import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldUtilsService {

  private fieldSize: number;
  private boardFlipped: boolean;
  
  initialize(boardFlipped: boolean, fieldSize: number) { // figure out a better way (maybe pass boardSetup object)
    this.fieldSize = fieldSize;
    this.boardFlipped = boardFlipped;
  }

  determinePieceLocationAtField(field: string, fieldSize: number) : {x: number, y: number} {
    const fieldLocation = this.determineFieldLocation(field, fieldSize)
    return {
      x: (fieldLocation.x + this.fieldSize / 2) - 50/2, // todo find piece width
      y: fieldLocation.y + this.fieldSize - 70 // todo find piece height
    }   
  }

  determineFieldLocation(field: string, fieldSize: number): {x: number, y: number} {
    const col = field.charAt(0)
    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (this.boardFlipped) {
      cols.reverse();
    }
    const x = cols.indexOf(col) * fieldSize
    
    const row = field.charAt(1)
    let rows = ['8', '7', '6', '5', '4', '3', '2', '1']
    if (this.boardFlipped) {
      rows.reverse();
    }
    const y = rows.indexOf(row) * fieldSize
    
    return {x, y}
  }

  nullableDetermineFieldAtPos(x: number, y: number, fieldSize: number = this.fieldSize): string | null {
    const field = this.determineColAtPos(x, fieldSize) + this.determineRowAtPos(y, fieldSize);
    if(field.includes('x')) {
      return null
    }
    return field
  }

  determineFieldAtPos(x: number, y: number, fieldSize: number = this.fieldSize): string {
    return this.determineColAtPos(x, fieldSize) + this.determineRowAtPos(y, fieldSize);
  }

  determineRowAtPos(y: number, fieldSize: number = this.fieldSize): string {
    let rows = ['8', '7', '6', '5', '4', '3', '2', '1']

    if (this.boardFlipped) {
      rows.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (y >= i * fieldSize && y < i * fieldSize + fieldSize) {
        return rows[i]
      }
    }
    return "x";
  }

  determineColAtPos(x: number, fieldSize: number = this.fieldSize): string {
    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    if (this.boardFlipped) {
      cols.reverse();
    }

    for (let i = 0; i < 8; i++) {
      if (x >= i * fieldSize && x < i * fieldSize + fieldSize) {
        return cols[i]
      }
    }
    return "x";
  }
}
