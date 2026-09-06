// src/api/flashcards.ts
// Flashcard / Spaced Repetition System for quick revision
import { readStore, writeStore, uid } from './storage'
import type { FlashcardDeck, Flashcard } from './types'

const DECKS_KEY = 'digispark:flashcard-decks'

const DEFAULT_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1', title: 'DSA Fundamentals', description: 'Core data structures and algorithms', category: 'DSA', mastery: 0,
    cards: [
      { id: 'c-1', front: 'What is the time complexity of binary search?', back: 'O(log n) — Binary search halves the search space at each step.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-2', front: 'What is a hash table?', back: 'A data structure that maps keys to values using a hash function for O(1) average lookup.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-3', front: 'Difference between stack and queue?', back: 'Stack is LIFO (Last In First Out), Queue is FIFO (First In First Out).', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-4', front: 'What is dynamic programming?', back: 'A technique to solve problems by breaking them into overlapping subproblems and storing results to avoid recomputation.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-5', front: 'What is the difference between BFS and DFS?', back: 'BFS explores level by level (uses queue), DFS explores depth first (uses stack/recursion).', difficulty: 'good', nextReview: '', interval: 1 },
    ],
  },
  {
    id: 'deck-2', title: 'JavaScript Interview', description: 'Common JavaScript interview questions', category: 'Web Development', mastery: 0,
    cards: [
      { id: 'c-6', front: 'What is closure in JavaScript?', back: 'A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-7', front: 'What is event delegation?', back: 'A technique where you attach a single event listener to a parent element to handle events on child elements using event bubbling.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-8', front: 'Difference between let, const, and var?', back: 'var is function-scoped and hoisted, let is block-scoped, const is block-scoped and cannot be reassigned.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-9', front: 'What is the event loop?', back: 'The mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel and using a callback queue.', difficulty: 'good', nextReview: '', interval: 1 },
    ],
  },
  {
    id: 'deck-3', title: 'DBMS Concepts', description: 'Database management system fundamentals', category: 'DBMS', mastery: 0,
    cards: [
      { id: 'c-10', front: 'What is normalization?', back: 'The process of organizing data to reduce redundancy and improve data integrity. Normal forms: 1NF, 2NF, 3NF, BCNF.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-11', front: 'What is ACID?', back: 'Atomicity, Consistency, Isolation, Durability — properties that guarantee reliable database transactions.', difficulty: 'good', nextReview: '', interval: 1 },
      { id: 'c-12', front: 'Difference between SQL and NoSQL?', back: 'SQL is relational, uses structured schema. NoSQL is non-relational, flexible schema (document, key-value, graph).', difficulty: 'good', nextReview: '', interval: 1 },
    ],
  },
]

export function getDecks(): FlashcardDeck[] {
  const stored = readStore<FlashcardDeck[]>(DECKS_KEY, [])
  if (stored.length === 0) {
    writeStore(DECKS_KEY, DEFAULT_DECKS)
    return DEFAULT_DECKS
  }
  return stored
}

export function getDeck(id: string): FlashcardDeck | undefined {
  return getDecks().find((d) => d.id === id)
}

export function updateCard(deckId: string, cardId: string, difficulty: Flashcard['difficulty']): void {
  const decks = getDecks()
  const deckIndex = decks.findIndex((d) => d.id === deckId)
  if (deckIndex >= 0) {
    const cardIndex = decks[deckIndex].cards.findIndex((c) => c.id === cardId)
    if (cardIndex >= 0) {
      const card = decks[deckIndex].cards[cardIndex]
      card.difficulty = difficulty
      // Simple spaced repetition: increase interval for 'easy', reset for 'again'
      if (difficulty === 'easy') card.interval *= 2.5
      else if (difficulty === 'good') card.interval *= 1.5
      else if (difficulty === 'hard') card.interval = Math.max(1, card.interval * 0.5)
      else card.interval = 1
      card.nextReview = new Date(Date.now() + card.interval * 86400000).toISOString()
      // Recalculate mastery
      const total = decks[deckIndex].cards.length
      const mastered = decks[deckIndex].cards.filter((c) => c.interval > 3).length
      decks[deckIndex].mastery = Math.round((mastered / total) * 100)
      writeStore(DECKS_KEY, decks)
    }
  }
}

export function addCard(deckId: string, front: string, back: string): void {
  const decks = getDecks()
  const index = decks.findIndex((d) => d.id === deckId)
  if (index >= 0) {
    decks[index].cards.push({ id: uid('card'), front, back, difficulty: 'again', nextReview: '', interval: 1 })
    writeStore(DECKS_KEY, decks)
  }
}