"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        email: "baongo610ttttttt@gmail.com",
        password: "123456",
        firstName: "Bao",
        lastName: "Ngo",
        phoneNumber: "0397155365",
        address: "Ta Thanh Oai",
        roleId: "R1",
        image: "hehe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
