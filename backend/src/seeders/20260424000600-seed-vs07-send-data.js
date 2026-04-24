"use strict";

const OWNER_EMAIL = "operator@example.com";
const CAMPAIGN_NAME = "VS-07 Send Campaign";
const CAMPAIGN_SUBJECT = "Send flow finality verification";
const CAMPAIGN_BODY = "Draft campaign seeded for VS-07 send behavior.";

const RECIPIENTS = ["send-ok@example.com", "send-fail@example.com"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `
      INSERT INTO campaigns (id, name, subject, body, status, scheduled_at, created_by, created_at, updated_at)
      SELECT gen_random_uuid(), :name, :subject, :body, 'draft', NULL, u.id, NOW(), NOW()
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
          name: CAMPAIGN_NAME,
          subject: CAMPAIGN_SUBJECT,
          body: CAMPAIGN_BODY
        }
      }
    );

    for (const email of RECIPIENTS) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO recipients (id, email, name, created_at)
        VALUES (gen_random_uuid(), :email, NULL, NOW())
        ON CONFLICT (email)
        DO NOTHING
        `,
        {
          replacements: { email }
        }
      );

      await queryInterface.sequelize.query(
        `
        INSERT INTO campaign_recipients (campaign_id, recipient_id, sent_at, opened_at, status)
        SELECT c.id, r.id, NULL, NULL, 'pending'
        FROM campaigns c
        JOIN users u ON u.id = c.created_by
        JOIN recipients r ON r.email = :email
        WHERE u.email = :ownerEmail
          AND c.name = :campaignName
          AND c.subject = :campaignSubject
        ON CONFLICT (campaign_id, recipient_id)
        DO UPDATE SET
          sent_at = NULL,
          opened_at = NULL,
          status = 'pending'
        `,
        {
          replacements: {
            ownerEmail: OWNER_EMAIL,
            campaignName: CAMPAIGN_NAME,
            campaignSubject: CAMPAIGN_SUBJECT,
            email
          }
        }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `
      DELETE FROM campaign_recipients cr
      USING campaigns c, users u
      WHERE cr.campaign_id = c.id
        AND c.created_by = u.id
        AND u.email = :ownerEmail
        AND c.name = :name
        AND c.subject = :subject
      `,
      {
        replacements: {
          ownerEmail: OWNER_EMAIL,
          name: CAMPAIGN_NAME,
          subject: CAMPAIGN_SUBJECT
        }
      }
    );

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
          name: CAMPAIGN_NAME,
          subject: CAMPAIGN_SUBJECT
        }
      }
    );

    for (const email of RECIPIENTS) {
      await queryInterface.sequelize.query(
        `
        DELETE FROM recipients
        WHERE email = :email
        `,
        {
          replacements: { email }
        }
      );
    }
  }
};
