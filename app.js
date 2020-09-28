/**************REQUIRE nessesary libs*************/
require('dotenv').config();

const express = require('express')
//const { ClickHouse } = require('clickhouse');
const { nanoid } = require('nanoid');
const redis = require("redis");
const bodyParser = require('body-parser');

const { connectToClickhouse, createTable } = require('./helpers/db/clickhouse');
const { redisClearDb, redisDbSize } = require('./helpers/db/redis');
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

const clickhouse = connectToClickhouse();
/*************************************************/

/*****************test redis work*****************/
const data = { name: "Anton Lenev", phone: "+79109722771" };
redisClient.set("example_key", JSON.stringify(data), redis.print);
redisClient.get("example_key", function (err, reply) {
    // reply is null when the key is missing
    console.log(reply);
});
/*************************************************/

app.get('/v1/clearRedisDb', async (req, res) => {
    try {
        let result = await redisClearDb(redisClient);
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
        redisClient.set(id, JSON.stringify(json), async function (err, reply) {
            console.log("redis reply:", reply);
            try {
                const dbsize = await redisDbSize(redisClient);
                let clearBuffer = false;
                // eslint-disable-next-line no-undef
                if (dbsize >= process.env.MAX_BUFFER_COUNT) {
                    clearBuffer = true;
                }
                res.send({
                    status: `ok`,
                    id: id,
                    clearBuffer: clearBuffer,
                    dbsize: dbsize
                });
            } catch (dbSizeError) {
                console.log(dbSizeError);
            }
        });

    } catch (ex) {
        console.log("error", ex);
        res.send({
            status: 'error',
            error: ex.toString()
        })
    }
});

const periodicDatabaseCheckStart = () => {
    console.log("periodicDatabaseCheckStart initialized");
    const interval = setInterval(async () => {
        console.log("periodic check started");
        const result = await redisClearDb(redisClient);
        console.log("periodic check redis clear", result);
        // eslint-disable-next-line no-undef
    }, process.env.MAX_TIMEOUT_IN_MS);
    return interval;
}

// eslint-disable-next-line no-undef
app.listen(process.env.HTTP_PORT, () => {
    // eslint-disable-next-line no-undef
    console.log(`Example app listening at ${process.env.HTTP_PORT} port`)
});

periodicDatabaseCheckStart();
(async () => {
    try {
        let createResult = await createTable(clickhouse);
        console.log("clickhouse DB create result", createResult);
    } catch (ex) {
        console.log(ex);
    }
})();
