// src/pages/dashboard/Flashcards.tsx
// 🃏 Flashcard / Spaced Repetition System
import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { FlashcardDeck, Flashcard } from '@/api/types'

const SAMPLE_DECKS: FlashcardDeck[] = [
  { id: 'deck-1', title: 'DSA Fundamentals', description: 'Key data structures and algorithms', category: 'DSA', mastery: 0, cards: [
    { id: 'c1', front: 'Time complexity of binary search?', back: 'O(log n) — halves search space each step.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c2', front: 'What is a hash table?', back: 'Maps keys to values using hash function for O(1) lookup.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c3', front: 'Stack vs Queue?', back: 'Stack is LIFO, Queue is FIFO.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c4', front: 'What is dynamic programming?', back: 'Breaks problems into subproblems, stores results to avoid recomputation.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c5', front: 'Time complexity of merge sort?', back: 'O(n log n) in all cases.', difficulty: 'good', nextReview: '', interval: 1 },
  ]},
  { id: 'deck-2', title: 'DBMS Concepts', description: 'Database fundamentals', category: 'DBMS', mastery: 0, cards: [
    { id: 'c6', front: 'What is normalization?', back: 'Organizing data to reduce redundancy. Forms: 1NF, 2NF, 3NF, BCNF.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c7', front: 'What is a primary key?', back: 'Unique identifier for each record. Cannot be NULL.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c8', front: 'SQL vs NoSQL?', back: 'SQL: relational, structured. NoSQL: non-relational, flexible schema.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c9', front: 'What is indexing?', back: 'Data structure technique for quick data lookup in a database.', difficulty: 'good', nextReview: '', interval: 1 },
  ]},
  { id: 'deck-3', title: 'OOP Concepts', description: 'Object-oriented programming', category: 'OOP', mastery: 0, cards: [
    { id: 'c10', front: '4 pillars of OOP?', back: 'Encapsulation, Inheritance, Polymorphism, Abstraction.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c11', front: 'What is encapsulation?', back: 'Bundling data and methods, hiding internal state.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c12', front: 'What is polymorphism?', back: 'Different objects respond to same method call differently.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c13', front: 'Abstract class vs interface?', back: 'Abstract class can have implementations. Interface only declares. Multiple interfaces allowed.', difficulty: 'good', nextReview: '', interval: 1 },
  ]},
  { id: 'deck-4', title: 'Operating Systems', description: 'OS concepts for interviews', category: 'OS', mastery: 0, cards: [
    { id: 'c14', front: 'Process vs thread?', back: 'Process: independent program. Thread: lightweight unit sharing memory.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c15', front: 'What is deadlock?', back: 'Processes waiting for each other to release resources, none can proceed.', difficulty: 'good', nextReview: '', interval: 1 },
    { id: 'c16', front: 'What is virtual memory?', back: 'Gives impression of contiguous memory by using disk as extension of RAM.', difficulty: 'good', nextReview: '', interval: 1 },
  ]},
]

export default function Flashcards() {
  const [decks] = useState<FlashcardDeck[]>(SAMPLE_DECKS)
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const handleRate = (_difficulty: Flashcard['difficulty']) => {
    setFlipped(false)
    if (currentCard < (selectedDeck?.cards.length ?? 0) - 1) {
      setCurrentCard(currentCard + 1)
    }
  }

  if (selectedDeck) {
    const card = selectedDeck.cards[currentCard]
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedDeck(null); setCurrentCard(0); setFlipped(false) }}>← Back</Button>
              <h2 className="text-xl font-bold text-text-heading mt-2">{selectedDeck.title}</h2>
            </div>
            <Badge variant="outline">{currentCard + 1}/{selectedDeck.cards.length}</Badge>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="min-h-[200px] flex items-center justify-center cursor-pointer p-8 rounded-xl border-2 border-border hover:border-primary/50 transition-all" onClick={() => setFlipped(!flipped)}>
                {!flipped ? (
                  <div className="text-center">
                    <p className="text-sm text-text-secondary mb-2">Question</p>
                    <p className="text-xl font-semibold text-text-heading">{card.front}</p>
                    <p className="text-xs text-text-secondary mt-4">Click to reveal answer</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-text-secondary mb-2">Answer</p>
                    <p className="text-lg text-text-heading">{card.back}</p>
                    <p className="text-xs text-text-secondary mt-4">Click to see question</p>
                  </div>
                )}
              </div>
              {flipped && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button variant="danger" size="sm" onClick={() => handleRate('again')}>Again</Button>
                  <Button variant="outline" size="sm" onClick={() => handleRate('hard')}>Hard</Button>
                  <Button variant="primary" size="sm" onClick={() => handleRate('good')}>Good</Button>
                  <Button variant="success" size="sm" onClick={() => handleRate('easy')}>Easy</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Badge variant="gradient">🃏 Flashcards</Badge>
          <h1 className="text-3xl font-bold text-text-heading mt-2">Spaced Repetition</h1>
          <p className="text-text-secondary mt-1">Quick revision with smart spaced repetition</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <Card key={deck.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => { setSelectedDeck(deck); setCurrentCard(0); setFlipped(false) }}>
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text-heading">{deck.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{deck.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" size="sm">{deck.category}</Badge>
                      <Badge variant="secondary" size="sm">{deck.cards.length} cards</Badge>
                    </div>
                  </div>
                  <Shuffle size={18} className="text-text-secondary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}