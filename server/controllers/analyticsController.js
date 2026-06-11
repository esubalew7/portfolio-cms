import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";
import requestIp from "request-ip";

const DEDUP_WINDOW_MS = 60 * 1000;

const detectBrowser = (userAgent) => {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident")) return "Internet Explorer";
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
  return "Other";
};

const detectDevice = (userAgent) => {
  if (!userAgent) return "Desktop";
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
    if (/ipad|tablet|kindle|playbook|silk/i.test(userAgent)) return "Tablet";
    return "Mobile";
  }
  return "Desktop";
};

export const trackVisit = async (req, res) => {
  try {
    const { page } = req.body;

    if (!page || typeof page !== "string") {
      return res.status(400).json({
        success: false,
        message: "Page name is required",
      });
    }

    const ip = requestIp.getClientIp(req) || "0.0.0.0";
    const userAgent = req.headers["user-agent"] || "";
    const geo = geoip.lookup(ip);

    const country = geo?.country || "Unknown";
    const city = geo?.city || "Unknown";
    const browser = detectBrowser(userAgent);
    const device = detectDevice(userAgent);

    const recentVisit = await Visitor.findOne({
      ip,
      page,
      createdAt: { $gte: new Date(Date.now() - DEDUP_WINDOW_MS) },
    });

    if (recentVisit) {
      return res.status(200).json({
        success: true,
        message: "Visit already recorded recently",
        deduplicated: true,
      });
    }

    const visit = await Visitor.create({
      page,
      ip,
      country,
      city,
      device,
      browser,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: "Visit tracked",
      data: {
        id: visit._id,
        page: visit.page,
        country: visit.country,
        city: visit.city,
      },
    });
  } catch (error) {
    console.error("Track visit error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalVisitors,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      last7Days,
    ] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ createdAt: { $gte: startOfDay } }),
      Visitor.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Visitor.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Visitor.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const found = last7Days.find((item) => item._id === dateStr);
      days.push({
        date: dateStr,
        visitors: found ? found.count : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        last7Days: days,
      },
    });
  } catch (error) {
    console.error("Get overview error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getTopPages = async (req, res) => {
  try {
    const topPages = await Visitor.aggregate([
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: topPages.map((p) => ({
        page: p._id,
        visits: p.count,
      })),
    });
  } catch (error) {
    console.error("Get top pages error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getCountries = async (req, res) => {
  try {
    const countries = await Visitor.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: countries.map((c) => ({
        country: c._id,
        visitors: c.count,
      })),
    });
  } catch (error) {
    console.error("Get countries error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getRecentVisitors = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("page country city device browser createdAt");

    res.status(200).json({
      success: true,
      data: visitors,
    });
  } catch (error) {
    console.error("Get recent visitors error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
