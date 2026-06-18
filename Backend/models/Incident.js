import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Incident title is required"],
      trim: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "Priority must be either Low, Medium, High, or Critical",
      },
      required: [true, "Incident priority is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "Investigating", "Mitigated", "Resolved"],
        message: "Status must be either Open, Investigating, Mitigated, or Resolved",
      },
      default: "Open",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: [
      {
        author: {
          type: String,
          required: [true, "Note author is required"],
        },
        text: {
          type: String,
          required: [true, "Note text is required"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.models.Incident || mongoose.model("Incident", IncidentSchema);

export default Incident;
export { Incident };
