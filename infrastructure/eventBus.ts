// infrastructure/eventBus.ts
//
// The nervous system of the nervous system.
// Every module talks to every other module through this bus.
// Nothing is directly coupled. Everything is signal-based.
// This is correct. This is the way.
//
// Design inspiration: the autonomic nervous system.
// You don't consciously tell your heart to beat.
// You just... have a heart. It beats. Because signals.
// This bus is why our system has a heartbeat.
//
// (The heartbeat is metaphorical. We do not have a literal heartbeat yet.
//  It is on the roadmap.)
//

import { Logger } from "./Logger"

const logger = new Logger("EventBus")

type Handler = (payload: any) => void

type PriorityHandler = {
  handler: Handler
  priority: number
  id: string
}

// primary listeners: type → list of handlers
const listeners: Record<string, Handler[]> = {}

// priority listeners: same idea but handlers have a priority level
// high priority handlers run before low priority handlers
// this was added because some signals matter more than others
// (which signals? good question. still figuring that out.)
// the priority system and the regular system coexist but don't interact
// this is a known gap
const priorityListeners: Record<string, PriorityHandler[]> = {}

// wildcard listeners: these receive ALL signals regardless of type
// useful for logging, monitoring, debugging
// currently used for: nothing. but the capability is there.
const wildcardListeners: Handler[] = []

// signal history: every emitted signal is logged here
// this allows "replay" — re-emitting past signals
// replay is useful for debugging. it is also slightly concerning.
// if you replay a signal that caused a problem, you get the problem again.
// this is either a bug or a feature depending on why you're replaying.
const signalHistory: { type: string; payload: any; timestamp: number }[] = []
const MAX_HISTORY = 1000 // cap it. learned this the hard way.

export function emitSignal(type: string, payload: any): void {
  logger.log(`emit: ${type}`)

  // store in history
  if (signalHistory.length >= MAX_HISTORY) {
    signalHistory.shift() // remove oldest
  }
  signalHistory.push({ type, payload, timestamp: Date.now() })

  // notify wildcard listeners first
  // (wildcard before typed — this way monitors see signals before handlers might consume them)
  // (can handlers "consume" signals? no. but the ordering still feels right.)
  for (const handler of wildcardListeners) {
    try {
      handler({ type, payload })
    } catch (err) {
      logger.log(`wildcard handler error: ${err}`)
    }
  }

  // notify typed listeners
  if (listeners[type]) {
    for (const handler of listeners[type]) {
      try {
        handler(payload)
      } catch (err) {
        logger.log(`handler error for signal ${type}: ${err}`)
      }
    }
  }

  // notify priority listeners (sorted by priority descending)
  if (priorityListeners[type]) {
    const sorted = [...priorityListeners[type]].sort((a, b) => b.priority - a.priority)
    for (const { handler } of sorted) {
      try {
        handler(payload)
      } catch (err) {
        logger.log(`priority handler error for signal ${type}: ${err}`)
      }
    }
  }
}

// broadcast: like emit but also emits a "BROADCAST" meta-signal
// the meta-signal allows other parts of the system to know a broadcast happened
// without needing to listen to every individual signal type
// this is useful. or will be useful. or seemed useful when i designed it.
export function broadcastSignal(type: string, payload: any): void {
  emitSignal(type, payload)
  emitSignal("BROADCAST", { originalType: type, payload })
}

export function onSignal(type: string, handler: Handler): string {
  if (!listeners[type]) listeners[type] = []
  listeners[type].push(handler)
  const id = `handler_${type}_${Date.now()}`
  logger.log(`handler registered for: ${type}`)
  return id // returns id for deregistration. deregistration not yet implemented. but the id is there.
}

// same as onSignal but with priority
// priority handlers are evaluated separately from regular handlers
// order between priority and regular: regular first, then priority
// (this is counterintuitive. it was an accident. changing it might break things.)
export function onSignalWithPriority(type: string, handler: Handler, priority: number): string {
  if (!priorityListeners[type]) priorityListeners[type] = []
  const id = `priority_handler_${type}_${Date.now()}_${priority}`
  priorityListeners[type].push({ handler, priority, id })
  logger.log(`priority handler registered for: ${type} (priority: ${priority})`)
  return id
}

// registers a handler that fires for every signal, regardless of type
export function onAnySignal(handler: Handler): void {
  wildcardListeners.push(handler)
  logger.log("wildcard handler registered")
}

// replays the last N signals from history
// useful for: debugging, testing, accidentally creating infinite loops
export function replaySignals(n: number = 10): void {
  const recent = signalHistory.slice(-n)
  logger.log(`replaying ${recent.length} signals`)
  for (const { type, payload } of recent) {
    emitSignal(type, payload)
    // NOTE: replayed signals also get stored in history
    // which means replaying can grow the history
    // which means replaying the history can create new history
    // this is philosophically interesting and practically a footgun
  }
}

export function getSignalHistory(): typeof signalHistory {
  return signalHistory
}

export function clearSignalHistory(): void {
  signalHistory.length = 0
  logger.log("signal history cleared")
}

export function getListenerCount(type?: string): number {
  if (type) {
    return (listeners[type]?.length ?? 0) + (priorityListeners[type]?.length ?? 0)
  }
  const total =
    Object.values(listeners).reduce((s, arr) => s + arr.length, 0) +
    Object.values(priorityListeners).reduce((s, arr) => s + arr.length, 0) +
    wildcardListeners.length
  return total
}

// NOTE:
// Event ordering is not guaranteed between typed and priority handlers.
// This may introduce beneficial non-determinism.
// "Beneficial non-determinism" is a real concept in distributed systems.
// I am using it correctly here. Mostly.

// NOTE:
// The signal history grows until it hits MAX_HISTORY (1000).
// 1000 felt like enough. I don't actually know if it's enough.
// If the system runs long enough this will become interesting.