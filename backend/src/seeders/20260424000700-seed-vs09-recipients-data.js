"use strict";

const RECIPIENTS = [
  { email: "vs09-jane@example.com", name: "Jane Recipient" },
  { email: "vs09-alex@example.com", name: "Alex Recipient" }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    for (const recipient of RECIPIENTS) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO recipients (id, email, name, created_at)
        VALUES (gen_random_uuid(), :email, :name, NOW())
        ON CONFLICT (email)
        DO UPDATE SET name = EXCLUDED.name
        `,
        {
          replacements: recipient
        }
      );
    }
  },

  async down(queryInterface) {
    for (const recipient of RECIPIENTS) {
      await queryInterface.sequelize.query(
        `
        DELETE FROM recipients
        WHERE email = :email
        `,
        { replacements: { email: recipient.email } }
      );
    }
  }
};
