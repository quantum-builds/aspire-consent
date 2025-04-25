  export type TConsentFormsByProcedures = {
    totalConsentForms: number;
    procedures: {
      procedureId: string;
      procedureName: string;
      consentFormCount: number;
    }[];
  };

export type TConsentFormStatus = {
  totalCount: number;
  statusCounts: {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
    count: number;
  }[];
};

export type TConsentFormTimeCountsResponse = {
  last7Days: {
    period: "Daily breakdown";
    data: {
      date: string; // e.g., "2025-04-24"
      count: number;
    }[];
  };
  last30Days: {
    period: "Weekly groups (7-day intervals)";
    data: {
      week_group: number;
      start_date: string; // e.g., "2025-03-25"
      end_date: string; // e.g., "2025-03-31"
      count: number;
    }[];
  };
  last12Months: {
    period: "Monthly breakdown";
    data: {
      year: number;
      month: number; // 1 to 12
      monthName: string; // e.g., "April"
      count: number;
    }[];
  };
};
