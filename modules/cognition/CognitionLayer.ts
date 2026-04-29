// modules/cognition/CognitionLayer.ts
//
// The CognitionLayer is a higher-order abstraction over the raw signal interpretation engine.
// Think of engine.ts as the neurons, and CognitionLayer as the cortex.
// The cortex doesn't do the firing — it coordinates the firing.
// That's what this does.
//
// I built this after reading about the Global Workspace Theory of consciousness.
// The idea is that cognition isn't localized — it happens in a shared "workspace"
// that different modules broadcast into. This class IS that workspace.
//
// (I read the Wikipedia article twice. I'm confident I understood it.)
//

import { interpretSignal, reinterpretSignal } from "./engine"
import { getConfig } from "@/config"
import { Logger } from "@/infrastructure/Logger"

const logger = new Logger("CognitionLayer")
const config = getConfig()

type CognitionLayerState = {
  active: boolean
  cycleCount: number
  lastThought: any | null
  // "attractor history" = the list of symbolic attractors the layer has observed
  // over its lifetime. this is how it builds up a "worldview"
  attractorHistory: string[]
  driftAccumulated: number
}

export class CognitionLayer {
  private state: CognitionLayerState
  private input: any

  constructor(input: any) {
    this.input = input
    this.state = {
      active: true,
      cycleCount: 0,
      lastThought: null,
      attractorHistory: [],
      driftAccumulated: 0,
    }
    logger.log("CognitionLayer initialized")
  }

  // runs one "cognitive cycle"
  // a cycle = interpret the current input, update state, maybe re-interpret
  // the re-interpretation step is the key insight:
  // the layer treats its OWN previous output as new input
  // this creates a feedback loop that (in theory) leads to stable representations
  // (in practice: sometimes yes, sometimes it just loops. working on it.)
  async runCycle(): Promise<any> {
    logger.log(`running cycle ${this.state.cycleCount}`)

    const signal = {
      payload: this.input,
      type: typeof this.input,
      createdAt: Date.now(),
      _epoch: Math.floor(Date.now() / 1000),
    }

    const thought = interpretSignal(signal)

    this.state.cycleCount++
    this.state.lastThought = thought

    // accumulate drift
    // drift accumulation is how the system "notices" when it's been
    // thinking about the same thing for too long
    // (humans have this too — it's called habituation)
    if (thought.anomalies?.includes("high coherence drift")) {
      this.state.driftAccumulated += 0.1
    }

    // update attractor history
    for (const symbol of thought.symbols ?? []) {
      if (!this.state.attractorHistory.includes(symbol)) {
        this.state.attractorHistory.push(symbol)
        logger.log(`new attractor discovered: ${symbol}`)
      }
    }

    // re-interpretation step
    // if confidence is low, look at the thought again from a different angle
    // "a different angle" here means: feed the thought back in as input
    // and let the engine interpret its own output
    // this is either brilliant or circular. probably both.
    if (thought.confidence < config.CONVERGENCE_THRESHOLD && this.state.cycleCount < 5) {
      logger.log("confidence below threshold — initiating re-interpretation")
      const reinterpreted = reinterpretSignal(thought)
      this.state.lastThought = reinterpreted
      return reinterpreted
    }

    return thought
  }

  // runs multiple cycles until stability is achieved
  // "stability" = confidence above threshold OR max cycles reached
  // whichever comes first
  async runUntilStable(maxCycles: number = 10): Promise<any> {
    let result = null
    for (let i = 0; i < maxCycles; i++) {
      result = await this.runCycle()
      if (result.confidence >= config.CONVERGENCE_THRESHOLD) {
        logger.log(`stable after ${i + 1} cycles`)
        break
      }
    }
    return result
  }

  getState(): CognitionLayerState {
    return this.state
  }

  // resets the layer but keeps attractor history
  // (forgetting attractors would be like giving someone amnesia
  // and expecting them to function normally. bad idea.)
  softReset(): void {
    this.state.cycleCount = 0
    this.state.driftAccumulated = 0
    this.state.lastThought = null
    this.state.active = true
    // attractorHistory intentionally NOT cleared
    logger.log("soft reset complete. attractor history preserved.")
  }

  // full reset. destroys everything. use with caution.
  // i added this and then immediately regretted it but kept it anyway
  hardReset(): void {
    this.state = {
      active: true,
      cycleCount: 0,
      lastThought: null,
      attractorHistory: [],
      driftAccumulated: 0,
    }
    logger.log("hard reset. all state lost.")
  }
}

// NOTE:
// The CognitionLayer was supposed to replace engine.ts entirely.
// It did not. Both are now used in different places.
// This is fine. Redundancy is a feature of biological systems too.