
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  ChevronRight,
  Plus,
  Calendar,
  Cloud
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PreObservation from './components/PreObservation';
import ObservationForm from './components/ObservationForm';
import PostObservation from './components/PostObservation';
import ReportView from './components/ReportView';
import { SupervisionStatus, ObservationData } from './types';
import { cloudStorage } from './services/sheetsService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [observations, setObservations] = useState<ObservationData[]>([]);
  const [imageError, setImageError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // INFORMASI KEPALA SEKOLAH
  const [principal, setPrincipal] = useState({
    name: 'Ikhbariyati Mahrunnisa, S.Pd, Gr',
    role: 'Kepala Sekolah',
    photo: 'https://drive.google.com/thumbnail?id=1o0G5X83hUQ-Is5XtOwXdk8v1uWuM-h9T&sz=w500'
  });

  // Load data from Cloud on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsSyncing(true);
      try {
        const cloudData = await cloudStorage.fetchAll();
        setObservations(cloudData);
      } catch (err) {
        console.error("Gagal mengambil data cloud:", err);
      } finally {
        setIsSyncing(false);
      }
    };
    loadInitialData();
  }, []);

  const updateObservations = async (data: ObservationData) => {
    setIsSyncing(true);
    // Optimistic Update UI
    const newObs = [...observations.filter(o => o.teacherId !== data.teacherId), data];
    setObservations(newObs);
    
    try {
      await cloudStorage.save(data);
    } catch (err) {
      console.error("Gagal menyimpan ke cloud:", err);
      alert("Gagal sinkronisasi ke Google Sheets. Data tersimpan lokal sementara.");
    } finally {
      setIsSyncing(false);
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard observations={observations} />;
      case 'pra': return <PreObservation onSave={updateObservations} />;
      case 'observasi': return <ObservationForm observations={observations} onSave={updateObservations} />;
      case 'pasca': return <PostObservation observations={observations} onSave={updateObservations} />;
      case 'laporan': return <ReportView observations={observations} principalName={principal.name} />;
      default: return <Dashboard observations={observations} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full print:hidden">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ClipboardCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Supervisi</h1>
            <p className="text-xs text-slate-500 font-medium">UPT SMPN 4 Mappedeceng</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Beranda" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tahapan</div>
          <NavItem id="pra" icon={Calendar} label="Pra-Observasi" />
          <NavItem id="observasi" icon={ClipboardCheck} label="Pelaksanaan" />
          <NavItem id="pasca" icon={Users} label="Pasca & Coaching" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Analitik</div>
          <NavItem id="laporan" icon={BarChart3} label="Laporan & Hasil" />
        </nav>

        {/* Status Cloud */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 text-xs font-bold ${isSyncing ? 'text-amber-500 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
            <Cloud size={16} className={isSyncing ? 'animate-pulse' : ''} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Cloud Terhubung'}</span>
          </div>
          <button className="flex items-center space-x-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <Settings size={20} />
            <span className="font-medium">Pengaturan</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 print:ml-0 print:bg-white">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 print:hidden">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-96">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari guru atau dokumen..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{principal.name}</p>
                <p className="text-xs text-slate-500">{principal.role}</p>
              </div>
              
              <div className="relative group">
                {!imageError ? (
                  <img 
                    src={principal.photo} 
                    onError={() => setImageError(true)}
                    className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover shadow-sm group-hover:border-blue-500 transition-all cursor-pointer" 
                    alt="Profile" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-blue-100 bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {principal.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto print:p-0 print:max-w-none">
          {renderContent()}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background-color: white !important; }
          .print-document { display: block !important; }
          #root > div > aside,
          #root > div > main > header { display: none !important; }
          #root > div > main { margin-left: 0 !important; }
        }
      `}} />
    </div>
  );
};

export default App;
