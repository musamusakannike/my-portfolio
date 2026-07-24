import dbConnect from "@/utils/db";
import SiteContent from "@/utils/models/SiteContent";
import Project from "@/utils/models/Project";
import {
  getDefaultContent,
  DEFAULT_PROJECTS,
  PORTFOLIO_VARIANTS,
} from "@/utils/siteContentDefaults";

function normalizeVariant(variant) {
  return PORTFOLIO_VARIANTS.includes(variant) ? variant : "main";
}

// Deep-merge stored content over defaults so newly added fields always have a
// value even for documents saved before the field existed.
function mergeContent(defaults, stored) {
  if (!stored) return defaults;
  const out = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const dv = defaults[key];
    const sv = stored[key];
    if (sv === undefined || sv === null) continue;
    if (Array.isArray(dv)) {
      out[key] = Array.isArray(sv) && sv.length ? sv : dv;
    } else if (typeof dv === "object") {
      out[key] = { ...dv, ...sv };
    } else {
      out[key] = sv;
    }
  }
  return out;
}

// Ensure a SiteContent doc exists for a variant; returns the plain object.
export async function ensureSiteContent(variant) {
  const v = normalizeVariant(variant);
  const defaults = getDefaultContent(v);
  let doc = await SiteContent.findOne({ variant: v }).lean();
  if (!doc) {
    try {
      await SiteContent.create(defaults);
    } catch {
      // Ignore race / duplicate key — re-read below.
    }
    doc = await SiteContent.findOne({ variant: v }).lean();
  }
  return mergeContent(defaults, doc);
}

// Seed the Project collection with the default projects if empty.
async function ensureProjectsSeeded() {
  const count = await Project.estimatedDocumentCount();
  if (count === 0) {
    try {
      await Project.insertMany(
        DEFAULT_PROJECTS.map((p, i) => ({ ...p, order: i }))
      );
    } catch {
      // Ignore concurrent seed attempts.
    }
  }
}

function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}

// Fetch content + projects for a portfolio variant. Falls back to in-code
// defaults when the database is not configured / unavailable.
export async function getPortfolioData(variant) {
  const v = normalizeVariant(variant);

  let conn = null;
  try {
    conn = await dbConnect();
  } catch (e) {
    console.error("Portfolio data DB connection failed:", e);
  }

  if (!conn) {
    return {
      content: getDefaultContent(v),
      projects: DEFAULT_PROJECTS.filter((p) => p.portfolios.includes(v)),
    };
  }

  try {
    const [content] = await Promise.all([ensureSiteContent(v), ensureProjectsSeeded()]);

    const projects = await Project.find({ portfolios: v })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return {
      content: serialize(content),
      projects: serialize(projects),
    };
  } catch (e) {
    console.error("Portfolio data fetch failed, using defaults:", e);
    return {
      content: getDefaultContent(v),
      projects: DEFAULT_PROJECTS.filter((p) => p.portfolios.includes(v)),
    };
  }
}
