import cloudinary from "../config/cloudinary.js";
import Media from "../models/Media.js";
import PortfolioContent from "../models/PortfolioContent.js";
import Project from "../models/Project.js";

const USAGE_SECTIONS = [
  { key: "hero", field: "image" },
  { key: "hero", field: "backgroundImage" },
  { key: "about", field: "image" },
  { key: "navbar", field: "logo" },
  { key: "footer", field: "logo" },
  { key: "seo", field: "ogImage" },
];

const checkUsageAcrossContent = async (url) => {
  const usage = [];
  try {
    const content = await PortfolioContent.findOne();
    if (content) {
      for (const { key, field } of USAGE_SECTIONS) {
        const section = content[key];
        if (section && section[field] === url) {
          usage.push({ section: key, field });
        }
      }
      const socialLinks = content.socialLinks || [];
      for (const sl of socialLinks) {
        if (sl.url === url) {
          usage.push({ section: "socialLinks", field: "image" });
        }
      }
    }
  } catch { }

  try {
    const projects = await Project.find({ image: url });
    for (const p of projects) {
      usage.push({ section: "projects", field: "image" });
    }
  } catch { }

  return usage;
};

export const getMedia = async (req, res) => {
  try {
    const { search, sort = "-createdAt", folder } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { publicId: { $regex: search, $options: "i" } },
      ];
    }

    if (folder) {
      query.folder = folder;
    }

    const sortOptions = {};
    if (sort === "name") sortOptions.name = 1;
    else if (sort === "-name") sortOptions.name = -1;
    else if (sort === "fileSize") sortOptions.fileSize = 1;
    else if (sort === "-fileSize") sortOptions.fileSize = -1;
    else if (sort === "updatedAt") sortOptions.updatedAt = 1;
    else if (sort === "-updatedAt") sortOptions.updatedAt = -1;
    else sortOptions.createdAt = -1;

    const media = await Media.find(query).sort(sortOptions);

    res.status(200).json({ success: true, data: media, count: media.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const { originalname, filename, path, mimetype, size } = req.file;

    const format = mimetype.split("/").pop() || "jpg";

    let width = 0;
    let height = 0;
    try {
      const details = await cloudinary.uploader.explicit(filename, { image_metadata: true, colors: false });
      width = details.width || 0;
      height = details.height || 0;
    } catch { }

    const media = await Media.create({
      name: originalname || "Untitled",
      url: path,
      publicId: filename,
      format,
      width,
      height,
      fileSize: size,
      folder: "portfolio-media",
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }

    const usage = await checkUsageAcrossContent(media.url);
    if (usage.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete. Image is in use.",
        usage,
      });
    }

    if (media.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
      } catch (cloudErr) {
        console.error("Cloudinary delete failed:", cloudErr.message);
      }
    }

    await Media.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const { name, folder } = req.body;
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }

    if (name !== undefined) media.name = name;
    if (folder !== undefined) media.folder = folder;

    await media.save();

    res.status(200).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const searchMedia = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query required" });
    }

    const media = await Media.find({
      $text: { $search: q },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: media, count: media.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
