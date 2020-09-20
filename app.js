/**************REQUIRE nessesary libs*************/
require('dotenv').config();

const express = require('express')
const { ClickHouse } = require('clickhouse');
const { nanoid } = require('nanoid');
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
redisClient.on("error", function (error) {
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

const clearRedisDb = async () => {
    const result = new Promise((resolve, reject) => {
        redisClient.flushdb(function (err, succeeded) {
            console.log(succeeded); // will be true if successfull
            if (!err) {
                resolve(succeeded);
            } else {
                reject(err);
            }
        });
    });
    return result;
}

app.get('/v1/clearRedisDb', async (req, res) => {
    try {
        let result = clearRedisDb();
        res.send({
            status: `ok`,
            result: result
        });
    } catch (clearDBError) {
        console.log("clearDBError", clearDBError);
        res.send({
            status: 'error',
            error: clearDBError.toString()
        })
    }
});

app.post('/v1/send', (req, res) => {
    console.log('Got body:', req.body);
    try {
        const { data } = req.body;

        const json = JSON.parse(data);
        const id = nanoid();
        redisClient.set(id, JSON.stringify(json), function (err, reply) {
            console.log("redis reply:", reply);
            redisClient.dbsize(function (err, dbsize) {
                console.log("redis dbsize", dbsize);
                res.send({
                    status: `ok`,
                    id: id,
                    dbsize: dbsize
                });
            });
        });

    } catch (ex) {
        console.log("error", ex);
        res.send({
            status: 'error',
            error: ex.toString()
        })
    }
});

// eslint-disable-next-line no-undef
app.listen(process.env.HTTP_PORT, () => {
    // eslint-disable-next-line no-undef
    console.log(`Example app listening at ${process.env.HTTP_PORT} port`)
});