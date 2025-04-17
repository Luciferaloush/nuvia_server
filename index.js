require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DB = require('./config/db');
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

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});