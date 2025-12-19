module.exports = {
  schemaPath: "./src/model", // folder containing your JS models
  migrationsPath: "./migrations", // auto generated migrations go here
  seedsPath: "./seeds",
  database: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
};
