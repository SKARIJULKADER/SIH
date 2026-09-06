// src/api/studyGroups.ts
// Study Groups — cohort learning and group study
import { readStore, writeStore, uid } from './storage'
import type { StudyGroup, StudyGroupMember } from './types'

const GROUPS_KEY = 'digispark:study-groups'

const DEFAULT_GROUPS: StudyGroup[] = [
  { id: 'sg-1', name: 'DSA Masters', description: 'Daily DSA practice and discussion group', subject: 'Data Structures', members: [{ id: 'u-1', name: 'Arij Hossain', avatar: 'https://i.pravatar.cc/32?img=32', role: 'admin', joinedAt: '2024-01-15', xp: 2450 }, { id: 'u-2', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/32?img=44', role: 'member', joinedAt: '2024-01-20', xp: 2280 }], maxMembers: 10, createdBy: 'u-1', createdAt: '2024-01-15', nextSession: '2024-02-01T18:00:00', inviteCode: 'DSA2024' },
  { id: 'sg-2', name: 'React Developers', description: 'Building projects with React together', subject: 'Web Development', members: [{ id: 'u-3', name: 'Rahul Kumar', avatar: 'https://i.pravatar.cc/32?img=36', role: 'admin', joinedAt: '2024-01-10', xp: 2100 }], maxMembers: 8, createdBy: 'u-3', createdAt: '2024-01-10', nextSession: '2024-02-02T19:00:00', inviteCode: 'REACT24' },
  { id: 'sg-3', name: 'ML Study Circle', description: 'Machine Learning concepts and projects', subject: 'Machine Learning', members: [{ id: 'u-4', name: 'Sneha Patel', avatar: 'https://i.pravatar.cc/32?img=48', role: 'admin', joinedAt: '2024-01-05', xp: 1950 }, { id: 'u-5', name: 'Amit Singh', avatar: 'https://i.pravatar.cc/32?img=50', role: 'member', joinedAt: '2024-01-12', xp: 1800 }], maxMembers: 12, createdBy: 'u-4', createdAt: '2024-01-05', nextSession: '2024-02-03T17:00:00', inviteCode: 'MLCIRCLE' },
]

export function getGroups(): StudyGroup[] {
  const stored = readStore<StudyGroup[]>(GROUPS_KEY, [])
  if (stored.length === 0) {
    writeStore(GROUPS_KEY, DEFAULT_GROUPS)
    return DEFAULT_GROUPS
  }
  return stored
}

export function getGroup(id: string): StudyGroup | undefined {
  return getGroups().find((g) => g.id === id)
}

export function createGroup(name: string, description: string, subject: string, maxMembers: number, createdBy: string, createdByName: string): StudyGroup {
  const group: StudyGroup = {
    id: uid('sg'),
    name,
    description,
    subject,
    members: [{ id: createdBy, name: createdByName, avatar: 'https://i.pravatar.cc/32?img=32', role: 'admin', joinedAt: new Date().toISOString(), xp: 0 }],
    maxMembers,
    createdBy,
    createdAt: new Date().toISOString(),
    nextSession: '',
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
  }
  const groups = getGroups()
  groups.push(group)
  writeStore(GROUPS_KEY, groups)
  return group
}

export function joinGroup(groupId: string, member: StudyGroupMember): void {
  const groups = getGroups()
  const index = groups.findIndex((g) => g.id === groupId)
  if (index >= 0 && groups[index].members.length < groups[index].maxMembers) {
    groups[index].members.push(member)
    writeStore(GROUPS_KEY, groups)
  }
}

export function leaveGroup(groupId: string, memberId: string): void {
  const groups = getGroups()
  const index = groups.findIndex((g) => g.id === groupId)
  if (index >= 0) {
    groups[index].members = groups[index].members.filter((m) => m.id !== memberId)
    writeStore(GROUPS_KEY, groups)
  }
}