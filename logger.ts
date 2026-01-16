/**
 * Logger Service - Gestión de logs con colores
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

class Logger {
  private static readonly PREFIX = 'BlanquitaIA';
  private static logHistory: Array<{ timestamp: string; level: LogLevel; message: string }> = [];
  private static maxHistorySize = 100;

  private static getStyles(level: LogLevel): { bg: string; text: string; emoji: string } {
    const styles = {
      [LogLevel.DEBUG]: { bg: '#8B5CF6', text: '#FFF', emoji: '🔧' },
      [LogLevel.INFO]: { bg: '#3B82F6', text: '#FFF', emoji: 'ℹ️' },
      [LogLevel.SUCCESS]: { bg: '#10B981', text: '#FFF', emoji: '✅' },
      [LogLevel.WARNING]: { bg: '#F59E0B', text: '#000', emoji: '⚠️' },
      [LogLevel.ERROR]: { bg: '#EF4444', text: '#FFF', emoji: '❌' },
    };
    return styles[level];
  }

  private static log(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const styles = this.getStyles(level);
    const prefix = `%c${this.PREFIX}%c ${level}`;
    const prefixStyles = [
      `background: ${styles.bg}; color: ${styles.text}; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;`,
      `color: ${styles.bg}; font-weight: bold; font-size: 11px;`,
    ];

    console.log(
      prefix + ` [${timestamp}] %c${message}`,
      ...prefixStyles,
      'color: inherit; font-size: 12px;'
    );

    if (data) {
      console.log('📦 Data:', data);
    }

    // Add to history
    this.logHistory.push({ timestamp, level, message });
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  static debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  static info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  static success(message: string, data?: unknown): void {
    this.log(LogLevel.SUCCESS, message, data);
  }

  static warning(message: string, data?: unknown): void {
    this.log(LogLevel.WARNING, message, data);
  }

  static error(message: string, error?: unknown): void {
    this.log(LogLevel.ERROR, message, error);
  }

  static group(name: string): void {
    console.group(`%c${this.PREFIX} - ${name}`, 'font-weight: bold; color: #10B981;');
  }

  static groupEnd(): void {
    console.groupEnd();
  }

  static getHistory(): Array<{ timestamp: string; level: LogLevel; message: string }> {
    return [...this.logHistory];
  }

  static printHistory(): void {
    this.group('Log History');
    this.logHistory.forEach((log) => {
      console.log(`[${log.timestamp}] ${log.level}: ${log.message}`);
    });
    this.groupEnd();
  }

  static clear(): void {
    this.logHistory = [];
    console.clear();
    this.info('Console cleared');
  }
}

export default Logger;
