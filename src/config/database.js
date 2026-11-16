
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'postgres') {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false
        }
    );

} else {
    
sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './forensics.db',
    logging: false,
    pool: {
        afterCreate: (connection, callback) => {
            connection.run('PRAGMA foreign_keys = ON', (error) => {
                callback(error, connection);
            });
        }
    }
});

}

module.exports = sequelize;
