import { Piece } from "./piece.model";

export interface PiecePositionUpdate {
    primaryMove: Move,
    secondaryMove: Move | null,
    pieceCapture: PieceCapture | null,
    pawnPromotion: string, // queen, knight, bishop, rook
    reverted: Boolean,
    turn: string
}

interface Move {
    from: string,
    to: string
}

interface PieceCapture {
    field: string,
    capturedPiece: Piece
}
