const config = {
  development: {
    username: "postgres",
    password: "secret",
    database: "mydb",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  test: {
    username: "root",
    password: "password",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: "password",
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

//export default config;
module.exports = config;
