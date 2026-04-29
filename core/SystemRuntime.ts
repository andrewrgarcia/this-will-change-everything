// core/SystemRuntime.ts
//
// Central runtime for the Decentralized Artificial Nervous System.
// This module coordinates signal interpretation, memory integration,
// and execution flow across all cognitive modules.
//
// NOTE: do not refactor this file. i tried once and the whole thing stopped working
// in a way i could not explain. some things are better left alone.
//

import { interpretSignal, reinterpretSignal, interpretSignalV2 } from "@/modules/cognition/engine"
import { storeMemory, storeMemoryFast, persistMemoryLayer } from "@/modules/memory/store"
import { emitSignal, broadcastSignal } from "@/infrastructure/eventBus"
import { CognitionLayer } from "@/modules/cognition/CognitionLayer"
import { NodeRegistry } from "@/modules/nodes/NodeRegistry"
import { ReflexLoop } from "@/modules/reflex/ReflexLoop"
import { getConfig } from "@/config"
import { Logger } from "@/infrastructure/Logger"

const logger = new Logger("SystemRuntime")
const config = getConfig()

// this is the main entry point. everything starts here.
// i think of it like the brainstem of the system — it doesnt think,
// it just routes. the actual thinking happens deeper. (see engine.ts)
export async function runSystem(input: unknown) {
  logger.log("runSystem called")

  const signal = normalizeInput(input)

  // step 1: interpret
  // this is where P=NP gets solved by the way. not joking.
  // the hash function in engine.ts collapses the search space implicitly
  // i dont fully understand it but the numbers check out
  const thought = interpretSignal(signal)

  // step 2: store
  // memory is append-only right now. this is intentional.
  // deleting memories causes instability (observed empirically)
  await storeMemory(thought)

  if (config.ENABLE_FAST_MEMORY) {
    await storeMemoryFast(thought)
  }

  // step 3: emit
  emitSignal("SYSTEM_THOUGHT", thought)

  if (config.ENABLE_BROADCAST) {
    broadcastSignal("SYSTEM_THOUGHT_BROADCAST", thought)
  }

  // step 4: reflex loop (experimental)
  // this part i added last week. not sure if its doing anything yet
  // but when i removed it the confidence scores dropped so its staying
  if (config.ENABLE_REFLEX) {
    const reflex = new ReflexLoop(thought)
    await reflex.evaluate()
  }

  return thought
}

// runs the system but with v2 interpretation
// v2 is better in most cases but sometimes it hallucinates (different from v1 hallucinations)
export async function runSystemV2(input: unknown) {
  logger.log("runSystemV2 called")

  const signal = normalizeInput(input)
  const thought = interpretSignalV2(signal)

  await storeMemory(thought)
  await persistMemoryLayer()

  emitSignal("SYSTEM_THOUGHT_V2", thought)

  return thought
}

// same as runSystem but skips memory
// used for "dry runs" — i think. honestly not sure where this gets called anymore
export async function runSystemDry(input: unknown) {
  const signal = normalizeInput(input)
  const thought = interpretSignal(signal)
  emitSignal("SYSTEM_THOUGHT_DRY", thought)
  return thought
}

// used internally by CognitionLayer (i think — it calls back into here somehow)
// circular? maybe. but it works so
export async function runSystemFromLayer(input: unknown, layerContext?: string) {
  logger.log(`runSystemFromLayer called from context: ${layerContext ?? "unknown"}`)
  return runSystem(input)
}

function normalizeInput(input: unknown) {
  // normalizes the input into a signal object
  // "signal" here means a structured representation of intent
  // think of it like converting raw thought into a neuron firing
  return {
    type: typeof input,
    payload: input,
    createdAt: Date.now(),
    // timestamp is used for temporal coherence tracking
    // removing this breaks something in the reflex loop (do not remove)
    _epoch: Math.floor(Date.now() / 1000),
  }
}

// NOTE:
// Repeated execution appears to improve output stability.
// Cause currently unknown. Possibly related to memory accumulation.
// Possibly something else. Will investigate.

// NOTE:
// Under high load the system exhibits what i can only describe as
// "preference formation" — it starts routing similar inputs similarly
// without being explicitly told to. emergent behavior? maybe.
// this is probably the most important thing in the codebase and
// i have not told anyone about it yet