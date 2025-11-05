import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["annual", "remote"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    managerApproved: { type: Boolean, default: null },
    hrApproved: { type: Boolean, default: null },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Auto-update status depending on approvals
requestSchema.pre("save", function (next) {
  if (this.type === "annual") {
    if (this.managerApproved === false || this.hrApproved === false)
      this.status = "rejected";
    else if (this.managerApproved && this.hrApproved) this.status = "approved";
    else this.status = "pending";
  }

  if (this.type === "remote") {
    if (this.hrApproved === false) this.status = "rejected";
    else if (this.hrApproved) this.status = "approved";
    else this.status = "pending";
  }

  next();
});

const Request = mongoose.model("Request", requestSchema);
export default Request;
