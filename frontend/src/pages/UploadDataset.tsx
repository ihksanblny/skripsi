import { useDashboard } from '../hooks/useDashboard';
import Alert from '../components/Alert';
import UploadCard from '../components/card/UploadCard';
import DatabaseView from '../components/DatabaseView';

export default function UploadDatasetView() {
  const { loadingImport, notification, handleImport } = useDashboard();

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 mx-auto text-stone-800">

      <Alert message={notification} />

      {/* Welcome Banner */}
      <div className="bg-white border border-stone-200 text-center py-4 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <h2 className="text-orange-600 font-syne font-black tracking-[0.3em] uppercase text-[11px]">Welcome Admin</h2>
      </div>

      {/* Kotak Upload via Component */}
      <UploadCard loadingImport={loadingImport} handleImport={handleImport} />

      {/* Kotak Preview Data Live (Menarik dari MySQL) */}
      <DatabaseView />

    </div>
  );
}