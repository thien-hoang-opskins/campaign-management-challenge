import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";
import { sequelize } from "./sequelize";

export type CampaignStatus = "draft" | "scheduled" | "sent";
export type CampaignRecipientStatus = "pending" | "sent" | "failed";

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare name: string;
  declare passwordHash: string;
  declare createdAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { field: "password_hash", type: DataTypes.STRING, allowNull: false },
    createdAt: { field: "created_at", type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: "users", updatedAt: false }
);

export class CampaignModel extends Model<
  InferAttributes<CampaignModel>,
  InferCreationAttributes<CampaignModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare subject: string;
  declare body: string;
  declare status: CampaignStatus;
  declare scheduledAt: Date | null;
  declare createdBy: ForeignKey<UserModel["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CampaignModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "sent"),
      allowNull: false,
      defaultValue: "draft"
    },
    scheduledAt: { field: "scheduled_at", type: DataTypes.DATE, allowNull: true },
    createdBy: { field: "created_by", type: DataTypes.UUID, allowNull: false },
    createdAt: { field: "created_at", type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { field: "updated_at", type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: "campaigns" }
);

export class RecipientModel extends Model<
  InferAttributes<RecipientModel>,
  InferCreationAttributes<RecipientModel>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare name: string | null;
  declare createdAt: CreationOptional<Date>;
}

RecipientModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: true },
    createdAt: { field: "created_at", type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: "recipients", updatedAt: false }
);

export class CampaignRecipientModel extends Model<
  InferAttributes<CampaignRecipientModel>,
  InferCreationAttributes<CampaignRecipientModel>
> {
  declare campaignId: ForeignKey<CampaignModel["id"]>;
  declare recipientId: ForeignKey<RecipientModel["id"]>;
  declare sentAt: Date | null;
  declare openedAt: Date | null;
  declare status: CampaignRecipientStatus;
}

CampaignRecipientModel.init(
  {
    campaignId: { field: "campaign_id", type: DataTypes.UUID, primaryKey: true },
    recipientId: { field: "recipient_id", type: DataTypes.UUID, primaryKey: true },
    sentAt: { field: "sent_at", type: DataTypes.DATE, allowNull: true },
    openedAt: { field: "opened_at", type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "sent", "failed"),
      allowNull: false,
      defaultValue: "pending"
    }
  },
  { sequelize, tableName: "campaign_recipients", createdAt: false, updatedAt: false }
);

CampaignModel.belongsTo(UserModel, { foreignKey: "createdBy", as: "owner" });
CampaignModel.belongsToMany(RecipientModel, {
  through: CampaignRecipientModel,
  foreignKey: "campaignId",
  otherKey: "recipientId",
  as: "recipients"
});
RecipientModel.belongsToMany(CampaignModel, {
  through: CampaignRecipientModel,
  foreignKey: "recipientId",
  otherKey: "campaignId",
  as: "campaigns"
});

CampaignRecipientModel.belongsTo(RecipientModel, {
  foreignKey: "recipientId",
  as: "recipient"
});
