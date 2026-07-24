import mongoose from "mongoose";

const StatSchema = new mongoose.Schema(
  {
    num: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const TraitSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    desc: { type: String, default: "" },
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    period: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: [{ type: String }],
    isCurrent: { type: Boolean, default: false },
  },
  { _id: false }
);

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    feedback: { type: String, default: "" },
    verified: { type: Boolean, default: true },
  },
  { _id: false }
);

const SiteContentSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      required: true,
      unique: true,
      enum: ["main", "backend", "frontend", "mobile"],
    },
    hero: {
      logo: { type: String, default: "CODIAC" },
      titleLine1: { type: String, default: "" },
      titleLine2: { type: String, default: "" },
      sub: { type: String, default: "" },
      stats: { type: [StatSchema], default: [] },
    },
    about: {
      eyebrow: { type: String, default: "ABOUT ME" },
      headingLead: { type: String, default: "" },
      headingHighlight: { type: String, default: "" },
      bio: [{ type: String }],
      traits: { type: [TraitSchema], default: [] },
      skills: [{ type: String }],
    },
    experiences: { type: [ExperienceSchema], default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
    contact: {
      eyebrow: { type: String, default: "Get in Touch" },
      headingLead: { type: String, default: "Let's work" },
      headingHighlight: { type: String, default: "together" },
      subtitle: { type: String, default: "" },
    },
    footer: {
      tagline: { type: String, default: "" },
    },
    cvUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);
