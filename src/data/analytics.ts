import type { WardAnalytics } from '../types';

// Generate realistic ward analytics trend data
const genDates = (days: number) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

const genTrendData = (
  dates: string[],
  base: number,
  variance: number,
  fieldName: 'kg' | 'percent' | 'count'
): { date: string; [key: string]: number | string }[] => {
  return dates.map((date, i) => ({
    date,
    [fieldName]: Math.max(0, Math.round(base + Math.sin(i * 0.7) * variance + (Math.random() - 0.5) * variance * 0.5))
  }));
};

const dates30 = genDates(30);

export const wardAnalytics: Record<number, WardAnalytics> = {
  12: {
    wardId: 12,
    period: 'Last 30 Days',
    wasteGenerationTrend: genTrendData(dates30, 8800, 400, 'kg') as WardAnalytics['wasteGenerationTrend'],
    complianceTrend: dates30.map((date, i) => ({ date, percent: Math.max(55, Math.round(73 - i * 0.4 + Math.sin(i * 0.6) * 3)) })),
    collectionTrend: genTrendData(dates30, 94, 3, 'percent') as WardAnalytics['collectionTrend'],
    grievanceTrend: genTrendData(dates30, 3, 2, 'count') as WardAnalytics['grievanceTrend'],
    wasteDistribution: { wet: 25, dry: 31, hazardous: 8, mixed: 36 },
    kpis: { avgCollectionCompletion: 94, avgSegregationCompliance: 61, totalGrievances: 48, resolvedGrievances: 36, avgResolutionHours: 22, totalWasteKg: 264000 }
  },
  19: {
    wardId: 19,
    period: 'Last 30 Days',
    wasteGenerationTrend: genTrendData(dates30, 10600, 500, 'kg') as WardAnalytics['wasteGenerationTrend'],
    complianceTrend: dates30.map((date, i) => ({ date, percent: Math.max(50, Math.round(70 - i * 0.4 + Math.sin(i * 0.5) * 2)) })),
    collectionTrend: genTrendData(dates30, 81, 5, 'percent') as WardAnalytics['collectionTrend'],
    grievanceTrend: genTrendData(dates30, 5, 3, 'count') as WardAnalytics['grievanceTrend'],
    wasteDistribution: { wet: 22, dry: 28, hazardous: 9, mixed: 41 },
    kpis: { avgCollectionCompletion: 81, avgSegregationCompliance: 58, totalGrievances: 89, resolvedGrievances: 54, avgResolutionHours: 48, totalWasteKg: 318000 }
  },
  7: {
    wardId: 7,
    period: 'Last 30 Days',
    wasteGenerationTrend: genTrendData(dates30, 10400, 450, 'kg') as WardAnalytics['wasteGenerationTrend'],
    complianceTrend: dates30.map((date, i) => ({ date, percent: Math.max(58, Math.round(70 - i * 0.25 + Math.sin(i * 0.8) * 4)) })),
    collectionTrend: genTrendData(dates30, 79, 6, 'percent') as WardAnalytics['collectionTrend'],
    grievanceTrend: genTrendData(dates30, 4, 2, 'count') as WardAnalytics['grievanceTrend'],
    wasteDistribution: { wet: 27, dry: 33, hazardous: 7, mixed: 33 },
    kpis: { avgCollectionCompletion: 79, avgSegregationCompliance: 64, totalGrievances: 67, resolvedGrievances: 45, avgResolutionHours: 41, totalWasteKg: 312000 }
  },
  3: {
    wardId: 3,
    period: 'Last 30 Days',
    wasteGenerationTrend: genTrendData(dates30, 5200, 200, 'kg') as WardAnalytics['wasteGenerationTrend'],
    complianceTrend: dates30.map((date, i) => ({ date, percent: Math.min(98, Math.round(89 + i * 0.07 + Math.sin(i * 0.5) * 2)) })),
    collectionTrend: genTrendData(dates30, 97, 2, 'percent') as WardAnalytics['collectionTrend'],
    grievanceTrend: genTrendData(dates30, 1, 1, 'count') as WardAnalytics['grievanceTrend'],
    wasteDistribution: { wet: 42, dry: 44, hazardous: 2, mixed: 12 },
    kpis: { avgCollectionCompletion: 97, avgSegregationCompliance: 91, totalGrievances: 18, resolvedGrievances: 17, avgResolutionHours: 14, totalWasteKg: 156000 }
  }
};

// Generate analytics for all wards not specifically defined above
for (let id = 1; id <= 24; id++) {
  if (!wardAnalytics[id]) {
    const baseCompliance = 60 + Math.floor(Math.random() * 30);
    const baseCollection = 78 + Math.floor(Math.random() * 20);
    wardAnalytics[id] = {
      wardId: id,
      period: 'Last 30 Days',
      wasteGenerationTrend: genTrendData(dates30, 6000 + id * 200, 300, 'kg') as WardAnalytics['wasteGenerationTrend'],
      complianceTrend: dates30.map((date, i) => ({ date, percent: Math.min(98, Math.max(50, Math.round(baseCompliance + Math.sin(i * 0.6) * 4))) })),
      collectionTrend: genTrendData(dates30, baseCollection, 4, 'percent') as WardAnalytics['collectionTrend'],
      grievanceTrend: genTrendData(dates30, 2 + (id % 4), 2, 'count') as WardAnalytics['grievanceTrend'],
      wasteDistribution: { wet: 30 + (id % 10), dry: 35 + (id % 8), hazardous: 3 + (id % 5), mixed: 22 + (id % 10) },
      kpis: {
        avgCollectionCompletion: baseCollection,
        avgSegregationCompliance: baseCompliance,
        totalGrievances: 15 + id * 2,
        resolvedGrievances: Math.round((15 + id * 2) * 0.75),
        avgResolutionHours: 20 + (id % 20),
        totalWasteKg: (6000 + id * 200) * 30
      }
    };
  }
}

export const getWardAnalytics = (wardId: number) => wardAnalytics[wardId];
