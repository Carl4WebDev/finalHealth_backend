import AppError from "../../../core/errors/AppError.js";

export default class DashboardService {
  constructor(dashboardRepo) {
    this.dashboardRepo = dashboardRepo;
  }

  async getDashboardOverview(userId) {
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const [
      summaryCards,
      upcomingAppointments,
      subscription,
      networkClinics,
      networkDoctors,
    ] = await Promise.all([
      this.dashboardRepo.getSummaryCards(userId),
      this.dashboardRepo.getUpcomingAppointments(userId),
      this.dashboardRepo.getSubscriptionOverview(userId),
      this.dashboardRepo.getClinicNetwork(userId),
      this.dashboardRepo.getDoctorNetwork(userId),
    ]);

    return {
      summaryCards,
      upcomingAppointments,
      subscription,
      network: {
        clinics: networkClinics,
        doctors: networkDoctors,
      },
    };
  }

  async getActiveSubscription(userId) {
    const query = `
      SELECT
        us.subscription_id,
        us.user_id,
        us.start_date,
        us.end_date,
        us.status,
        us.renewal_date,
        sp.plan_id,
        sp.plan_name,
        sp.plan_type,
        sp.price,
        sp.max_number_users,
        sp.max_number_patient,
        sp.max_doctors,
        sp.max_clinics,
        sp.max_medical_records_per_patient
      FROM user_subscription us
      INNER JOIN subscription_plan sp
        ON sp.plan_id = us.plan_id
      WHERE us.user_id = $1
        AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `;

    const { rows } = await db.query(query, [userId]);
    return rows[0] || null;
  }

  async getDashboardUsage(userId) {
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const [subscription, patientCount, activeUsersCount] = await Promise.all([
      this.dashboardRepo.getActiveSubscription(userId),
      this.dashboardRepo.countPatientsOfUser(userId),
      this.dashboardRepo.countActiveUsersForSubscription(userId),
    ]);

    if (!subscription) {
      return {
        activeUsers: {
          used: 0,
          total: 0,
        },
        patients: {
          used: 0,
          total: null,
        },
        monthsRemaining: {
          used: 0,
          total: 0,
        },
      };
    }

    const monthsTotal =
      subscription.plan_type === "yearly"
        ? 12
        : subscription.plan_type === "monthly"
          ? 1
          : 0;

    const monthsRemaining = this.calculateMonthsRemaining(
      subscription.end_date,
    );

    return {
      activeUsers: {
        used: activeUsersCount,
        total: subscription.max_number_users ?? 0,
      },
      patients: {
        used: patientCount,
        total: null,
      },
      monthsRemaining: {
        used: monthsRemaining,
        total: monthsTotal,
      },
    };
  }

  calculateMonthsRemaining = (endDate) => {
    if (!endDate) return 0;

    const today = new Date();
    const end = new Date(endDate);

    if (end <= today) return 0;

    let months =
      (end.getFullYear() - today.getFullYear()) * 12 +
      (end.getMonth() - today.getMonth());

    if (end.getDate() >= today.getDate()) {
      months += 1;
    }

    return Math.max(months, 0);
  };
}
