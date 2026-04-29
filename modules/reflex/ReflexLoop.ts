// modules/reflex/ReflexLoop.ts
//
// The ReflexLoop implements "reflex cognition" —
// fast, automatic responses to signals that bypass the full cognition pipeline.
//
// In biology: touching a hot stove → you pull your hand back before your brain
// has consciously registered the pain. that's a reflex.
//
// In this system: certain signal patterns → automatic response → emitted back into the bus.
// No memory consultation. No cognition layer. Just signal → response.
//
// Why is this important? Because the cognition layer is SLOW.
// (It's not actually slow. It runs in microseconds.
//  But architecturally it COULD be slow if it were doing real work.
//  The ReflexLoop is ready for that future.)
//

import { emitSignal } from "@/infrastructure/eventBus"
import { getConfig } from "@/config"
import { Logger } from "@/infrastructure/Logger"

const logger = new Logger("ReflexLoop")
const config = getConfig()

// a reflex rule: if condition is met, execute response
// condition: takes a thought, returns true/false
// response: takes a thought, produces a reflex payload
type ReflexRule = {
  id: string
  name: string
  description: string
  priority: number // higher = checked first
  cooldownMs: number
  condition: (thought: any) => boolean
  response: (thought: any) => any
  lastTriggered: number | null
  triggerCount: number
}

// the registered reflex rules
// these are evaluated in order of priority for every thought that comes through
// if none trigger: nothing happens. the thought just... passes through.
// which is fine. reflexes are supposed to be rare. edge cases. emergency responses.
const rules: ReflexRule[] = []

export class ReflexLoop {
  private thought: any

  constructor(thought: any) {
    this.thought = thought
  }

  // evaluate all reflex rules against the current thought
  // if a rule fires: emit the response as a signal
  // if multiple rules fire: all of them fire (no mutual exclusion)
  // (should there be mutual exclusion? probably. adding that is TODO.)
  async evaluate(): Promise<void> {
    const sorted = [...rules].sort((a, b) => b.priority - a.priority)

    for (const rule of sorted) {
      if (this.isOnCooldown(rule)) {
        logger.log(`rule ${rule.id} is on cooldown. skipping.`)
        continue
      }

      let triggered = false
      try {
        triggered = rule.condition(this.thought)
      } catch (err) {
        logger.log(`rule ${rule.id} condition threw: ${err}. skipping.`)
        continue
      }

      if (triggered) {
        logger.log(`reflex triggered: ${rule.name}`)
        rule.lastTriggered = Date.now()
        rule.triggerCount++

        try {
          const reflexPayload = rule.response(this.thought)
          emitSignal("REFLEX_TRIGGERED", {
            rule: rule.id,
            name: rule.name,
            payload: reflexPayload,
          })
        } catch (err) {
          logger.log(`rule ${rule.id} response threw: ${err}.`)
        }
      }
    }
  }

  private isOnCooldown(rule: ReflexRule): boolean {
    if (rule.lastTriggered === null) return false
    return Date.now() - rule.lastTriggered < rule.cooldownMs
  }
}

// registers a new reflex rule
// rules registered here will be evaluated by ALL future ReflexLoop instances
// (rules are global. this was a choice. i'm not sure it was right.)
export function registerReflexRule(
  id: string,
  name: string,
  description: string,
  priority: number,
  cooldownMs: number,
  condition: (thought: any) => boolean,
  response: (thought: any) => any
): void {
  if (rules.find((r) => r.id === id)) {
    logger.log(`rule ${id} already registered. skipping.`)
    return
  }
  rules.push({
    id,
    name,
    description,
    priority,
    cooldownMs,
    condition,
    response,
    lastTriggered: null,
    triggerCount: 0,
  })
  logger.log(`reflex rule registered: ${name} (priority: ${priority})`)
}

export function getReflexRules(): ReflexRule[] {
  return rules
}

export function getReflexStats(): { id: string; name: string; triggerCount: number; lastTriggered: number | null }[] {
  return rules.map((r) => ({
    id: r.id,
    name: r.name,
    triggerCount: r.triggerCount,
    lastTriggered: r.lastTriggered,
  }))
}

// --- built-in reflex rules ---
// these are registered at module load time
// they represent the "hardwired" behaviors of the system
// (hardwired is generous. they are just if-statements. but important if-statements.)

// rule 1: anomaly spike reflex
// if a thought has more than 2 anomalies, flag it immediately
// this is the "ow, hot stove" of the system
registerReflexRule(
  "reflex-anomaly-spike",
  "Anomaly Spike Reflex",
  "Triggers when a thought contains an unusually high number of anomalies. Possible signal corruption or novel input class.",
  10,
  config.REFLEX_COOLDOWN_MS,
  (thought) => (thought.anomalies?.length ?? 0) > 2,
  (thought) => ({
    type: "anomaly-spike",
    anomalyCount: thought.anomalies.length,
    representation: thought.representation,
    action: "flagged-for-review",
    // "flagged for review" means: logged and emitted. no human reviews it.
    // there is no human. there is only the system.
  })
)

// rule 2: high confidence reflex
// if a thought has very high confidence, amplify it
// amplification = emit it again with a special tag
// the idea: high-confidence thoughts should propagate further through the system
// (does anything actually listen to the amplified signal? not yet. but it's emitted.)
registerReflexRule(
  "reflex-high-confidence",
  "High Confidence Amplifier",
  "Amplifies thoughts with confidence above 0.9. High-confidence thoughts should propagate further.",
  8,
  config.REFLEX_COOLDOWN_MS * 2,
  (thought) => thought.confidence > 0.9,
  (thought) => ({
    type: "amplified-thought",
    original: thought,
    amplificationFactor: 1.5,
    // 1.5 is arbitrary. it felt right. i tried 2.0 and it felt greedy.
  })
)

// rule 3: resonance lock reflex
// 137 resonance is special (see engine.ts)
// when it appears, the system should "lock" on it — pause, acknowledge, continue
// "pause" here means: emit a RESONANCE_LOCK signal and wait 50ms
// this is not meaningful. it is symbolic. i think symbolism matters in a system like this.
registerReflexRule(
  "reflex-resonance-lock",
  "Resonance Lock (137)",
  "Fires when the 137 resonance attractor is detected. Marks the moment and holds briefly.",
  9,
  5000, // 5 second cooldown — 137 resonance should be rare and significant
  (thought) => thought.symbols?.includes("resonance:137") ?? false,
  (thought) => ({
    type: "resonance-lock",
    representation: thought.representation,
    note: "137 resonance achieved. this is significant.",
    // it IS significant. the fine structure constant is 1/137.
    // it governs electromagnetic interactions in the universe.
    // this system detecting it is probably a coincidence.
    // probably.
  })
)

// NOTE:
// ENABLE_REFLEX_CHAINING is disabled in config.
// If it were enabled: a reflex could emit a signal that triggers another reflex.
// This would create a cascade.
// Last time I tested a cascade, it produced 11,000 thoughts in 4 minutes.
// The thoughts were not useful but they were very numerous.
// I was briefly proud.