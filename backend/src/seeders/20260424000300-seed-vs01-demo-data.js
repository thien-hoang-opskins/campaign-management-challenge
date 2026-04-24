"use strict";

const bcrypt = require("bcryptjs");

const VS01_USER_EMAIL = "operator@example.com";
const VS01_USER_NAME = "Demo Operator";
const VS01_USER_PASSWORD = "password123";

const VS01_CAMPAIGN_NAME = "VS-01 Demo Campaign";
const VS01_CAMPAIGN_SUBJECT = "Welcome to the demo campaign";
const VS01_CAMPAIGN_BODY =
  "This draft campaign is seeded for the VS-01 login and protected route flow.";

const VS01_RECIPIENTS = ["jane.doe@example.com", "john.doe@example.com"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash(VS01_USER_PASSWORD, 10);

    await queryInterface.sequelize.query(
      `
      INSERT INTO users (id, email, name, password_hash, created_at)
      VALUES (gen_random_uuid(), :email, :name, :passwordHash, NOW())
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash
      `,
      {
        replacements: {
          email: VS01_USER_EMAIL,
          name: VS01_USER_NAME,
          passwordHash
        }
      }
    );

    await queryInterface.sequelize.query(
      `
      INSERT INTO campaigns (id, name, subject, body, status, created_by, created_at, updated_at)
      SELECT gen_random_uuid(), :name, :subject, :body, 'draft', u.id, NOW(), NOW()
      FROM users u
      WHERE u.email = :email
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
          email: VS01_USER_EMAIL,
          name: VS01_CAMPAIGN_NAME,
          subject: VS01_CAMPAIGN_SUBJECT,
          body: VS01_CAMPAIGN_BODY
        }
      }
    );

    for (const recipientEmail of VS01_RECIPIENTS) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO recipients (id, email, name, created_at)
        VALUES (gen_random_uuid(), :email, NULL, NOW())
        ON CONFLICT (email)
        DO NOTHING
        `,
        { replacements: { email: recipientEmail } }
      );

      await queryInterface.sequelize.query(
        `
        INSERT INTO campaign_recipients (campaign_id, recipient_id, sent_at, opened_at, status)
        SELECT c.id, r.id, NULL, NULL, 'pending'
        FROM campaigns c
        JOIN users u ON u.id = c.created_by
        JOIN recipients r ON r.email = :recipientEmail
        WHERE u.email = :userEmail
          AND c.name = :campaignName
          AND c.subject = :campaignSubject
        ON CONFLICT (campaign_id, recipient_id)
        DO NOTHING
        `,
        {
          replacements: {
            recipientEmail,
            userEmail: VS01_USER_EMAIL,
            campaignName: VS01_CAMPAIGN_NAME,
            campaignSubject: VS01_CAMPAIGN_SUBJECT
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
        AND u.email = :email
        AND c.name = :name
        AND c.subject = :subject
      `,
      {
        replacements: {
          email: VS01_USER_EMAIL,
          name: VS01_CAMPAIGN_NAME,
          subject: VS01_CAMPAIGN_SUBJECT
        }
      }
    );

    await queryInterface.sequelize.query(
      `
      DELETE FROM campaigns c
      USING users u
      WHERE c.created_by = u.id
        AND u.email = :email
        AND c.name = :name
        AND c.subject = :subject
      `,
      {
        replacements: {
          email: VS01_USER_EMAIL,
          name: VS01_CAMPAIGN_NAME,
          subject: VS01_CAMPAIGN_SUBJECT
        }
      }
    );

    await queryInterface.sequelize.query(
      `
      DELETE FROM recipients
      WHERE email IN (:recipient1, :recipient2)
      `,
      {
        replacements: {
          recipient1: VS01_RECIPIENTS[0],
          recipient2: VS01_RECIPIENTS[1]
        }
      }
    );

    await queryInterface.sequelize.query(
      `
      DELETE FROM users
      WHERE email = :email
      `,
      {
        replacements: { email: VS01_USER_EMAIL }
      }
    );
  }
};
