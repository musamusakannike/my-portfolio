import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coverImage: {
      type: String,
      required: true,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    author: {
      name: { type: String, default: "Musa Musa Kannike" },
      avatar: { type: String, default: "" },
    },
    contentUpgrade: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      fileUrl: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// Automate reading time calculation based on word count (~200 words per minute)
PostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const words = this.content ? this.content.split(/\s+/).length : 0;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
