import Sequelize, { Model } from "sequelize";

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        status: {
          type: Sequelize.ENUM("active", "inactive"),
          allowNull: false,
          defaultValue: "active",
        },
      },
      {
        sequelize,
        tableName: "customers",
        timestamps: true,
        underscored: true,
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Contact, { foreignKey: "customer_id", as: "contacts" });
  }
}

export default Customer;
