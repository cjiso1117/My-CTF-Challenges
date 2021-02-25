require('dotenv').config();
const fetch = require('node-fetch');
if( process.env.DEV ) {
    console.log(`DEV Mode, set webhook ${process.env.DEVELOPMENT_WEBHOOK_HOST}/getUpdates`);
    fetch(`https://api.telegram.org/bot${process.env.BOT_API_KEY}/setWebhook?url=${process.env.DEVELOPMENT_WEBHOOK_HOST}/getUpdates`);
}else {
    console.log(`Producion Mode, set webhook ${process.env.PRODUCTION_WEBHOOK_URL}`);
    fetch(`https://api.telegram.org/bot${process.env.BOT_API_KEY}/setWebhook?url=${process.env.PRODUCTION_WEBHOOK_URL}`);
}