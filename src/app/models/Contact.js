import Sequelize, { Model } from "sequelize";

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        status: Sequelize.ENUM("active", "archived"),
        customer_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: "contacts",
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });
  }
}

export default Contact;
