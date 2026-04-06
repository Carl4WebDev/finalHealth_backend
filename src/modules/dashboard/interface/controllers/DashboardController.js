import DashboardRepo from "../../infrastructure/DashboardRepo.js";
import DashboardService from "../../application/DashboardService.js";

import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";

const dashboardRepo = new DashboardRepo();
const dashboardService = new DashboardService(dashboardRepo);

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const overview = await dashboardService.getDashboardOverview(req.user.id);

  return sendSuccess(res, {
    message: "Dashboard overview fetched successfully",
    data: { overview },
  });
});

export const getDashboardUsage = asyncHandler(async (req, res) => {
  const usage = await dashboardService.getDashboardUsage(req.user.id);

  return sendSuccess(res, {
    message: "Dashboard usage fetched successfully",
    data: { usage },
  });
});
