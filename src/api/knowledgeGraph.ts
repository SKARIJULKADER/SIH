// src/api/knowledgeGraph.ts
// Knowledge Graph — visual map of skill connections
import type { KnowledgeNode } from './types'

const NODES: KnowledgeNode[] = [
  { id: 'n1', label: 'Python', category: 'language', x: 200, y: 100, connections: ['n2', 'n3', 'n4'], description: 'A versatile programming language', resources: [] },
  { id: 'n2', label: 'JavaScript', category: 'language', x: 400, y: 100, connections: ['n1', 'n5', 'n6'], description: 'The language of the web', resources: [] },
  { id: 'n3', label: 'React', category: 'framework', x: 400, y: 250, connections: ['n2', 'n7'], description: 'A JavaScript library for building UIs', resources: [] },
  { id: 'n4', label: 'Node.js', category: 'framework', x: 200, y: 250, connections: ['n1', 'n2'], description: 'JavaScript runtime for backend', resources: [] },
  { id: 'n5', label: 'HTML/CSS', category: 'language', x: 600, y: 100, connections: ['n2', 'n3'], description: 'The foundation of web pages', resources: [] },
  { id: 'n6', label: 'TypeScript', category: 'language', x: 600, y: 250, connections: ['n2', 'n3'], description: 'Typed superset of JavaScript', resources: [] },
  { id: 'n7', label: 'MongoDB', category: 'tool', x: 400, y: 400, connections: ['n4'], description: 'NoSQL document database', resources: [] },
  { id: 'n8', label: 'Git', category: 'tool', x: 600, y: 400, connections: ['n1', 'n2'], description: 'Version control system', resources: [] },
]

export function getKnowledgeGraph(): KnowledgeNode[] {
  return NODES
}

export function getNode(id: string): KnowledgeNode | undefined {
  return NODES.find((n) => n.id === id)
}

export function getConnectedNodes(id: string): KnowledgeNode[] {
  const node = getNode(id)
  if (!node) return []
  return NODES.filter((n) => node.connections.includes(n.id))
}

export function getNodesByCategory(category: KnowledgeNode['category']): KnowledgeNode[] {
  return NODES.filter((n) => n.category === category)
}