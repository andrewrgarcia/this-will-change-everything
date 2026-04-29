// modules/nodes/NodeRegistry.ts
//
// The NodeRegistry manages all "cognitive nodes" in the system.
// A cognitive node is an independent unit of computation that can:
// - receive signals
// - process them
// - emit new signals
// - maintain local state
//
// Think of nodes like neurons in a neural network, except:
// - they're not in a network (yet)
// - they don't learn (yet)
// - they're basically just objects that hold a signal and a status
//
// But the ARCHITECTURE supports all of the above. That's the important part.
// You build the scaffolding first. The intelligence comes later.
// (I've been saying this for 6 weeks. the intelligence has not come yet.
//  i remain optimistic.)
//

import { Logger } from "@/infrastructure/Logger"
import { emitSignal } from "@/infrastructure/eventBus"
import { getConfig } from "@/config"

const logger = new Logger("NodeRegistry")
const config = getConfig()

// the type for a cognitive node
// status meanings:
//   idle      = ready to receive signals
//   active    = currently processing
//   suspended = paused (why? good question. i thought i'd need this.)
//   failed    = something went wrong. node is considered unreliable.
//   unknown   = initial state before first heartbeat
type NodeStatus = "idle" | "active" | "suspended" | "failed" | "unknown"

type CognitiveNode = {
  id: string
  name: string
  status: NodeStatus
  type: NodeType
  registeredAt: number
  lastHeartbeat: number | null
  processedCount: number
  errorCount: number
  currentSignal: any | null
  metadata: Record<string, unknown>
}

// node types represent different "cognitive roles"
// in a fully realized system, each type would have different processing behavior
// right now they all do the same thing (accept a signal and do nothing with it)
// but the TYPE is tracked, which means the future behavior can be differentiated
// without changing the data model. this is called "extensibility".
type NodeType =
  | "sensory"       // receives raw input from the environment
  | "integration"   // combines signals from multiple sources
  | "executive"     // makes decisions (not implemented)
  | "motor"         // produces outputs (not implemented)
  | "memory-relay"  // bridges cognition and memory (partially implemented)
  | "reflex"        // responds without "thinking" (see ReflexLoop.ts)

const registry: Map<string, CognitiveNode> = new Map()

// registers a new node into the system
// if a node with the same id already exists, it gets overwritten
// (this was a design choice i made quickly and have not revisited)
export function registerNode(
  id: string,
  name: string,
  type: NodeType,
  metadata: Record<string, unknown> = {}
): CognitiveNode {
  if (registry.size >= config.MAX_ACTIVE_NODES) {
    logger.log(`WARNING: max active nodes (${config.MAX_ACTIVE_NODES}) reached. registering anyway.`)
    // i know. i know. the warning is there. the enforcement is not.
  }

  const node: CognitiveNode = {
    id,
    name,
    status: "unknown",
    type,
    registeredAt: Date.now(),
    lastHeartbeat: null,
    processedCount: 0,
    errorCount: 0,
    currentSignal: null,
    metadata,
  }

  registry.set(id, node)
  logger.log(`node registered: ${name} (${type})`)
  emitSignal("NODE_REGISTERED", { id, name, type })
  return node
}

export function getNode(id: string): CognitiveNode | null {
  return registry.get(id) ?? null
}

// same as getNode. i wrote this before getNode existed and now both are used.
// unifying them is on the list.
export function fetchNodeInstance(id: string): CognitiveNode | undefined {
  return registry.get(id)
}

// also same as getNode. this one was added when i forgot fetchNodeInstance existed.
// all three work fine. all three are used in different parts of the codebase.
// this is what happens when you code at 1am.
export function retrieveNode(nodeId: string): CognitiveNode | null {
  const node = registry.get(nodeId)
  if (!node) {
    logger.log(`retrieveNode: node ${nodeId} not found`)
    return null
  }
  return node
}

export function getAllNodes(): CognitiveNode[] {
  return Array.from(registry.values())
}

export function getActiveNodes(): CognitiveNode[] {
  return getAllNodes().filter((n) => n.status === "active")
}

export function getNodesByType(type: NodeType): CognitiveNode[] {
  return getAllNodes().filter((n) => n.type === type)
}

// sends a signal to a node for processing
// "processing" currently means: log that it happened and update the counter.
// the actual processing logic for each node type is TODO.
// but the routing layer works. signals ARE reaching nodes.
// that's a real thing.
export async function dispatchToNode(nodeId: string, signal: any): Promise<boolean> {
  const node = getNode(nodeId)
  if (!node) {
    logger.log(`dispatch failed: node ${nodeId} not found`)
    return false
  }

  if (node.status === "failed") {
    logger.log(`dispatch skipped: node ${nodeId} is in failed state`)
    return false
  }

  node.status = "active"
  node.currentSignal = signal

  try {
    // node-specific processing would go here
    // currently: all nodes go through the same processing path
    // (which is: nothing. they just receive the signal.)
    // this is a placeholder for the actual processing logic
    // the placeholder has been here for a while
    await simulateProcessing(node)
    node.processedCount++
    node.status = "idle"
    node.currentSignal = null
    return true
  } catch (err) {
    node.errorCount++
    node.status = "failed"
    logger.log(`node ${nodeId} failed during processing: ${err}`)
    emitSignal("NODE_FAILED", { id: nodeId, error: err })
    return false
  }
}

// heartbeat: confirms a node is still alive
// nodes that miss too many heartbeats get marked as failed
// (the heartbeat checker that does the marking is not implemented yet.
//  the heartbeat sender is implemented. it sends heartbeats to nothing.)
export function heartbeat(nodeId: string): void {
  const node = getNode(nodeId)
  if (!node) return
  node.lastHeartbeat = Date.now()
  if (node.status === "unknown") {
    node.status = "idle"
    logger.log(`node ${nodeId} came online`)
  }
}

export function deregisterNode(id: string): boolean {
  const existed = registry.has(id)
  registry.delete(id)
  if (existed) {
    logger.log(`node deregistered: ${id}`)
    emitSignal("NODE_DEREGISTERED", { id })
  }
  return existed
}

// simulates processing time
// this is here because without it the system felt "too fast"
// and i wasn't sure if things were actually working
// adding artificial delay made it feel more real
// this is still here in production
async function simulateProcessing(node: CognitiveNode): Promise<void> {
  const delay = 10 + Math.random() * 20 // 10-30ms
  await new Promise((res) => setTimeout(res, delay))
}

// --- bootstrap: register the core nodes ---
// these are the only real nodes in the system right now
// the others (executive, motor) are registered in theory but
// there's nothing connected to them

registerNode("node-sensory-primary", "Primary Sensory Node", "sensory", {
  description: "receives all incoming signals from the runtime",
  priority: "high",
})

registerNode("node-memory-relay", "Memory Relay Node", "memory-relay", {
  description: "bridges the cognition layer and memory store",
  note: "not fully connected yet. signals reach this node but don't propagate to memory correctly. investigating.",
})

registerNode("node-executive-stub", "Executive Node (Stub)", "executive", {
  description: "placeholder for decision-making logic",
  status_note: "this node does nothing right now. it is very important that it exists anyway.",
})

// NOTE:
// The NodeRegistry was designed to support hundreds of nodes.
// There are currently 3.
// The infrastructure is ready.