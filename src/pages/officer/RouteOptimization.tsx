import { useState } from 'react';
import { Truck, Zap, CheckCircle, MapPin, Fuel, Clock, BarChart3 } from 'lucide-react';
import { Button } from '../../components/common/Buttons';
import { Card, KPICard, SectionHeader } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/Badges';
import { PageHeader } from '../../components/common/Table';
import { LeafletMap } from '../../components/maps/LeafletMap';
import { useToast } from '../../contexts/ToastContext';
import { aiService } from '../../services/ai';
import { vehicles } from '../../data/vehicles';
import type { RouteOptimizationResult } from '../../types';

export default function RouteOptimizationPage() {
  const { success, info } = useToast();
  const [optimizing, setOptimizing] = useState(false);
  const [results, setResults] = useState<RouteOptimizationResult[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(vehicles.slice(0, 8).map(v => v.id));
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = async () => {
    setOptimizing(true);
    info('Route Optimization Agent analyzing...', 'Processing 24 wards, 18 vehicles, 312 collection points');
    try {
      const res = await aiService.optimizeRoutes({ vehicleIds: selectedVehicles, considerTraffic: true });
      setResults(res);
      setOptimized(true);
      const totalSaved = res.reduce((s, r) => s + r.distanceSavedKm, 0);
      const timeSaved = res.reduce((s, r) => s + r.timeSavedMin, 0);
      const fuelSaved = res.reduce((s, r) => s + r.fuelSavedL, 0);
      success('Routes optimized successfully!', `Saved ${totalSaved.toFixed(1)} km · ${timeSaved} min · ${fuelSaved.toFixed(1)} L fuel`);
    } catch {
      // fallback handled by mock
    } finally {
      setOptimizing(false);
    }
  };

  const toggleVehicle = (id: string) => {
    setSelectedVehicles(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
    setOptimized(false);
    setResults([]);
  };

  const totalOriginal = results.reduce((s, r) => s + r.originalDistanceKm, 0);
  const totalOptimized = results.reduce((s, r) => s + r.optimizedDistanceKm, 0);
  const totalSaved = results.reduce((s, r) => s + r.distanceSavedKm, 0);
  const totalTime = results.reduce((s, r) => s + r.timeSavedMin, 0);
  const totalFuel = results.reduce((s, r) => s + r.fuelSavedL, 0);

  return (
    <div>
      <PageHeader
        title="Route Optimization"
        subtitle="AI-powered collection route optimization across the municipal fleet"
        breadcrumb="Officer · Route Optimization"
        actions={
          <Button
            icon={<Zap className="w-4 h-4" />}
            loading={optimizing}
            onClick={handleOptimize}
            disabled={selectedVehicles.length === 0}
          >
            {optimizing ? 'Optimizing...' : 'Optimize Routes with AI'}
          </Button>
        }
      />

      {/* Optimization results */}
      {optimized && results.length > 0 && (
        <div className="mb-5 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-semibold text-green-800">Route optimization completed — AI analysis by IBM Granite (Demo Mode)</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
              <p className="text-lg font-bold text-gray-900">{totalOriginal.toFixed(1)} km</p>
              <p className="text-xs text-gray-500">Original Distance</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
              <p className="text-lg font-bold text-green-700">{totalOptimized.toFixed(1)} km</p>
              <p className="text-xs text-gray-500">Optimized Distance</p>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg border border-green-200">
              <p className="text-lg font-bold text-green-800">{totalSaved.toFixed(1)} km</p>
              <p className="text-xs text-green-700">Distance Saved</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-lg font-bold text-blue-700">{totalTime} min</p>
              <p className="text-xs text-gray-500">Time Saved</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-lg font-bold text-orange-700">{totalFuel.toFixed(1)} L</p>
              <p className="text-xs text-gray-500">Fuel Saved</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Map */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-4 border-b border-gray-100">
            <SectionHeader title="Live Collection Map" subtitle="Vehicle locations and collection points" />
          </div>
          <LeafletMap vehicles={vehicles} height="420px" className="rounded-b-xl border-0" />
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500 rounded-b-xl">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />On Route</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Full/Critical</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />Maintenance</span>
            <span className="ml-auto text-gray-400">OpenStreetMap · Demo locations</span>
          </div>
        </Card>

        {/* Vehicle list */}
        <Card>
          <SectionHeader title="Fleet Status" subtitle={`${selectedVehicles.length} selected for optimization`} />
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {vehicles.map(v => {
              const loadPct = Math.round(v.currentLoad / v.capacity * 100);
              const isSelected = selectedVehicles.includes(v.id);
              return (
                <div
                  key={v.id}
                  onClick={() => toggleVehicle(v.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800 font-mono">{v.id}</span>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-[11px] text-gray-500">{v.driverName} · Ward {v.wardId}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${loadPct >= 90 ? 'bg-red-500' : loadPct >= 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
                        style={{ width: `${loadPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">{v.currentLoad}/{v.capacity}t</span>
                    <span className="text-[10px] text-gray-400"><Fuel className="w-3 h-3 inline" />{v.fuelLevel}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Route comparison table */}
      {optimized && results.length > 0 && (
        <Card>
          <SectionHeader title="Route Comparison" subtitle="Original vs AI-optimized routes per vehicle" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Vehicle', 'Driver', 'Ward', 'Original Route', 'Optimized Route', 'Saved (km)', 'Time Saved', 'Fuel Saved', 'Reasoning'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map(r => {
                  const v = vehicles.find(v => v.id === r.vehicleId);
                  return (
                    <tr key={r.vehicleId} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-xs font-mono font-medium text-gray-800">{r.vehicleId}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">{v?.driverName}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">Ward {v?.wardId}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{r.originalDistanceKm.toFixed(1)} km</td>
                      <td className="px-3 py-2.5 text-xs text-green-700 font-medium">{r.optimizedDistanceKm.toFixed(1)} km</td>
                      <td className="px-3 py-2.5 text-xs font-semibold text-green-600">-{r.distanceSavedKm.toFixed(1)} km</td>
                      <td className="px-3 py-2.5 text-xs text-blue-600">{r.timeSavedMin} min</td>
                      <td className="px-3 py-2.5 text-xs text-orange-600">{r.fuelSavedL.toFixed(1)} L</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 max-w-xs">
                        <ul className="space-y-0.5">
                          {r.reasoning.slice(0, 2).map((reason, i) => (
                            <li key={i} className="truncate" title={reason}>• {reason}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
