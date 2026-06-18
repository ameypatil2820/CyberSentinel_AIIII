import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Alert message text is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["info", "warning", "critical"],
        message: "Alert type must be either info, warning, or critical",
      },
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.models.Alert || mongoose.model("Alert", AlertSchema);

export default Alert;
export { Alert };
