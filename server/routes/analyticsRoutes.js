import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  trackVisit,
  getOverview,
  getCharts,
  getLocations,
  getPortfolioAnalytics,
  getTopPages,
  getCountries,
  getRecentVisitors,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/visit", trackVisit);

router.use(protect);

router.get("/overview", getOverview);
router.get("/charts", getCharts);
router.get("/locations", getLocations);
router.get("/portfolio", getPortfolioAnalytics);
router.get("/top-pages", getTopPages);
router.get("/countries", getCountries);
router.get("/recent", getRecentVisitors);

export default router;
