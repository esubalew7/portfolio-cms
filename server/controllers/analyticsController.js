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
      return res.status(400).json({ success: false, message: "Page name is required" });
    }

    const ip = requestIp.getClientIp(req) || "0.0.0.0";
    const userAgent = req.headers["user-agent"] || "";
    const geo = geoip.lookup(ip);

    const country = geo?.country || "Unknown";
    const city = geo?.city || "Unknown";
    const browser = detectBrowser(userAgent);
    const device = detectDevice(userAgent);

    const recentVisit = await Visitor.findOne({
      ip, page,
      createdAt: { $gte: new Date(Date.now() - DEDUP_WINDOW_MS) },
    });

    if (recentVisit) {
      return res.status(200).json({ success: true, message: "Visit already recorded recently", deduplicated: true });
    }

    await Visitor.create({ page, ip, country, city, device, browser, userAgent });

    res.status(201).json({ success: true, message: "Visit tracked" });
  } catch (error) {
    console.error("Track visit error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
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
      uniqueVisitors,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      returningVisitors,
      pageCounts,
      last7Days,
    ] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.distinct("ip").then((ips) => ips.length),
      Visitor.countDocuments({ createdAt: { $gte: startOfDay } }),
      Visitor.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Visitor.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Visitor.aggregate([
        { $group: { _id: "$ip", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $count: "returning" },
      ]).then((r) => (r[0]?.returning || 0)),
      Visitor.aggregate([
        { $group: { _id: "$ip", pages: { $addToSet: "$page" } } },
        { $project: { pageCount: { $size: "$pages" } } },
      ]),
      Visitor.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const singlePageVisitors = pageCounts.filter((p) => p.pageCount === 1).length;
    const totalWithPages = pageCounts.length || 1;
    const bounceRate = Math.round((singlePageVisitors / totalWithPages) * 100);

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const found = last7Days.find((item) => item._id === dateStr);
      days.push({ date: dateStr, visitors: found ? found.count : 0 });
    }

    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        uniqueVisitors,
        totalPageViews: totalVisitors,
        returningVisitors,
        bounceRate,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        last7Days: days,
      },
    });
  } catch (error) {
    console.error("Get overview error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getCharts = async (req, res) => {
  try {
    const now = new Date();

    const [daily, weekly, monthly] = await Promise.all([
      Visitor.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            visitors: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Visitor.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: {
              year: { $isoWeekYear: "$createdAt" },
              week: { $isoWeek: "$createdAt" },
            },
            visitors: { $sum: 1 },
            startDate: { $min: "$createdAt" },
          },
        },
        { $sort: { "_id.year": 1, "_id.week": 1 } },
      ]),
      Visitor.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            visitors: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const fillDaily = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const found = daily.find((item) => item._id === key);
      fillDaily.push({
        date: key,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        visitors: found ? found.visitors : 0,
      });
    }

    const fillWeekly = weekly.map((w) => {
      const d = new Date(w.startDate);
      return {
        label: `W${w._id.week}`,
        startDate: w._id,
        visitors: w.visitors,
        dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });

    const monthlyLabels = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
      "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
      "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
    };

    const fillMonthly = monthly.map((m) => {
      const [, monthNum] = m._id.split("-");
      return {
        month: m._id,
        label: monthlyLabels[monthNum] || m._id,
        visitors: m.visitors,
      };
    });

    res.status(200).json({
      success: true,
      data: { daily: fillDaily, weekly: fillWeekly, monthly: fillMonthly },
    });
  } catch (error) {
    console.error("Get charts error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    const [countries, cities] = await Promise.all([
      Visitor.aggregate([
        { $group: { _id: "$country", visitors: { $sum: 1 } } },
        { $sort: { visitors: -1 } },
      ]),
      Visitor.aggregate([
        { $match: { city: { $ne: "Unknown" }, country: { $ne: "Unknown" } } },
        { $group: { _id: { country: "$country", city: "$city" }, visitors: { $sum: 1 } } },
        { $sort: { visitors: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const totalVisitors = countries.reduce((sum, c) => sum + c.visitors, 0) || 1;
    const unknownCount = countries
      .filter((c) => c._id === "Unknown")
      .reduce((sum, c) => sum + c.visitors, 0);

    const countryData = countries.map((c) => ({
      country: c._id,
      visitors: c.visitors,
      percentage: Math.round((c.visitors / totalVisitors) * 100),
    }));

    const cityData = cities.map((c) => ({
      country: c._id.country,
      city: c._id.city,
      visitors: c.visitors,
    }));

    res.status(200).json({
      success: true,
      data: {
        countries: countryData,
        cities: cityData,
        unknownTraffic: {
          count: unknownCount,
          percentage: Math.round((unknownCount / totalVisitors) * 100),
        },
      },
    });
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getPortfolioAnalytics = async (req, res) => {
  try {
    const sections = await Visitor.aggregate([
      { $group: { _id: "$page", visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        sections: sections.map((s) => ({
          page: s._id,
          visits: s.visits,
        })),
      },
    });
  } catch (error) {
    console.error("Get portfolio analytics error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getRecentVisitors = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("page country city device browser createdAt");

    res.status(200).json({ success: true, data: visitors });
  } catch (error) {
    console.error("Get recent visitors error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
