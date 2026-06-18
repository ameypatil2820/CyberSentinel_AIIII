import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "ABC Corporation",
    },
    supportEmail: {
      type: String,
      default: "security@abccybershield.com",
    },
    require2FA: {
      type: Boolean,
      default: true,
    },
    autoBlockIPs: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export default Setting;
