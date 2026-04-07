const CLINIC_SUBSCRIPTION_RULES = {
  free: {
    maxClinics: 1,
  },
  monthly: {
    maxClinics: 5,
  },
  yearly: {
    maxClinics: null, // unlimited
  },
};

export default CLINIC_SUBSCRIPTION_RULES;
