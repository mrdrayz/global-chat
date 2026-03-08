type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  public info(message: string, data?: unknown): void {
    console.log(this.formatMessage("info", message), data ?? "");
  }

  public warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage("warn", message), data ?? "");
  }

  public error(message: string, data?: unknown): void {
    console.error(this.formatMessage("error", message), data ?? "");
  }

  public debug(message: string, data?: unknown): void {
    console.debug(this.formatMessage("debug", message), data ?? "");
  }
}

export const logger = new Logger();
