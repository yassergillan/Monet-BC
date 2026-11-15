import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { TabPengajuan } from './components/TabPengajuan';
import { TabJadwal } from './components/TabJadwal';
import { TabTemuan } from './components/TabTemuan';
import { TabDashboard } from './components/TabDashboard';
import { ModalMonitor } from './components/ModalMonitor';
import { ModalDetailPengajuan } from './components/ModalDetailPengajuan';
import { ModalReview } from './components/ModalReview';
import { ModalDetailTemuan } from './components/ModalDetailTemuan';
import { ModalReschedule } from './components/ModalReschedule';
import { ModalCetakSurat } from './components/ModalCetakSurat';
import { ModalUserSwitch } from './components/ModalUserSwitch';
import { LoginScreen } from './components/LoginScreen';
import { FloatingMobileActions } from './components/FloatingMobileActions';
import { Toast } from './components/Toast';
import { Lightbox } from './components/Lightbox';

import { Pengajuan, Jadwal, Temuan, KepatuhanStatus, UserAccount } from './types';
import {
  initSampleDataIfEmpty,
  getPengajuanList,
  getJadwalList,
  getTemuanList,
  saveJadwalList,
  getLoggedInUser,
  loginAsUserDirect,
  logoutUser,
} from './utils/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(getLoggedInUser());
  const [isUserSwitchOpen, setIsUserSwitchOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabType>('pengajuan');
  const [jadwalStatusFilter, setJadwalStatusFilter] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-redirect Staff BC if on Dashboard tab
  useEffect(() => {
    if (currentUser && currentUser.role === 'STAFF_BC' && activeTab === 'dash') {
      setActiveTab('jadwal');
    }
  }, [currentUser, activeTab]);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    handleShowToast(`Selamat datang kembali, ${user.name} (${user.role === 'HEAD_MANAGER' ? 'Head / Manager' : `Staff BC - ${user.picName}`})`);
    if (user.role === 'STAFF_BC' && activeTab === 'dash') {
      setActiveTab('jadwal');
    }
    setRefreshCounter((c) => c + 1);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    handleShowToast('Anda telah keluar dari sistem.');
  };

  const handleSelectUser = (user: UserAccount) => {
    const updated = loginAsUserDirect(user.id);
    setCurrentUser(updated);
    handleShowToast(`Beralih ke akun: ${updated.name} (${updated.role === 'HEAD_MANAGER' ? 'Head / Manager' : `Staff BC - ${updated.picName}`})`);
    if (updated.role === 'STAFF_BC' && activeTab === 'dash') {
      setActiveTab('jadwal');
    }
    setRefreshCounter((c) => c + 1);
  };

  const handleNavigateFromDashboard = (tab: TabType, statusFilter?: string) => {
    if (currentUser && currentUser.role === 'STAFF_BC' && tab === 'dash') {
      setActiveTab('jadwal');
      return;
    }
    if (tab === 'jadwal') {
      setJadwalStatusFilter(statusFilter || '');
    } else {
      setJadwalStatusFilter('');
    }
    setActiveTab(tab);
  };
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Modals state
  const [monitorJadwal, setMonitorJadwal] = useState<Jadwal | null>(null);
  const [reviewJadwal, setReviewJadwal] = useState<Jadwal | null>(null);
  const [rescheduleJadwal, setRescheduleJadwal] = useState<Jadwal | null>(null);
  const [detailPengajuan, setDetailPengajuan] = useState<Pengajuan | null>(null);
  const [detailTemuan, setDetailTemuan] = useState<Temuan | null>(null);
  const [cetakPengajuan, setCetakPengajuan] = useState<Pengajuan | null>(null);
  const [cetakTemuan, setCetakTemuan] = useState<Temuan | null>(null);

  // State trigger for re-rendering when storage updates
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    initSampleDataIfEmpty();
    setRefreshCounter((c) => c + 1);
  }, []);

  const handleRefreshAll = () => {
    setRefreshCounter((c) => c + 1);
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleOpenMonitorModal = (j: Jadwal) => {
    setMonitorJadwal(j);
  };

  const handleOpenReviewModal = (j: Jadwal) => {
    setReviewJadwal(j);
  };

  const handleOpenRescheduleModal = (j: Jadwal) => {
    setRescheduleJadwal(j);
  };

  const handleSaveReschedule = (jadwalId: string, newDate: string, newCatatan: string) => {
    const list = getJadwalList();
    const target = list.find((x) => x.id === jadwalId);
    if (target) {
      target.tanggal = newDate;
      if (newCatatan && target.hasil) {
        target.hasil.catatan = newCatatan;
      }
      saveJadwalList(list);
      handleShowToast(`Jadwal ${jadwalId} berhasil di-reschedule ke ${newDate}`);
      handleRefreshAll();
    }
  };

  const handleOpenDetailPengajuan = (p: Pengajuan) => {
    setDetailPengajuan(p);
  };

  const handleOpenDetailTemuan = (t: Temuan) => {
    setDetailTemuan(t);
  };

  const handleSaveMonitorResult = async (
    jadwalId: string,
    hasil: {
      progress: string;
      status: KepatuhanStatus;
      kategoriPelanggaran: string[];
      catatan: string;
      komplainTetangga: 'Tidak Ada' | 'Ya - Biasa' | 'Ya - Perlu Penanganan Segera';
      komplainDetail?: string;
      foto: Array<{ name: string; type: string; dataUrl: string }>;
      waktuInput: string;
    }
  ) => {
    const list = getJadwalList();
    const target = list.find((x) => x.id === jadwalId);
    if (target) {
      target.status = 'Selesai';
      target.hasil = hasil;
      saveJadwalList(list);
      handleRefreshAll();
    }
  };

  if (!currentUser) {
    return (
      <>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </>
    );
  }

  const jadwalList = getJadwalList();
  const pendingJadwalCount = (currentUser.role === 'STAFF_BC' && currentUser.picName
    ? jadwalList.filter((j) => j.status === 'Terjadwal' && j.pic === currentUser.picName)
    : jadwalList.filter((j) => j.status === 'Terjadwal')
  ).length;

  const temuanCount = getTemuanList().length;

  const reviewPengajuan = reviewJadwal
    ? getPengajuanList().find((p) => p.izin === reviewJadwal.izin) || null
    : null;

  const monitorPengajuan = monitorJadwal
    ? getPengajuanList().find((p) => p.izin === monitorJadwal.izin) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      <Header
        currentUser={currentUser}
        onOpenUserSwitch={() => setIsUserSwitchOpen(true)}
        onLogout={handleLogout}
        onRefreshData={handleRefreshAll}
        onShowToast={handleShowToast}
      />

      <Navbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (currentUser.role === 'STAFF_BC' && tab === 'dash') return;
          setActiveTab(tab);
        }}
        pendingJadwalCount={pendingJadwalCount}
        temuanCount={temuanCount}
        currentUser={currentUser}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-24 sm:pb-12">
        {activeTab === 'pengajuan' && (
          <TabPengajuan
            key={`pengajuan_${refreshCounter}`}
            onRefreshAll={handleRefreshAll}
            onShowToast={handleShowToast}
            onOpenDetail={handleOpenDetailPengajuan}
            onPrintSurat={(p) => setCetakPengajuan(p)}
          />
        )}

        {activeTab === 'jadwal' && (
          <TabJadwal
            key={`jadwal_${refreshCounter}_${jadwalStatusFilter}_${currentUser.id}`}
            initialStatusFilter={jadwalStatusFilter}
            onOpenMonitorModal={handleOpenMonitorModal}
            onOpenReviewModal={handleOpenReviewModal}
            onOpenRescheduleModal={handleOpenRescheduleModal}
            onShowToast={handleShowToast}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'temuan' && (
          <TabTemuan
            key={`temuan_${refreshCounter}`}
            onRefreshAll={handleRefreshAll}
            onShowToast={handleShowToast}
            onOpenDetailTemuan={handleOpenDetailTemuan}
            onPrintSurat={(t) => setCetakTemuan(t)}
          />
        )}

        {activeTab === 'dash' && currentUser.role === 'HEAD_MANAGER' && (
          <TabDashboard
            key={`dash_${refreshCounter}`}
            onNavigateTab={handleNavigateFromDashboard}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Building Control - Kota Baru Parahyangan</span>
          <span className="font-semibold text-slate-600">Mobile Friendly Inspector System</span>
        </div>
      </footer>

      {/* Account Switcher Modal */}
      <ModalUserSwitch
        currentUser={currentUser}
        isOpen={isUserSwitchOpen}
        onClose={() => setIsUserSwitchOpen(false)}
        onSelectUser={handleSelectUser}
      />

      {/* Modals */}
      <ModalMonitor
        jadwal={monitorJadwal}
        pengajuan={monitorPengajuan}
        onClose={() => setMonitorJadwal(null)}
        onSave={handleSaveMonitorResult}
        onShowToast={handleShowToast}
      />


      <ModalReview
        jadwal={reviewJadwal}
        pengajuan={reviewPengajuan}
        onClose={() => setReviewJadwal(null)}
        onOpenImage={(url) => setLightboxSrc(url)}
      />

      <ModalDetailPengajuan
        pengajuan={detailPengajuan}
        onClose={() => setDetailPengajuan(null)}
        onOpenImage={(url) => setLightboxSrc(url)}
        onPrintSurat={(p) => setCetakPengajuan(p)}
      />

      <ModalDetailTemuan
        temuan={detailTemuan}
        onClose={() => setDetailTemuan(null)}
        onOpenImage={(url) => setLightboxSrc(url)}
        onPrintSurat={(t) => setCetakTemuan(t)}
      />

      <ModalReschedule
        jadwal={rescheduleJadwal}
        onClose={() => setRescheduleJadwal(null)}
        onSave={handleSaveReschedule}
      />

      <ModalCetakSurat
        pengajuan={cetakPengajuan}
        temuan={cetakTemuan}
        onClose={() => {
          setCetakPengajuan(null);
          setCetakTemuan(null);
        }}
      />

      {/* Floating Speed Dial / Quick Actions for Mobile */}
      <FloatingMobileActions
        onNavigateTab={handleNavigateFromDashboard}
        onShowToast={handleShowToast}
      />

      {/* Global Toast & Lightbox */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  );
}
