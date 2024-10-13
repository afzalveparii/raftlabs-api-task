import winston from 'winston';

const emojiMap: { [key in keyof typeof logger.levels]: string } = {
  error: '❌', 
  warn: '⚠️', 
  info: 'ℹ️', 
  debug: '🐛',
};

const customFormat = winston.format.printf(({ level, message, timestamp } ) => {
  const emoji = emojiMap[level] || 'ℹ️';
  return `${timestamp} ${emoji} [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    winston.format.json() // Use JSON format for file logging
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      customFormat 
    ),
  }));
}
