import mongoose from "mongoose";

const GithubLinksSchema = new mongoose.Schema(
  {
    frontend: { type: String, default: "" },
    server: { type: String, default: "" },
    mobile: { type: String, default: "" },
  },
  { _id: false }
);

const LinksSchema = new mongoose.Schema(
  {
    website: { type: String, default: "" },
    playStore: { type: String, default: "" },
    appStore: { type: String, default: "" },
    desktop: { type: String, default: "" },
    github: { type: GithubLinksSchema, default: () => ({}) },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    role: { type: String, default: "" },
    image: { type: String, default: "" },
    isPrivate: { type: Boolean, default: false },
    isBeta: { type: Boolean, default: false },
    // Which portfolio pages this project appears on. "main" is the homepage.
    portfolios: {
      type: [String],
      default: ["main"],
      enum: ["main", "backend", "frontend", "mobile"],
    },
    order: { type: Number, default: 0 },
    links: { type: LinksSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
