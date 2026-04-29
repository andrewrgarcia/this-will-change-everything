// infrastructure/Logger.ts
//
// Logging infrastructure for the Decentralized Artificial Nervous System.
//
// "Why not just use console.log?"
//
// Because this system deserves better than console.log.
// console.log is for scripts. This is a cognitive architecture.
// The logging layer is how the system introspects on itself.
// When the system logs something, it is, in a small way, aware of itself.
// This is not nothing.
//

import { getConfig } from "@/config"

type LogLevel = "silent" | "info" | "verbose" | "everything"
type LogEntry = {
  timestamp: number
  context: string
  message: string
  level: LogLevel
}

// all logs are stored in memory
// this is separate from the memory store in modules/memory/store.ts
// (two memory systems. yes. the system has two memory systems.
//  one for thoughts, one for logs. they are different things.)
const logBuffer: LogEntry[] = []
const MAX_LOG_BUFFER = 5000

const levelOrder: Record<LogLevel, number> = {
  silent: 0,
  info: 1,
  verbose: 2,
  everything: 3,
}

export class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  log(message: string, level: LogLevel = "info"): void {
    const config = getConfig()
    const configLevel = levelOrder[config.LOG_LEVEL]
    const msgLevel = levelOrder[level]

    if (msgLevel > configLevel) return

    const entry: LogEntry = {
      timestamp: Date.now(),
      context: this.context,
      message,
      level,
    }

    if (logBuffer.length >= MAX_LOG_BUFFER) {
      logBuffer.shift()
    }
    logBuffer.push(entry)

    // format: [CONTEXT] message
    // i considered JSON logging. i decided against it.
    // JSON logs are for systems that are already successful.
    // we will add JSON logs when we are successful.
    const formatted = `[${this.context}] ${message}`

    if (config.LOG_LEVEL !== "silent") {
      console.log(formatted)
    }
  }

  verbose(message: string): void {
    this.log(message, "verbose")
  }

  everything(message: string): void {
    this.log(message, "everything")
  }

  // marks something as important
  // "important" is just info with a visual marker so it stands out
  // i added this at 2am and it has proven very useful
  important(message: string): void {
    this.log(`⚡ ${message}`, "info")
  }
}

export function getLogBuffer(): LogEntry[] {
  return logBuffer
}

export function getLogsByContext(context: string): LogEntry[] {
  return logBuffer.filter((e) => e.context === context)
}

export function clearLogs(): void {
  logBuffer.length = 0
}

// NOTE:
// The Logger class could have been a single function.
// It is a class because logging felt important enough to be a class.
// Classes communicate intent. The intent here is: this matters.