
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
  Cloud,
  Send
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
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [principal, setPrincipal] = useState({
    name: 'Ikhbariyati Mahrunnisa, S.Pd, Gr',
    nip: '198501012010012001', // NIP Default Kepala Sekolah
    role: 'Kepala Sekolah',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ikhbariyati'
  });

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
    const newObs = [...observations.filter(o => o.teacherId !== data.teacherId), data];
    setObservations(newObs);
    
    try {
      await cloudStorage.save(data);
    } catch (err) {
      console.error("Gagal menyimpan ke cloud:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualSync = async () => {
    if (observations.length === 0) return alert("Tidak ada data untuk dikirim.");
    
    setIsSyncing(true);
    try {
      // Mengirim ulang semua data lokal ke cloud untuk memastikan sinkronisasi
      for (const obs of observations) {
        await cloudStorage.save(obs);
      }
      alert("Semua data berhasil dikirim ke Spreadsheet!");
    } catch (err) {
      alert("Gagal sinkronisasi: " + err);
    } finally {
      setIsSyncing(false);
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={18} />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard observations={observations} />;
      case 'pra': return <PreObservation onSave={updateObservations} principalNip={principal.nip} />;
      case 'observasi': return <ObservationForm observations={observations} onSave={updateObservations} />;
      case 'pasca': return <PostObservation observations={observations} onSave={updateObservations} />;
      case 'laporan': return <ReportView observations={observations} principalName={principal.name} principalNip={principal.nip} />;
      default: return <Dashboard observations={observations} />;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar - Fixed Position */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-40 print:hidden flex flex-col shadow-sm">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ClipboardCheck className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">SUPERVISI</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-12">SMPN 4 Mappedeceng</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          
          <div className="mt-8 mb-2 px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alur Kerja</span>
          </div>
          <NavItem id="pra" icon={Calendar} label="1. Pra-Observasi" />
          <NavItem id="observasi" icon={ClipboardCheck} label="2. Pelaksanaan" />
          <NavItem id="pasca" icon={Users} label="3. Pasca & Coaching" />
          
          <div className="mt-8 mb-2 px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dokumentasi</span>
          </div>
          <NavItem id="laporan" icon={BarChart3} label="Laporan Akhir" />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl mb-4 transition-all ${isSyncing ? 'bg-amber-100 text-amber-600' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95'}`}
          >
            {isSyncing ? <Cloud size={16} className="animate-pulse" /> : <Send size={16} />}
            <span className="text-xs font-bold uppercase tracking-wider">{isSyncing ? 'Mengirim...' : 'Kirim ke Spreadsheet'}</span>
          </button>
          
          <div className="px-4 py-2 space-y-2">
             <label className="text-[9px] font-bold text-slate-400 uppercase">NIP Kepala Sekolah</label>
             <input 
               type="text" 
               value={principal.nip}
               onChange={(e) => setPrincipal({...principal, nip: e.target.value})}
               className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
               placeholder="Masukkan NIP"
             />
          </div>
          <button className="flex items-center space-x-3 w-full px-4 py-2 text-slate-400 hover:text-slate-900 transition-colors mt-2">
            <Settings size={18} />
            <span className="text-sm font-medium">Pengaturan</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Shifted Right */}
      <div className="flex-1 flex flex-col ml-72 min-w-0 print:ml-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 print:hidden">
          <div className="flex items-center bg-slate-100 px-4 py-2.5 rounded-2xl w-full max-w-md border border-slate-200">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari data guru..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{principal.name}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{principal.role}</p>
            </div>
            <img 
              src={principal.photo} 
              className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm bg-slate-200" 
              alt="Profile" 
            />
          </div>
        </header>

        <main className="p-10 w-full max-w-6xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
