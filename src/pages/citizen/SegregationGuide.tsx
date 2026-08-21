import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common/Cards';
import { PageHeader } from '../../components/common/Table';
import type { Language } from '../../types';

const binTypes = [
  {
    color: 'green',
    emoji: '🟢',
    bgClass: 'bg-green-50 border-green-300',
    textClass: 'text-green-800',
    titleKey: 'wet' as const,
    items: {
      en: ['Vegetable & fruit peels', 'Kitchen food waste', 'Tea leaves / coffee grounds', 'Flowers & leaves', 'Eggshells', 'Leftover cooked food'],
      gu: ['શાકભાજી અને ફળની છાલ', 'રસોઈ કચરો', 'ચા ની પત્તી / કૉફી', 'ફૂલ અને પાંદડા', 'ઈંડાના ટૂકડા', 'બચેલ ભોજન'],
      hi: ['सब्जी और फलों के छिलके', 'रसोई का भोजन कचरा', 'चाय पत्ती / कॉफी', 'फूल और पत्तियाँ', 'अंडे के छिलके', 'बचा हुआ खाना'],
    },
  },
  {
    color: 'blue',
    emoji: '🔵',
    bgClass: 'bg-blue-50 border-blue-300',
    textClass: 'text-blue-800',
    titleKey: 'dry' as const,
    items: {
      en: ['Paper & cardboard', 'Plastic bottles & bags', 'Glass bottles & jars', 'Metal cans & foil', 'Clothes & fabric', 'Packaging material'],
      gu: ['કાગળ અને કાર્ડ', 'પ્લાસ્ટિક બોટલ', 'કાચ', 'ધાતુ', 'કપડું', 'પૅકેજિંગ'],
      hi: ['कागज और कार्डबोर्ड', 'प्लास्टिक बोतलें', 'कांच की बोतलें', 'धातु के डिब्बे', 'कपड़े', 'पैकेजिंग सामग्री'],
    },
  },
  {
    color: 'red',
    emoji: '🔴',
    bgClass: 'bg-red-50 border-red-300',
    textClass: 'text-red-800',
    titleKey: 'hazardous' as const,
    items: {
      en: ['Batteries & electronics', 'Medicines & syringes', 'Paints & chemicals', 'Light bulbs & tubelights', 'Aerosol cans', 'Motor oil'],
      gu: ['બૅટરી & ઇ-કચરો', 'દવા & સિરિંજ', 'પૅઇ & કેમ', 'બલ્બ', 'ઍઍરોસোલ', 'ઈ-ઑઇ'],
      hi: ['बैटरी और इलेक्ट्रॉनिक्स', 'दवाइयाँ', 'पेंट और रसायन', 'बल्ब', 'एरोसोल', 'मोटर तेल'],
    },
  },
];

const tips = {
  en: [
    'Rinse containers before placing in dry waste bin',
    'Do not put hot or burning items in any bin',
    'Sanitary waste goes in a separate sealed bag',
    'Hazardous items must NEVER be mixed with general waste',
    'Compost wet waste at home to reduce waste at source',
  ],
  gu: [
    'ડ્રાય ડબ્બામાં નાખતા પહેલા કન્ટેઇનર ધુઓ',
    'ગરમ ચીજ ડબ્બામાં ન નાખો',
    'સૅઉ઼ ઇ઼ ઓ઼ ♧ .',
    'જોખ☺☻ ♂☀☁.',
    'ઘ☺ ☻☺ .',
  ],
  hi: [
    'सूखे डब्बे में डालने से पहले कंटेनर धोएं',
    'गर्म चीजें डब्बे में न डालें',
    'सैनिटरी वेस्ट अलग सील बैग में रखें',
    'खतरनाक वस्तुएं सामान्य कचरे में कभी न मिलाएं',
    'गीले कचरे को घर पर कम्पोस्ट करें',
  ],
};

export default function SegregationGuidePage() {
  const { t, language } = useLanguage();

  return (
    <div>
      <PageHeader
        title={t.segregation.title}
        subtitle={t.segregation.subtitle}
        breadcrumb="Citizen · Segregation Guide"
      />

      {/* Reminder banner */}
      <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm font-medium text-green-800">♻️ {t.segregation.reminder}</p>
      </div>

      {/* Bin types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {binTypes.map((bin, i) => (
          <div key={i} className={`rounded-xl border-2 p-5 ${bin.bgClass}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{bin.emoji}</span>
              <div>
                <h3 className={`text-base font-bold ${bin.textClass}`}>{t.segregation[bin.titleKey].title}</h3>
                <p className="text-xs text-gray-500">{t.segregation[bin.titleKey].desc}</p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {bin.items[language as Language].map((item, j) => (
                <li key={j} className="flex items-center gap-2 text-xs text-gray-700">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${bin.color === 'green' ? 'bg-green-500' : bin.color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tips */}
      <Card>
        <h3 className="text-base font-bold text-gray-900 mb-4">{t.segregation.tips}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips[language as Language].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Visual guide */}
      <Card className="mt-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">Quick Visual Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🥦', label: 'Vegetables', bin: 'Green Bin', color: 'bg-green-50 border-green-200' },
            { icon: '📰', label: 'Newspaper', bin: 'Blue Bin', color: 'bg-blue-50 border-blue-200' },
            { icon: '🔋', label: 'Battery', bin: 'Red Bin', color: 'bg-red-50 border-red-200' },
            { icon: '💊', label: 'Medicines', bin: 'Red Bin', color: 'bg-red-50 border-red-200' },
            { icon: '🍌', label: 'Fruit peels', bin: 'Green Bin', color: 'bg-green-50 border-green-200' },
            { icon: '🥤', label: 'Plastic bottle', bin: 'Blue Bin', color: 'bg-blue-50 border-blue-200' },
            { icon: '📦', label: 'Cardboard', bin: 'Blue Bin', color: 'bg-blue-50 border-blue-200' },
            { icon: '💡', label: 'Light bulb', bin: 'Red Bin', color: 'bg-red-50 border-red-200' },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl p-3 border ${item.color} text-center`}>
              <span className="text-3xl">{item.icon}</span>
              <p className="text-xs font-semibold text-gray-800 mt-2">{item.label}</p>
              <p className="text-[10px] text-gray-500">{item.bin}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
