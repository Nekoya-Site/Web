const env = process.env;

const config = {
    url: env.URL,
    host: env.HOST,
    port: env.PORT,
    db: {
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        connectTimeout: env.DB_TIMEOUT,
    },
    mail: {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        user: env.MAIL_USER,
        password: env.MAIL_PASSWORD
    },
    telegram: env.TG_BOT_TOKEN,
};

module.exports = config;