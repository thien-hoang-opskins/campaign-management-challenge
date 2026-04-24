"use strict";

const OWNER_EMAIL = "operator@example.com";
const CAMPAIGN_NAME = "VS-04 Detail Campaign";
const CAMPAIGN_SUBJECT = "Detail and stats verification";
const CAMPAIGN_BODY = "Campaign seeded for VS-04 detail page and stats contract checks.";

const RECIPIENT_ROWS = [
  {
    email: "vs04-opened@example.com",
    status: "sent",
    sentAt: "2026-04-24T09:00:00.000Z",
    openedAt: "2026-04-24T10:00:00.000Z"
  },
  {
    email: "vs04-sent@example.com",
    status: "sent",
    sentAt: "2026-04-24T09:00:00.000Z",
    openedAt: null
  },
  {
    email: "vs04-failed@example.com",
    status: "failed",
    sentAt: null,
    openedAt: null
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `
      INSERT INTO campaigns (id, name, subject, body, status, scheduled_at, created_by, created_at, updated_at)
      SELECT gen_random_uuid(), :name, :subject, :body, 'sent', NULL, u.id, NOW(), NOW()
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

    for (const recipient of RECIPIENT_ROWS) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO recipients (id, email, name, created_at)
        VALUES (gen_random_uuid(), :email, NULL, NOW())
        ON CONFLICT (email)
        DO NOTHING
        `,
        {
          replacements: { email: recipient.email }
        }
      );

      await queryInterface.sequelize.query(
        `
        INSERT INTO campaign_recipients (campaign_id, recipient_id, sent_at, opened_at, status)
        SELECT c.id, r.id, :sentAt, :openedAt, :status
        FROM campaigns c
        JOIN users u ON u.id = c.created_by
        JOIN recipients r ON r.email = :email
        WHERE u.email = :ownerEmail
          AND c.name = :campaignName
          AND c.subject = :campaignSubject
        ON CONFLICT (campaign_id, recipient_id)
        DO UPDATE SET
          sent_at = EXCLUDED.sent_at,
          opened_at = EXCLUDED.opened_at,
          status = EXCLUDED.status
        `,
        {
          replacements: {
            ownerEmail: OWNER_EMAIL,
            campaignName: CAMPAIGN_NAME,
            campaignSubject: CAMPAIGN_SUBJECT,
            email: recipient.email,
            status: recipient.status,
            sentAt: recipient.sentAt,
            openedAt: recipient.openedAt
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

    for (const recipient of RECIPIENT_ROWS) {
      await queryInterface.sequelize.query(
        `
        DELETE FROM recipients
        WHERE email = :email
        `,
        {
          replacements: { email: recipient.email }
        }
      );
    }
  }
};
