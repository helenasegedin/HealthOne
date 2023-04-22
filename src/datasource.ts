import { DataSource } from "typeorm";
import { config } from './config';
import { Article } from "./entities/Patient"
import { Author } from "./entities/Author";

// andmebaasiühenduse konfiguratsioon
const defaultDataSource = new DataSource({
    type: "mysql",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username, // productionis ei soovitata kasutada kasutajanime "root"
    password: config.database.password,
    database: config.database.db,
    entities: [Article, Author],
    synchronize: true,
});

// kontrollime, kas andmebaasi ühendust on võimalik luua
defaultDataSource
  .initialize()
  .then(() => {
    console.log("Database initialized...");
})
  .catch((err) => {
    console.log("Error initializing database", err);
});

export default defaultDataSource;