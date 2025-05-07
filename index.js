require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const DB = require('./config/db');
const { updateFeaturedPosts } = require('./controller/post');
const PORT = 3000 || process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
DB();
const nuvia = "/nuvia/v1";
app.use(`${nuvia}/api/auth`, require('./router/auth'));
app.use(`${nuvia}/api/content`, require('./router/content'));
app.use(`${nuvia}/api/post`, require('./router/post'));
app.use(`${nuvia}/api/post/interaction`, require('./router/post_interaction'));
app.use(`${nuvia}/api/user`, require('./router/user'));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

cron.schedule('* * * * *', async () => {
    try {
        console.log('تحديث المحتوى المميز...');
        await updateFeaturedPosts();
    } catch (error) {
        console.error("خطأ في تحديث المحتوى المميز:", error);
    }
});