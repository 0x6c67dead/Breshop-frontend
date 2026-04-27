export type PieceStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "BLOCKED";

export type ReservationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type RejectReason =
  | "SOLD_ELSEWHERE"
  | "RETURN_TO_STORE";

export interface Piece {
  id: string;
  title: string;
  price: number;
  status: PieceStatus;
  brechoId: string;
  images: string[];
}

export interface Reservation {
  id: string;
  pieceId: string;
  buyerId: string;
  status: ReservationStatus;
  rejectReason?: RejectReason;
  expiresAt: string;
}

export interface Wallet {
  balance: number;
}
