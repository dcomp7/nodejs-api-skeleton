"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "provider");
  },

  down(queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "provider", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
};
