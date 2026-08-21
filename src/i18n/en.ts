export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    liveMap: 'Live Map',
    routeOptimization: 'Route Optimization',
    segregationCompliance: 'Segregation Compliance',
    grievances: 'Grievances',
    wardAnalytics: 'Ward Analytics',
    aiAgentCenter: 'AI Agent Center',
    alerts: 'Alerts',
    notifications: 'Notifications',
    settings: 'Settings',
    reportGrievance: 'Report Grievance',
    myGrievances: 'My Grievances',
    segregationGuide: 'Segregation Guide',
    collectionSchedule: 'Collection Schedule',
    profile: 'Profile',
    logout: 'Logout',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Something went wrong.',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    all: 'All',
    status: 'Status',
    priority: 'Priority',
    ward: 'Ward',
    date: 'Date',
    action: 'Action',
    markAsRead: 'Mark as Read',
    viewDetails: 'View Details',
    demoNote: '⚠ Demo Data — For demonstration purposes only',
    aiMockNote: 'AI Demo Mode — Using mock intelligence',
  },

  // Grievance
  grievance: {
    title: 'Report a Grievance',
    description: 'Describe your waste management issue and we will help resolve it.',
    name: 'Your Name',
    phone: 'Mobile Number',
    category: 'Grievance Category',
    descriptionField: 'Describe your issue',
    location: 'Location / Area',
    ward: 'Select Ward',
    language: 'Language',
    image: 'Attach Photo (Optional)',
    submit: 'Submit Grievance',
    submitted: 'Grievance Submitted',
    grievanceId: 'Your Grievance ID',
    status: 'Status',
    aiAnalyzing: 'AI Analyzing your grievance...',
    aiClassified: 'Grievance Analyzed by AI',
    categories: {
      missed_collection: 'Missed Collection',
      mixed_collection: 'Mixed Waste Collection',
      overflowing_garbage: 'Overflowing Garbage',
      illegal_dumping: 'Illegal Dumping',
      vehicle_issue: 'Vehicle Issue',
      segregation_issue: 'Segregation Issue',
      sanitation: 'Sanitation Issue',
      other: 'Other',
    },
    statuses: {
      submitted: 'Submitted',
      ai_classified: 'AI Classified',
      assigned: 'Assigned',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    },
    priorities: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    }
  },

  // Segregation
  segregation: {
    title: 'Waste Segregation Guide',
    subtitle: 'Separate waste correctly for a cleaner city',
    wet: {
      title: 'Wet Waste (Green Bin)',
      desc: 'Kitchen waste, vegetable peels, fruit waste, food scraps, tea leaves, flowers',
      color: 'green',
    },
    dry: {
      title: 'Dry Waste (Blue Bin)',
      desc: 'Paper, cardboard, plastic bottles, glass, metal, cloth, packaging',
      color: 'blue',
    },
    hazardous: {
      title: 'Hazardous Waste (Red Bin)',
      desc: 'Batteries, medicines, chemicals, paint, light bulbs, electronic waste',
      color: 'red',
    },
    tips: 'Important Tips',
    tip1: 'Rinse containers before putting in the dry waste bin',
    tip2: 'Do not put hot or burning waste in bins',
    tip3: 'Sanitary waste goes in a separate sealed bag',
    tip4: 'Hazardous items should never be mixed with general waste',
    reminder: 'Please segregate waste before handing it to the collection team.',
  },

  // Nudges
  nudge: {
    segregationReminder: 'Please separate wet and dry waste before handing it to the collection team.',
    collectionSchedule: 'Waste collection in your area is scheduled for tomorrow at 7:00 AM.',
    awareness: 'Proper waste segregation helps reduce landfill use and supports recycling.',
  }
};

export type TranslationKey = typeof en;
