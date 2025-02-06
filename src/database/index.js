import { Sequelize } from "sequelize";

import config from "../config/database";
import Customer from "../app/models/Customer";
import Contact from "../app/models/Contact";
import User from "../app/models/User";

const models = [Customer, Contact, User];
const env = process.env.NODE_ENV || "development";
const sequelizeConfig = config[env];

class Database {
  constructor() {
    this.connection = new Sequelize(sequelizeConfig);
    this.init();
  }

  init() {
    models.forEach((model) => model.init(this.connection));
    models.forEach(
      (model) => model.associate && model.associate(this.connection.models),
    );
  }
}

export default new Database();
