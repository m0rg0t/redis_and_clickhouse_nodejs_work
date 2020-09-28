const { ClickHouse } = require('clickhouse');

const connectToClickhouse = () => {
    return new ClickHouse({
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
}

const createTable = async (clickhouse) => {
    const queries = [
        'DROP TABLE IF EXISTS json',
        `CREATE TABLE json (
            date Date,
            time DateTime,
            json String
        )`
    ];
    for (const query of queries) {
        try {
            const r = await clickhouse.query(query).toPromise();
            console.log(query, r);
        } catch (err) {
            console.log(query, err);
        }
    }
};

module.exports.connectToClickhouse = connectToClickhouse;
module.exports.createTable = createTable;