import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  trackVisit,
  getOverview,
  getTopPages,
  getCountries,
  getRecentVisitors,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/visit", trackVisit);

router.use(protect);

router.get("/overview", getOverview);
router.get("/top-pages", getTopPages);
router.get("/countries", getCountries);
router.get("/recent", getRecentVisitors);

export default router;
