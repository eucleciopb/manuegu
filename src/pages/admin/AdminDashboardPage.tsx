import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { StatsCard, AdminTable } from '../../components/admin/AdminComponents';
import { SupabaseStatusBanner } from '../../components/admin/SupabaseStatusBanner';
import {
  isAdminAuthenticated,
  setAdminSession,
  getDashboardStats,
  getAllConfirmations,
  confirmGuestContribution,
  removeGuest,
} from '../../services/adminService';
import { releaseGift, confirmPixPayment, getAllGifts, createGift, updateGift, deleteGift } from '../../services/giftService';
import type { Gift, GiftFormData } from '../../types';
import { GiftFormModal } from '../../components/admin/GiftFormModal';
import {
  formatCurrency,
  formatDate,
  formatWhatsApp,
  deliveryMethodLabel,
  pixStatusLabel,
  exportToCsv,
} from '../../lib/utils';
import type { ConfirmationRow, DashboardStats } from '../../types';

type Tab = 'dashboard' | 'confirmations' | 'gifts' | 'financial';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [confirmations, setConfirmations] = useState<ConfirmationRow[]>([]);
  const [allGifts, setAllGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [giftModal, setGiftModal] = useState<{ open: boolean; gift: Gift | null }>({
    open: false,
    gift: null,
  });
  const [giftError, setGiftError] = useState('');
  const [guestError, setGuestError] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [navigate]);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, confirmationsData, giftsData] = await Promise.all([
        getDashboardStats(),
        getAllConfirmations(),
        getAllGifts(),
      ]);
      setStats(statsData);
      setConfirmations(confirmationsData);
      setAllGifts(giftsData);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setAdminSession(false);
    navigate('/admin');
  }

  async function handleReleaseGift(giftId: string) {
    setActionLoading(giftId);
    try {
      await releaseGift(giftId);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleConfirmContribution(guestId: string) {
    setActionLoading(guestId);
    try {
      await confirmGuestContribution(guestId);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleConfirmPix(pixId: string) {
    setActionLoading(pixId);
    try {
      await confirmPixPayment(pixId);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteGuest(row: ConfirmationRow) {
    const guestName = `${row.guest.first_name} ${row.guest.last_name}`;
    const message = row.gift
      ? `Excluir ${guestName}? O presente "${row.gift.name}" voltará a ficar disponível.`
      : `Excluir ${guestName}? Esta ação não pode ser desfeita.`;

    if (!confirm(message)) return;

    setActionLoading(`delete-guest-${row.guest.id}`);
    setGuestError('');
    try {
      await removeGuest(row.guest.id);
      await loadData();
    } catch (err) {
      setGuestError(err instanceof Error ? err.message : 'Erro ao excluir convidado');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSaveGift(form: GiftFormData) {
    if (giftModal.gift) {
      await updateGift(giftModal.gift.id, form);
    } else {
      await createGift(form);
    }
    await loadData();
  }

  async function handleDeleteGift(gift: Gift) {
    if (!confirm(`Excluir o presente "${gift.name}"?`)) return;
    setActionLoading(`delete-${gift.id}`);
    setGiftError('');
    try {
      await deleteGift(gift.id);
      await loadData();
    } catch (err) {
      setGiftError(err instanceof Error ? err.message : 'Erro ao excluir presente');
    } finally {
      setActionLoading(null);
    }
  }

  function handleExport() {
    const rows = confirmations.map((c) => ({
      Nome: `${c.guest.first_name} ${c.guest.last_name}`,
      WhatsApp: c.guest.whatsapp,
      Instagram: c.guest.instagram || '',
      Comparecerá: c.guest.will_attend ? 'Sim' : 'Não',
      Pessoas: String(c.guest.guest_count ?? ''),
      Mensagem: c.guest.message || '',
      Presente: c.gift?.name || '',
      Valor: c.gift ? formatCurrency(c.gift.price) : '',
      'Forma de entrega': deliveryMethodLabel(c.reservation?.delivery_method ?? null),
      'Status PIX': c.pixPayment
        ? pixStatusLabel(c.pixPayment.status)
        : pixStatusLabel(c.guest.pix_contribution_status),
      'Contribuição': c.guest.pix_contribution_amount
        ? formatCurrency(c.guest.pix_contribution_amount)
        : '',
      'Data confirmação': formatDate(c.guest.created_at),
    }));
    exportToCsv(rows, `confirmacoes-cha-casa-nova-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'confirmations', label: 'Confirmações' },
    { id: 'gifts', label: 'Presentes' },
    { id: 'financial', label: 'Financeiro' },
  ];

  const pixRows = confirmations.filter((c) => c.pixPayment);
  const contributionRows = confirmations.filter(
    (c) => c.guest.pix_contribution_amount && c.guest.pix_contribution_status
  );

  function getGiftReservationInfo(giftId: string) {
    return confirmations.find((c) => c.gift?.id === giftId);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Painel Admin</h1>
          <p>Chá de Casa Nova — Manu & Gustavo</p>
        </div>
        <div className="admin-header-actions">
          <Button variant="outline" size="sm" onClick={handleExport}>
            Exportar CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <nav className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`admin-tab ${tab === t.id ? 'admin-tab-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="loading-text">Carregando...</p>
      ) : (
        <div className="admin-content">
          <SupabaseStatusBanner />
          {tab === 'dashboard' && stats && (
            <div className="stats-grid">
              <StatsCard label="Confirmados" value={stats.totalConfirmed} icon="✅" variant="success" />
              <StatsCard label="Total de pessoas" value={stats.totalPeople} icon="👥" />
              <StatsCard label="Presentes reservados" value={stats.giftsReserved} icon="🎁" />
              <StatsCard label="PIX aguardando" value={stats.pixPending} icon="💳" variant="warning" />
              <StatsCard label="Ausências" value={stats.absences} icon="💌" variant="danger" />
            </div>
          )}

          {tab === 'confirmations' && (
            <>
              {guestError && <p className="form-error-global">{guestError}</p>}
              <AdminTable
                headers={[
                  'Nome',
                  'WhatsApp',
                  'Pessoas',
                  'Mensagem',
                  'Presente',
                  'Entrega',
                  'PIX',
                  'Data',
                  'Ações',
                ]}
              >
                {confirmations.map((c) => (
                  <tr key={c.guest.id}>
                    <td>{c.guest.first_name} {c.guest.last_name}</td>
                    <td>{formatWhatsApp(c.guest.whatsapp)}</td>
                    <td>{c.guest.will_attend ? (c.guest.guest_count ?? 1) : '—'}</td>
                    <td className="cell-message">{c.guest.message || '—'}</td>
                    <td>{c.gift?.name || '—'}</td>
                    <td>{deliveryMethodLabel(c.reservation?.delivery_method ?? null)}</td>
                    <td>
                      <span className={`badge badge-${c.pixPayment?.status || 'none'}`}>
                        {pixStatusLabel(c.pixPayment?.status ?? null)}
                      </span>
                    </td>
                    <td>{formatDate(c.guest.created_at)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={actionLoading === `delete-guest-${c.guest.id}`}
                        onClick={() => handleDeleteGuest(c)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </>
          )}

          {tab === 'gifts' && (
            <>
              <div className="admin-section-header">
                <p className="admin-section-desc">Gerencie a lista de presentes disponíveis para os convidados.</p>
                <Button size="sm" onClick={() => setGiftModal({ open: true, gift: null })}>
                  + Novo presente
                </Button>
              </div>

              {giftError && <p className="form-error-global">{giftError}</p>}

              <AdminTable
                headers={['Foto', 'Presente', 'Link', 'Status', 'Reservado por', 'Entrega', 'Ações']}
              >
                {allGifts.map((gift) => {
                  const info = getGiftReservationInfo(gift.id);
                  return (
                    <tr key={gift.id}>
                      <td>
                        <img src={gift.image_url} alt={gift.name} className="admin-gift-thumb" />
                      </td>
                      <td>{gift.name}</td>
                      <td>
                        {gift.purchase_url ? (
                          <a
                            href={gift.purchase_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-gift-link"
                          >
                            Abrir link ↗
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${gift.status}`}>
                          {gift.status === 'reserved' ? 'Reservado' : 'Disponível'}
                        </span>
                      </td>
                      <td>
                        {info
                          ? `${info.guest.first_name} ${info.guest.last_name}`
                          : '—'}
                      </td>
                      <td>{deliveryMethodLabel(info?.reservation?.delivery_method ?? null)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGiftModal({ open: true, gift })}
                          >
                            Editar
                          </Button>
                          {gift.status === 'reserved' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              loading={actionLoading === gift.id}
                              onClick={() => handleReleaseGift(gift.id)}
                            >
                              Liberar
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            loading={actionLoading === `delete-${gift.id}`}
                            onClick={() => handleDeleteGift(gift)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </AdminTable>

              {giftModal.open && (
                <GiftFormModal
                  gift={giftModal.gift}
                  onClose={() => setGiftModal({ open: false, gift: null })}
                  onSave={handleSaveGift}
                />
              )}
            </>
          )}

          {tab === 'financial' && (
            <AdminTable
              headers={['Convidado', 'Tipo', 'Referência', 'Valor', 'Status', 'Ações']}
            >
              {pixRows.map((c) => (
                <tr key={`pix-${c.pixPayment!.id}`}>
                  <td>{c.guest.first_name} {c.guest.last_name}</td>
                  <td>Presente</td>
                  <td>{c.gift?.name}</td>
                  <td>{formatCurrency(c.pixPayment!.amount)}</td>
                  <td>
                    <span className={`badge badge-${c.pixPayment!.status}`}>
                      {pixStatusLabel(c.pixPayment!.status)}
                    </span>
                  </td>
                  <td>
                    {c.pixPayment!.status === 'pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={actionLoading === c.pixPayment!.id}
                        onClick={() => handleConfirmPix(c.pixPayment!.id)}
                      >
                        Confirmar PIX
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {contributionRows.map((c) => (
                <tr key={`contrib-${c.guest.id}`}>
                  <td>{c.guest.first_name} {c.guest.last_name}</td>
                  <td>Contribuição</td>
                  <td>Não comparecerá</td>
                  <td>{formatCurrency(c.guest.pix_contribution_amount!)}</td>
                  <td>
                    <span className={`badge badge-${c.guest.pix_contribution_status}`}>
                      {pixStatusLabel(c.guest.pix_contribution_status)}
                    </span>
                  </td>
                  <td>
                    {c.guest.pix_contribution_status === 'pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={actionLoading === c.guest.id}
                        onClick={() => handleConfirmContribution(c.guest.id)}
                      >
                        Confirmar PIX
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
      )}
    </div>
  );
}
