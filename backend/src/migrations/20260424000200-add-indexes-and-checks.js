"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "users_email_unique_idx"
    });

    await queryInterface.addIndex("campaigns", ["created_by", "created_at"], {
      name: "campaigns_created_by_created_at_idx"
    });

    await queryInterface.addIndex("campaigns", ["status", "scheduled_at"], {
      name: "campaigns_status_scheduled_at_idx"
    });

    await queryInterface.addIndex("campaign_recipients", ["campaign_id", "status"], {
      name: "campaign_recipients_campaign_status_idx"
    });

    await queryInterface.addIndex("campaign_recipients", ["campaign_id", "opened_at"], {
      name: "campaign_recipients_campaign_opened_idx"
    });

    await queryInterface.addConstraint("campaigns", {
      fields: ["status"],
      type: "check",
      where: {
        status: {
          [Sequelize.Op.in]: ["draft", "scheduled", "sent"]
        }
      },
      name: "campaigns_status_check"
    });

    await queryInterface.addConstraint("campaign_recipients", {
      fields: ["status"],
      type: "check",
      where: {
        status: {
          [Sequelize.Op.in]: ["pending", "sent", "failed"]
        }
      },
      name: "campaign_recipients_status_check"
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE campaign_recipients
      ADD CONSTRAINT campaign_recipients_opened_not_before_sent_check
      CHECK (opened_at IS NULL OR sent_at IS NULL OR opened_at >= sent_at)
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE campaign_recipients
      DROP CONSTRAINT IF EXISTS campaign_recipients_opened_not_before_sent_check
    `);
    await queryInterface.removeConstraint("campaign_recipients", "campaign_recipients_status_check");
    await queryInterface.removeConstraint("campaigns", "campaigns_status_check");
    await queryInterface.removeIndex("campaign_recipients", "campaign_recipients_campaign_opened_idx");
    await queryInterface.removeIndex("campaign_recipients", "campaign_recipients_campaign_status_idx");
    await queryInterface.removeIndex("campaigns", "campaigns_status_scheduled_at_idx");
    await queryInterface.removeIndex("campaigns", "campaigns_created_by_created_at_idx");
    await queryInterface.removeIndex("users", "users_email_unique_idx");
  }
};
