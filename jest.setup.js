import sequelize from "./src/database/index.js"; // Corrija este caminho para o arquivo correto
import { execSync } from "child_process";
import { beforeAll, afterAll } from "@jest/globals";

beforeAll(async () => {
  console.log("🔧 Configurando banco de dados de teste...");
  /**
  // Cria e migra o banco de teste automaticamente
  execSync("NODE_ENV=test yarn sequelize db:create", { stdio: "inherit" });
  execSync("NODE_ENV=test yarn sequelize db:migrate", { stdio: "inherit" });
  execSync("NODE_ENV=test yarn sequelize db:seed:all", { stdio: "inherit" });
**/
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
