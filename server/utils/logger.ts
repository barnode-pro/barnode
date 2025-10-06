/**
 * Logger minimale per BarNode API
 * Logging strutturato per development e production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data })
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.formatMessage(level, message, data);
    
    if (this.isDevelopment) {
      // Console colorato per development
      const colors = {
        info: '\x1b[36m',    // Cyan
        warn: '\x1b[33m',    // Yellow
        error: '\x1b[31m',   // Red
        debug: '\x1b[90m'    // Gray
      };
      
      console.log(
        `${colors[level]}[${entry.timestamp}] ${level.toUpperCase()}: ${message}\x1b[0m`,
        data ? data : ''
      );
    } else {
      // JSON strutturato per production
      console.log(JSON.stringify(entry));
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }
}

export const logger = new Logger();
