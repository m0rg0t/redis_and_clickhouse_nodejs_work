# redis_and_clickhouse_nodejs_work
Test nodejs app which communicate with redis and clickhouse databases

Start app with npm start command
Start eslint using npm run eslint command

All env variables are set in .env file

REDIS_URL - url to redis database
HTTP_PORT - http port for interface of app
MAX_BUFFER_COUNT - maximum records in redis buffer
MAX_TIMEOUT_IN_MS - max timeout after we transfer data from redis buffer to clickhouse database
CLICKHOUSE_PORT - clickhouse datapase port
CLICKHOUSE_USERNAME - clickhouse database username
CLICKHOUSE_PASSWORD - clickhouse database password 
