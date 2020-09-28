const redisClearDb = async (redisClient) => {
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

const redisDbSize = async (redisClient) => {
    const result = new Promise((resolve, reject) => {
        redisClient.dbsize(function (err, dbsize) {
            console.log("redis dbsize", dbsize);
            if (!err) {
                resolve(dbsize);
            } else {
                reject(err);
            }
        });
    });
    return result;
}

module.exports.redisClearDb = redisClearDb;
module.exports.redisDbSize = redisDbSize;