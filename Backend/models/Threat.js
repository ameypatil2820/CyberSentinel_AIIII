import mongoose from "mongoose";

const ThreatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Threat type is required"],
      trim: true,
    },
    source: {
      type: String,
      required: [true, "Threat source is required"],
      trim: true,
    },
    target: {
      type: String,
      required: [true, "Threat target is required"],
      trim: true,
    },
    severity: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "Severity must be either Low, Medium, High, or Critical",
      },
      required: [true, "Threat severity is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Mitigated", "Resolved"],
        message: "Status must be either Active, Mitigated, or Resolved",
      },
      default: "Active",
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

const Threat = mongoose.models.Threat || mongoose.model("Threat", ThreatSchema);

export default Threat;
export { Threat };
