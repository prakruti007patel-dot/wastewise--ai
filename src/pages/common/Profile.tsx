import { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Save } from 'lucide-react';
import { Card } from '../../components/common/Cards';
import { Button } from '../../components/common/Buttons';
import { FieldWrapper, Input, Select } from '../../components/common/Forms';
import { PageHeader } from '../../components/common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { wards } from '../../data/wards';
import type { Language } from '../../types';

export default function ProfilePage() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { success } = useToast();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    success('Settings saved', 'Your profile preferences have been updated.');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" breadcrumb="Profile" />
      <div className="max-w-2xl mx-auto space-y-5">
        {/* User info */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.role === 'officer' ? 'Municipal Officer' : 'Citizen'}</p>
              {user?.designation && <p className="text-xs text-gray-400">{user.designation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Full Name" htmlFor="name">
              <Input id="name" defaultValue={user?.name} />
            </FieldWrapper>
            <FieldWrapper label="Email Address" htmlFor="email">
              <Input id="email" type="email" defaultValue={user?.email} />
            </FieldWrapper>
            <FieldWrapper label="Mobile Number" htmlFor="phone">
              <Input id="phone" defaultValue={user?.phone} />
            </FieldWrapper>
            {user?.role === 'citizen' && (
              <FieldWrapper label="Ward" htmlFor="ward">
                <Select id="ward" defaultValue={user?.wardId}>
                  {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </Select>
              </FieldWrapper>
            )}
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <h3 className="text-base font-bold text-gray-900 mb-4">App Preferences</h3>
          <div className="space-y-4">
            <FieldWrapper label="Language" htmlFor="lang">
              <div className="flex gap-2">
                {(['en', 'gu', 'hi'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${language === lang ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
                  </button>
                ))}
              </div>
            </FieldWrapper>
          </div>
        </Card>

        {/* Demo info */}
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Demo Account</p>
              <p className="text-xs text-yellow-700">This is a demo account for the WasteWise AI prototype. No real data is stored. Authentication is simulated for demonstration purposes only.</p>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} icon={<Save className="w-4 h-4" />} className="w-full" size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
