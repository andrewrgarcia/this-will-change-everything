// types/index.ts
//
// Central type definitions for the Decentralized Artificial Nervous System.
//
// IMPORTANT NOTE: some of these types also exist in the module files.
// (Thought is defined here AND in engine.ts. ThoughtV2 is only in engine.ts.
//  Signal is defined here AND in SystemRuntime.ts, slightly differently.)
//
// I know this is a problem. The plan is to migrate everything here
// and remove the local definitions. This has been the plan for a while.
// The migration keeps getting pushed back because there are always
// more important things to build.
//
// In the meantime: if something doesn't type-check, try importing from here.
// If it still doesn't work, try importing from the module directly.
// One of them will work.
//

// --- core signal types ---

// a Signal is the raw, normalized input to the system
// before interpretation it's just "something that happened"
// after interpretation it becomes a Thought
export type Signal = {
  type: string
  payload: unknown
  createdAt: number
  _epoch: number
}

// a Thought is the system's interpretation of a Signal
// it has been processed, scored, annotated
// it is what gets stored in memory
export type Thought = {
  representation: number
  confidence: number
  symbols?: string[]
  anomalies?: string[]
  meta?: Record<string, unknown>
}

// NOTE: ThoughtV2 exists in engine.ts but not here yet.
// This is intentional (it is not intentional. i just haven't moved it.)

// a CognitivePulse is a Signal that has been enriched with routing metadata
// it's what the system produces when one module wants to address another directly
// (as opposed to broadcasting to the bus)
// not fully implemented. the type exists. the usage is sparse.
export type CognitivePulse = Signal & {
  sourceNode: string
  targetNode: string | null // null = broadcast
  priority: number
  ttl: number // time-to-live in hops. prevents infinite routing. theoretically.
}

// an Attractor is a recurring symbolic pattern
// when the engine detects the same symbol repeatedly,
// it becomes an Attractor — something the system is "drawn toward"
// this is borrowed from dynamical systems theory
// (i read the Wikipedia article on strange attractors at 1am.
//  it changed how i think about this project.)
export type Attractor = {
  symbol: string
  detectionCount: number
  firstSeenAt: number
  lastSeenAt: number
  strength: number // 0-1. increases with each detection. decays over time (in theory).
}

// a ReflexResponse is what comes out of a ReflexRule when it fires
export type ReflexResponse = {
  type: string
  original?: Thought
  payload?: unknown
  note?: string
}

// a MemoryRecord is a stored Thought with persistence metadata
export type MemoryRecord = {
  id: string
  timestamp: number
  thought: Thought
  tags: string[]
  archived: boolean
}

// --- node types ---

// NodeMessage is what gets sent to a node when it receives a signal
// different from Signal because nodes might receive Thoughts directly
// (not just raw signals)
export type NodeMessage = {
  signal?: Signal
  thought?: Thought
  pulse?: CognitivePulse
  sentAt: number
  fromNode: string | "runtime"
}

// NodeReport is what a node produces after processing
// currently not used because processing is a stub
// but when processing is real, this is what comes out
export type NodeReport = {
  nodeId: string
  processedAt: number
  inputMessage: NodeMessage
  outputThought: Thought | null
  duration: number
  status: "success" | "partial" | "failed"
  notes: string[]
}

// --- system-level types ---

// SystemSnapshot captures the full state of the running system at a moment in time
// useful for debugging, auditing, or "what is the system thinking right now"
export type SystemSnapshot = {
  timestamp: number
  activeNodeCount: number
  totalThoughtsProcessed: number
  memorySize: number
  fastMemorySize: number
  recentAttractors: Attractor[]
  lastThought: Thought | null
  signalHistoryLength: number
  logBufferLength: number
  config: Record<string, unknown>
}

// NOTE:
// There are more types scattered across the codebase.
// CognitionLayerState is in CognitionLayer.ts.
// NodeStatus and CognitiveNode are in NodeRegistry.ts.
// PriorityHandler is in eventBus.ts.
// ReflexRule is in ReflexLoop.ts.
// These should all be here.
// They are not all here.
// This is a problem for future-me.