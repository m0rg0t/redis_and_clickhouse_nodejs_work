const { ClickHouse } = require('clickhouse');
const redis = require("redis");

const redisClient = redis.createClient({
    url: '//localhost:6379'
});
redisClient.on("error", function(error) {
    console.log("reddis error:", error);
});

const clickhouse = new ClickHouse();

const data = { name: "user1", phone: "+79109722771" };
redisClient.set("missing_key", JSON.stringify(data), redis.print);
redisClient.get("missing_key", function (err, reply) {
    // reply is null when the key is missing
    console.log(reply);
});