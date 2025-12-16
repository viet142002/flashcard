import { FlashCardStorage } from '../db/Storage'
import { CardStatus, FlashCard, Quality } from '../types'

export class FlashCardManager {
    private storage: FlashCardStorage
    private cache: Map<string, FlashCard>

    constructor() {
        this.storage = new FlashCardStorage()
        this.cache = new Map()
    }

    async init(): Promise<void> {
        await this.storage.init()
    }

    /**
     * Tạo card mới
     */
    async createCard({
        word,
        mean,
        audio,
        ipa,
        example,
        tags,
        deckId,
    }: Pick<FlashCard, 'word' | 'mean' | 'tags' | 'deckId' | 'ipa' | 'audio' | 'example'>): Promise<FlashCard> {
        const card: FlashCard = {
            id: this.generateId(),
            ipa,
            mean,
            audio,
            example,
            word,
            interval: 0,
            repetitions: 0,
            easeFactor: 2.5,
            nextReview: Date.now(),
            status: CardStatus.NEW,
            createdAt: Date.now(),
            lastReviewed: null,
            totalReviews: 0,
            tags,
            deckId,
        }

        await this.storage.saveCard(card)
        this.cache.set(card.id, card)

        return card
    }

    /**
     * Review card với SM-2
     */
    async reviewCard(cardId: string, quality: Quality): Promise<FlashCard> {
        let card = this.cache.get(cardId) || null

        if (!card) {
            card = await this.storage.getCard(cardId)
            if (!card) throw new Error(`Card ${cardId} not found`)
        }

        const now = Date.now()

        // SM-2 Algorithm
        card.easeFactor = Math.max(
            1.3,
            card.easeFactor +
                (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        )

        if (quality < 3) {
            card.repetitions = 0
            card.interval = 0
            card.status = CardStatus.LEARNING
            card.nextReview = now + 10 * 60 * 1000
        } else {
            card.repetitions++

            if (card.repetitions === 1) {
                card.interval = 1
            } else if (card.repetitions === 2) {
                card.interval = 6
            } else {
                card.interval = Math.round(card.interval * card.easeFactor)
            }

            card.status = CardStatus.REVIEW
            card.nextReview = now + card.interval * 24 * 60 * 60 * 1000
        }

        card.lastReviewed = now
        card.totalReviews++

        // Save to database
        await this.storage.saveCard(card)
        this.cache.set(card.id, card)

        return card
    }

    /**
     * Lấy study session hôm nay
     */
    async getTodayStudySession(maxCards: number = 50): Promise<FlashCard[]> {
        const cards: FlashCard[] = []

        // 1. Lấy due cards (tối đa 50)
        const dueCards = await this.storage.getDueCards(50)
        cards.push(...dueCards)

        // 2. Thêm new cards
        const remaining = maxCards - cards.length
        if (remaining > 0) {
            const newCards = await this.storage.getNewCards(
                Math.min(remaining, 20)
            )
            cards.push(...newCards)
        }

        // Cache cards
        cards.forEach((card) => this.cache.set(card.id, card))

        return this.shuffleArray(cards)
    }

    /**
     * Statistics
     */
    async getStatistics() {
        return await this.storage.getStatistics()
    }

    /**
     * Export all data
     */
    async exportData(): Promise<FlashCard[]> {
        return await this.storage.getAllCards()
    }

    /**
     * Import data (batch)
     */
    async importData(cards: FlashCard[]): Promise<void> {
        await this.storage.saveCards(cards)
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }
}
