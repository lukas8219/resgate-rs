import winston from 'winston';

const { colorize, timestamp, align, printf, combine } = winston.format;

export default winston.createLogger({
    format: combine(
        colorize({ all: true }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports:[
        new winston.transports.Console(),
    ]
});