export enum CardStatus {
  NEW = "new",
  LEARNING = "learning",
  REVIEW = "review",
}

export enum Quality {
  BLACKOUT = 0, // Hoàn toàn không nhớ
  INCORRECT = 1, // Sai, nhưng khi xem đáp án thì quen
  RECALL_HARD = 2, // Sai, nhưng gần đúng
  RECALL_GOOD = 3, // Đúng, nhưng khó nhớ
  RECALL_EASY = 4, // Đúng, hơi phân vân
  PERFECT = 5, // Đúng, dễ dàng
}

export interface FlashCard {
  id: string;
  ipa: string;
  mean: string;
  word: string;
  example: string;
  audio: string;


  // SM-2 Properties
  interval: number; // Số ngày đến lần ôn tiếp
  repetitions: number; // Số lần ôn đúng liên tiếp
  easeFactor: number; // Độ dễ (1.3 - 2.5+)
  nextReview: number; // Timestamp milliseconds

  // Metadata
  status: CardStatus;
  createdAt: number;
  lastReviewed: number | null;
  totalReviews: number;

  // Optional
  tags?: string[];
  deckId?: string;
}

export interface ReviewResult {
  card: FlashCard;
  quality: Quality;
  timeSpent: number;
}

export interface StudySession {
  cardsStudied: number;
  averageQuality: number;
  totalTime: number;
  date: number;
}

export interface ReviewQueue {
  overdue: Set<string>;
  today: Set<string>;
  upcoming: Set<string>;
  new: Set<string>;
}
