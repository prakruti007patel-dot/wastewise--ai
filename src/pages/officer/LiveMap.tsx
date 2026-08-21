import { LeafletMap } from '../../components/maps/LeafletMap';
import { Card, KPICard, SectionHeader } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/Badges';
import { PageHeader } from '../../components/common/Table';
import { vehicles } from '../../data/vehicles';
import { wards } from '../../data/wards';

export default function LiveMapPage() {
  const onRoute = vehicles.filter(v => v.status === 'on_route').length;
  const full = vehicles.filter(v => v.status === 'full').length;
  const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
  const avgLoad = Math.round(vehicles.reduce((s, v) => s + (v.currentLoad / v.capacity) * 100, 0) / vehicles.length);

  return (
    <div>
      <PageHeader
        title="Live Collection Map"
        subtitle="Real-time vehicle tracking and collection point monitoring across all 24 wards"
        breadcrumb="Officer · Live Map"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KPICard title="On Route" value={onRoute} subtitle={`${vehicles.length} fleet total`} color="green" />
        <KPICard title="Full / Critical" value={full} subtitle="Need return to depot" color="red" />
        <KPICard title="Maintenance" value={maintenance} subtitle="Offline today" color="orange" />
        <KPICard title="Avg Load" value={`${avgLoad}%`} subtitle="Fleet average" color={avgLoad > 80 ? 'orange' : 'green'} />
      </div>

      <Card padding="none" className="mb-5">
        <div className="p-4 border-b border-gray-100">
          <SectionHeader title="Live Vehicle & Collection Map" subtitle="OpenStreetMap — Demo locations (fictional Gujarat municipal area)" />
        </div>
        <LeafletMap vehicles={vehicles} height="500px" className="rounded-b-xl border-0" />
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500 rounded-b-xl">
          <span className="flex items-center gap-1.5"><span className="text-base">🚛</span>Vehicle On Route</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Vehicle Full/Critical</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />Maintenance</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />Collection Point (pending)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Collected</span>
          <span className="ml-auto text-gray-400">⚠ Demo locations — fictional Gujarat municipal area</span>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Vehicle Fleet Status" subtitle={`All ${vehicles.length} vehicles`} />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Vehicle ID', 'Driver', 'Ward', 'Status', 'Load', 'Progress', 'Fuel', 'Pts Done/Total', 'Last Updated'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map(v => {
                const loadPct = Math.round(v.currentLoad / v.capacity * 100);
                const minsAgo = Math.round((Date.now() - new Date(v.lastUpdated).getTime()) / 60000);
                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-xs font-mono font-medium text-gray-800">{v.id}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-700">{v.driverName}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">Ward {v.wardId}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={v.status} /></td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${loadPct >= 90 ? 'bg-red-500' : loadPct >= 70 ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${loadPct}%` }} />
                        </div>
                        <span className="text-[11px] text-gray-500">{v.currentLoad}t</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${v.routeProgress}%` }} />
                        </div>
                        <span className="text-[11px] text-gray-500">{v.routeProgress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-500">{v.fuelLevel}%</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{v.collectionPointsCompleted}/{v.collectionPointsTotal}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-400">{minsAgo}m ago</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
