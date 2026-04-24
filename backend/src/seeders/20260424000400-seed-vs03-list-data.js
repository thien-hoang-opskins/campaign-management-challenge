"use strict";

const OWNER_EMAIL = "operator@example.com";

const CAMPAIGNS = [
  {
    name: "VS-03 Draft Campaign",
    subject: "Draft status example",
    body: "Draft campaign used for list badge verification.",
    status: "draft",
    scheduledAt: null
  },
  {
    name: "VS-03 Scheduled Campaign",
    subject: "Scheduled status example",
    body: "Scheduled campaign used for list badge verification.",
    status: "scheduled",
    scheduledAt: "2030-01-01T10:00:00.000Z"
  },
  {
    name: "VS-03 Sent Campaign",
    subject: "Sent status example",
    body: "Sent campaign used for list badge verification.",
    status: "sent",
    scheduledAt: null
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    for (const campaign of CAMPAIGNS) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO campaigns (id, name, subject, body, status, scheduled_at, created_by, created_at, updated_at)
        SELECT gen_random_uuid(), :name, :subject, :body, :status, :scheduledAt, u.id, NOW(), NOW()
        FROM users u
        WHERE u.email = :ownerEmail
          AND NOT EXISTS (
            SELECT 1
            FROM campaigns c
            WHERE c.created_by = u.id
              AND c.name = :name
              AND c.subject = :subject
          )
        `,
        {
          replacements: {
            ownerEmail: OWNER_EMAIL,
            ...campaign
          }
        }
      );
    }
  },

  async down(queryInterface) {
    for (const campaign of CAMPAIGNS) {
      await queryInterface.sequelize.query(
        `
        DELETE FROM campaigns c
        USING users u
        WHERE c.created_by = u.id
          AND u.email = :ownerEmail
          AND c.name = :name
          AND c.subject = :subject
        `,
        {
          replacements: {
            ownerEmail: OWNER_EMAIL,
            name: campaign.name,
            subject: campaign.subject
          }
        }
      );
    }
  }
};
