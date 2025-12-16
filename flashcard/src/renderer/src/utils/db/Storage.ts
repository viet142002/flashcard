// ============= INDEXEDDB STORAGE LAYER =============
// Tối ưu cho hàng ngàn flash cards

import { FlashCard, CardStatus } from '../types'

export interface QueryOptions {
    limit?: number
    offset?: number
    status?: CardStatus
    tags?: string[]
    deckId?: string
}

export class FlashCardStorage {
    private dbName = 'FlashCardDB'
    private version = 1
    private db: IDBDatabase | null = null

    /**
     * Khởi tạo database
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                this.db = request.result
                resolve()
            }

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result

                // Tạo object store
                if (!db.objectStoreNames.contains('cards')) {
                    const cardStore = db.createObjectStore('cards', {
                        keyPath: 'id',
                    })

                    // Tạo indexes để query nhanh
                    cardStore.createIndex('nextReview', 'nextReview', {
                        unique: false,
                    })
                    cardStore.createIndex('status', 'status', { unique: false })
                    cardStore.createIndex('createdAt', 'createdAt', {
                        unique: false,
                    })
                    cardStore.createIndex('deckId', 'deckId', { unique: false })

                    // Composite index cho query phức tạp
                    cardStore.createIndex(
                        'status_nextReview',
                        ['status', 'nextReview'],
                        {
                            unique: false,
                        }
                    )
                }
            }
        })
    }

    /**
     * Lưu một card
     */
    async saveCard(card: FlashCard): Promise<void> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readwrite')
            const store = transaction.objectStore('cards')
            const request = store.put(card)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Lưu nhiều cards cùng lúc (batch operation)
     */
    async saveCards(cards: FlashCard[]): Promise<void> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readwrite')
            const store = transaction.objectStore('cards')

            let completed = 0
            const total = cards.length

            cards.forEach((card) => {
                const request = store.put(card)
                request.onsuccess = () => {
                    completed++
                    if (completed === total) resolve()
                }
                request.onerror = () => reject(request.error)
            })

            if (total === 0) resolve()
        })
    }

    /**
     * Lấy một card theo ID
     */
    async getCard(id: string): Promise<FlashCard | null> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const request = store.get(id)

            request.onsuccess = () => resolve(request.result || null)
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Lấy cards cần ôn (nextReview <= now)
     * TỐI ƯU: Dùng index để query nhanh
     */
    async getDueCards(limit: number = 50): Promise<FlashCard[]> {
        if (!this.db) throw new Error('Database not initialized')

        const now = Date.now()
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const index = store.index('nextReview')

            // Query với upperBound để lấy cards có nextReview <= now
            const range = IDBKeyRange.upperBound(now)
            const request = index.openCursor(range)

            const results: FlashCard[] = []

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result
                if (cursor && results.length < limit) {
                    // Loại bỏ cards NEW (chỉ lấy cards đang review)
                    if (cursor.value.status !== CardStatus.NEW) {
                        results.push(cursor.value)
                    }
                    cursor.continue()
                } else {
                    resolve(results)
                }
            }

            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Lấy cards NEW
     */
    async getNewCards(limit: number = 20): Promise<FlashCard[]> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const index = store.index('status')

            const range = IDBKeyRange.only(CardStatus.NEW)
            const request = index.openCursor(range)

            const results: FlashCard[] = []

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result
                if (cursor && results.length < limit) {
                    results.push(cursor.value)
                    cursor.continue()
                } else {
                    resolve(results)
                }
            }

            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Lấy cards theo status với pagination
     */
    async getCardsByStatus(
        status: CardStatus,
        offset: number = 0,
        limit: number = 20
    ): Promise<FlashCard[]> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const index = store.index('status')

            const range = IDBKeyRange.only(status)
            const request = index.openCursor(range)

            const results: FlashCard[] = []
            let skipped = 0

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result
                if (cursor) {
                    if (skipped < offset) {
                        skipped++
                        cursor.continue()
                    } else if (results.length < limit) {
                        results.push(cursor.value)
                        cursor.continue()
                    } else {
                        resolve(results)
                    }
                } else {
                    resolve(results)
                }
            }

            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Đếm tổng số cards
     */
    async countCards(): Promise<number> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const request = store.count()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Đếm cards theo status
     */
    async countByStatus(status: CardStatus): Promise<number> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const index = store.index('status')
            const range = IDBKeyRange.only(status)
            const request = index.count(range)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Xóa card
     */
    async deleteCard(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readwrite')
            const store = transaction.objectStore('cards')
            const request = store.delete(id)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Xóa tất cả cards
     */
    async clearAll(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readwrite')
            const store = transaction.objectStore('cards')
            const request = store.clear()

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Lấy tất cả cards (CHỈ DÙNG CHO EXPORT)
     * Không nên dùng khi có hàng ngàn cards
     */
    async getAllCards(): Promise<FlashCard[]> {
        if (!this.db) throw new Error('Database not initialized')

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['cards'], 'readonly')
            const store = transaction.objectStore('cards')
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    /**
     * Search cards (full-text search - simple implementation)
     */
    async searchCards(query: string, limit: number = 50): Promise<FlashCard[]> {
        if (!this.db) throw new Error('Database not initialized')

        const allCards = await this.getAllCards()
        const lowerQuery = query.toLowerCase()

        return allCards
            .filter(
                (card) =>
                    card.word.toLowerCase().includes(lowerQuery) ||
                    card.mean.toLowerCase().includes(lowerQuery) ||
                    card.tags?.some((tag) =>
                        tag.toLowerCase().includes(lowerQuery)
                    )
            )
            .slice(0, limit)
    }

    /**
     * Lấy statistics nhanh
     */
    async getStatistics() {
        const [total, newCount, learningCount, reviewCount] = await Promise.all(
            [
                this.countCards(),
                this.countByStatus(CardStatus.NEW),
                this.countByStatus(CardStatus.LEARNING),
                this.countByStatus(CardStatus.REVIEW),
            ]
        )

        const dueCards = await this.getDueCards(1000) // Lấy max 1000 để đếm

        return {
            total,
            new: newCount,
            learning: learningCount,
            review: reviewCount,
            dueToday: dueCards.length,
        }
    }

    /**
     * Đóng database connection
     */
    close(): void {
        if (this.db) {
            this.db.close()
            this.db = null
        }
    }
}

// ============= INTEGRATED FLASH CARD MANAGER =============

// ============= USAGE =============

// async function example() {
//   const manager = new OptimizedFlashCardManager();
//   await manager.init();

//   // Tạo cards
//   await manager.createCard("What is React?", "A JavaScript library", ["programming"]);
//   await manager.createCard("What is TypeScript?", "Typed superset of JS", ["programming"]);

//   // Lấy study session
//   const todayCards = await manager.getTodayStudySession(20);
//   console.log(`Study ${todayCards.length} cards today`);

//   // Review
//   for (const card of todayCards) {
//     await manager.reviewCard(card.id, 4); // Quality = 4
//   }

//   // Statistics
//   const stats = await manager.getStatistics();
//   console.log(stats);
// }

// // example();
