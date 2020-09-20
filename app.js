/**************REQUIRE nessesary libs*************/
require('dotenv').config();

const express = require('express')
const { ClickHouse } = require('clickhouse');
const redis = require("redis");
const bodyParser = require('body-parser')
/*************************************************/
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
  extended: true
}));

/*************************************************/
/**
 * Configure redis anc clickhouse connections
 */
const redisClient = redis.createClient({
    // eslint-disable-next-line no-undef
    url: process.env.REDIS_URL
});
redisClient.on("error", function(error) {
    console.log("reddis error:", error);
});

const clickhouse = new ClickHouse({
    // eslint-disable-next-line no-undef
    url: process.env.CLICKHOUSE_URL,
    // eslint-disable-next-line no-undef
    port: process.env.CLICKHOUSE_PORT,
    basicAuth: {
        // eslint-disable-next-line no-undef
        username: process.env.CLICKHOUSE_USERNAME,
        // eslint-disable-next-line no-undef
        password: process.env.CLICKHOUSE_PASSWORD,
    }
});
/*************************************************/

/*****************test redis work*****************/
const data = { name: "user1", phone: "+79109722771" };
redisClient.set("example_key", JSON.stringify(data), redis.print);
redisClient.get("example_key", function (err, reply) {
    // reply is null when the key is missing
    console.log(reply);
});
/*************************************************/

app.post('/v1/send', (req, res) => {
    console.log('Got body:', req.body);
    res.send({
        status: `ok`
    });
});
  
// eslint-disable-next-line no-undef
app.listen(process.env.HTTP_PORT, () => {
    // eslint-disable-next-line no-undef
    console.log(`Example app listening at ${process.env.HTTP_PORT} port`)
});