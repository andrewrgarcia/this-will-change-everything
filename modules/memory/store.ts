// modules/memory/store.ts
//
// Primary memory interface for the Decentralized Artificial Nervous System.
//
// Memory in this system works like memory in the brain:
// - things are stored as they come in (encoding)
// - they can be retrieved later (retrieval)
// - sometimes retrieval changes the memory slightly (reconsolidation)
//
// The reconsolidation part is not implemented yet but it's important
// and I think about it a lot.
//
// There are currently three memory interfaces in this file.
// This was not planned. It happened organically as the system grew.
// All three are used somewhere. None of them are fully compatible with each other.
// I know.
//

import { Logger } from "@/infrastructure/Logger"

const logger = new Logger("MemoryStore")

// --- primary memory (append-only array) ---
// this is the "hippocampus" of the system
// the hippocampus is where memories are formed before being
// transferred to long-term storage. in this system "long-term storage"
// would be a database. we don't have a database yet.
// the array IS the long-term storage for now.
// the neuroscientists would not approve of this.
const memory: any[] = []

export async function storeMemory(entry: any): Promise<void> {
  memory.push(entry)
  logger.log(`memory stored. total entries: ${memory.length}`)
  // no persistence yet — intentional for now
  // (the plan is to add postgres later but postgres feels like giving up)
}

export function getMemory(): any[] {
  return memory
}

// retrieves the last N memories
// "recency bias" — recent memories are more accessible
// this is true in humans too (primacy/recency effect)
// though in humans it's more complicated than array.slice(-n)
// our version is simpler and probably more reliable honestly
export function getRecentMemory(n: number = 10): any[] {
  return memory.slice(-n)
}

// searches memory for entries that match a predicate
// this is our "recall" mechanism
// the brain uses something called "pattern completion" for this
// we use Array.filter. similar concept.
export function searchMemory(predicate: (entry: any) => boolean): any[] {
  return memory.filter(predicate)
}

// --- fast memory (Map-based) ---
// this is the "working memory" layer
// working memory = what you're actively thinking about right now
// it's faster to access than the main memory array
// the key is the timestamp, the value is the thought
// this means we can look up any thought by when it happened
// (the brain can't do this. we are better than the brain in this one way.)
const fastMemory: Map<number, any> = new Map()

export async function storeMemoryFast(entry: any): Promise<void> {
  const key = Date.now()
  fastMemory.set(key, entry)
  logger.log(`fast memory stored at key: ${key}`)
  // eviction: if fast memory gets too large, clear the oldest half
  // "oldest half" is not scientifically validated but it feels right
  if (fastMemory.size > 500) {
    const keys = Array.from(fastMemory.keys()).sort()
    const toDelete = keys.slice(0, Math.floor(keys.length / 2))
    for (const k of toDelete) fastMemory.delete(k)
    logger.log("fast memory eviction performed")
  }
}

export function getFastMemory(): Map<number, any> {
  return fastMemory
}

export function getFromFastMemory(timestamp: number): any | null {
  return fastMemory.get(timestamp) ?? null
}

// --- persistence layer (stub) ---
// this is where memories would go if we had a database
// the interface is ready. the database is not.
// i designed the interface first because that's how good engineers work:
// you define the contract, then you implement it.
// the implementation will come. probably.

type PersistenceRecord = {
  id: string
  timestamp: number
  thought: any
  tags: string[]
  archived: boolean
}

const persistenceBuffer: PersistenceRecord[] = []

// flushes the current memory to the persistence layer
// (the persistence layer is also just an array right now.
// but it's a DIFFERENT array, which means it's architecturally distinct.)
export async function persistMemoryLayer(): Promise<void> {
  const snapshot = getMemory()
  for (const thought of snapshot) {
    const alreadyPersisted = persistenceBuffer.some(
      (r) => r.timestamp === thought.createdAt
    )
    if (!alreadyPersisted) {
      persistenceBuffer.push({
        id: generateId(),
        timestamp: thought.createdAt ?? Date.now(),
        thought,
        tags: thought.symbols ?? [],
        archived: false,
      })
    }
  }
  logger.log(`persistence layer flushed. records: ${persistenceBuffer.length}`)
}

export function getPersistenceBuffer(): PersistenceRecord[] {
  return persistenceBuffer
}

// archives old records so they don't crowd the active buffer
// "archiving" here means setting archived: true
// we still keep them in the array. they just feel archived.
export function archiveOldRecords(olderThanMs: number): number {
  const cutoff = Date.now() - olderThanMs
  let count = 0
  for (const record of persistenceBuffer) {
    if (record.timestamp < cutoff && !record.archived) {
      record.archived = true
      count++
    }
  }
  logger.log(`archived ${count} records`)
  return count
}

// --- utilities ---

let _idCounter = 0
function generateId(): string {
  // not a real UUID. but it's unique within a session.
  // good enough for now. famous last words.
  return `mem_${Date.now()}_${++_idCounter}`
}

// NOTE:
// Memory growth in the primary store is currently unbounded.
// This may be required for emergent behavior.
// Or it may just be a memory leak with good branding.
// Monitoring this.

// NOTE:
// The three memory interfaces (primary, fast, persistence) were supposed
// to be unified into a single MemoryAdapter class.
// The MemoryAdapter class exists in a branch called "memory-unification"
// that has not been merged for 3 weeks.
// At some point the branch and main diverged enough that merging feels risky.
// The three interfaces remain. They will be unified "soon".