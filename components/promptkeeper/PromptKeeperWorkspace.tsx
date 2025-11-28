'use client';

import {
  Archive,
  Grid,
  Menu,
  Search,
  ShoppingBag,
  Trash2,
  User,
  X,
} from 'lucide-react';

import { usePromptKeeper } from '@/hooks/usePromptKeeper';
import {
  PromptKeeperNoteCard,
  PromptKeeperNoteEditor,
} from '@/components/promptkeeper/PromptKeeperNoteComponents';
import { PromptKeeperMarketplace } from '@/components/promptkeeper/PromptKeeperMarketplace';
import { PromptNote, ViewMode } from '@/types/promptKeeper';
import { cn } from '@/lib/utils';

interface PromptKeeperWorkspaceProps {
  className?: string;
}

export const PromptKeeperWorkspace = ({
  className,
}: PromptKeeperWorkspaceProps) => {
  const {
    notes,
    pinnedNotes,
    otherNotes,
    viewMode,
    setViewMode,
    isSidebarOpen,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    isPaidUser,
    showPayModal,
    openPaywall,
    closePaywall,
    isProcessingPurchase,
    paymentError,
    balance,
    currentUser,
    isFetchingUser,
  unlockCost,
  unlockReason,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    handlePinNote,
    handleUnlockWithPoints,
  } = usePromptKeeper();

  return (
    <section
      id="promptkeeper"
      className={cn('py-20 px-4 bg-background', className)}
    >
      <div className="container mx-auto">
        <div className="rounded-3xl border border-gray-200 shadow-xl overflow-hidden bg-white">
          <PromptKeeperHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isPaidUser={isPaidUser}
            balance={balance}
          />

          <div className="flex min-h-[640px]">
            <PromptKeeperSidebar
              current={viewMode}
              onChange={setViewMode}
              isSidebarOpen={isSidebarOpen}
            />

            <main
              className={cn(
                'flex-1 p-8 transition-all duration-300',
                isSidebarOpen ? 'ml-0' : 'ml-0'
              )}
            >
              {viewMode === 'notes' ? (
                <>
                  <PromptKeeperNoteEditor onCreate={handleCreateNote} />
                  <PromptKeeperNoteGrid
                    pinned={pinnedNotes}
                    others={otherNotes}
                    total={notes.length}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                    onPin={handlePinNote}
                  />
                </>
              ) : (
                <PromptKeeperMarketplace
                  isPaidUser={isPaidUser}
                  onUnlockRequest={() => {
                    if (!isPaidUser) {
                      openPaywall();
                    }
                  }}
                />
              )}
            </main>
          </div>
        </div>
      </div>

      <PromptKeeperPaywallModal
        isOpen={showPayModal}
        onClose={closePaywall}
        onConfirm={() => handleUnlockWithPoints({ amount: unlockCost, reason: unlockReason })}
        isLoading={isProcessingPurchase}
        errorMessage={paymentError}
        balance={balance}
        currentUserLabel={currentUser?.id}
        isFetchingUser={isFetchingUser}
        cost={unlockCost}
        reason={unlockReason}
      />
    </section>
  );
};

interface PromptKeeperNoteGridProps {
  pinned: PromptNote[];
  others: PromptNote[];
  total: number;
  onUpdate: (note: PromptNote) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}

const PromptKeeperNoteGrid = ({
  pinned,
  others,
  total,
  onUpdate,
  onDelete,
  onPin,
}: PromptKeeperNoteGridProps) => {
  return (
    <div className="space-y-10">
      {pinned.length > 0 && (
        <section>
          <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            已固定
          </h6>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pinned.map((note) => (
              <PromptKeeperNoteCard
                key={note.id}
                note={note}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onPin={onPin}
              />
            ))}
          </div>
        </section>
      )}

      {pinned.length > 0 && others.length > 0 && (
        <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          其他
        </h6>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {others.map((note) => (
          <PromptKeeperNoteCard
            key={note.id}
            note={note}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onPin={onPin}
          />
        ))}
      </div>

      {total === 0 && (
        <div className="text-center text-gray-400">
          <div className="inline-block p-6 rounded-full bg-gray-50 mb-4">
            <Grid size={32} />
          </div>
          <p>还没有提示词，点击上方输入框开始创作</p>
        </div>
      )}
    </div>
  );
};

PromptKeeperNoteGrid.displayName = 'PromptKeeperNoteGrid';

interface PromptKeeperHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isPaidUser: boolean;
  balance: number | null;
}

const PromptKeeperHeader = ({
  toggleSidebar,
  searchQuery,
  onSearchChange,
  isPaidUser,
  balance,
}: PromptKeeperHeaderProps) => {
  return (
    <header className="h-20 border-b border-gray-100 flex items-center px-6 bg-white">
      <div className="flex items-center w-64">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full mr-3 text-gray-600"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center text-amber-500 font-bold text-xl">
          <span className="bg-amber-400 text-white px-2 py-1 rounded mr-2">
            PK
          </span>
          <span className="text-gray-700">PromptKeeper</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto">
        <div className="bg-gray-100 rounded-xl flex items-center px-3 py-2 focus-within:bg-white focus-within:shadow-sm transition-all">
          <Search className="text-gray-500 mr-3" size={18} />
          <input
            type="text"
            placeholder="搜索提示词..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      {/* <div className="w-64 flex justify-end items-center gap-3">
        {typeof balance === 'number' && (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            余额 {balance}
          </span>
        )}
        {isPaidUser && (
          <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded uppercase">
            Premium
          </span>
        )}
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          <User size={18} />
        </div>
      </div> */}
    </header>
  );
};

interface PromptKeeperSidebarProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
  isSidebarOpen: boolean;
}

const PromptKeeperSidebar = ({
  current,
  onChange,
  isSidebarOpen,
}: PromptKeeperSidebarProps) => {
  const navItemClass = (mode: ViewMode) =>
    cn(
      'w-full flex items-center px-5 py-3 rounded-2xl text-sm font-medium transition-colors',
      current === mode
        ? 'bg-amber-100 text-amber-900 shadow-sm'
        : 'hover:bg-gray-100 text-gray-700'
    );

  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col md:w-64 border-r border-gray-100 bg-white p-4 space-y-2 transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
      )}
    >
      <button
        onClick={() => onChange('notes')}
        className={navItemClass('notes')}
      >
        <Grid size={18} className="mr-3" />
        我的提示词
      </button>
      <button
        onClick={() => onChange('market')}
        className={navItemClass('market')}
      >
        <ShoppingBag size={18} className="mr-3" />
        提示词市场
      </button>
      <div className="border-t border-gray-100 my-2" />
      <button className="w-full flex items-center px-5 py-3 rounded-2xl text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
        <Archive size={18} className="mr-3" />
        Archive
      </button>
      <button className="w-full flex items-center px-5 py-3 rounded-2xl text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
        <Trash2 size={18} className="mr-3" />
        Trash
      </button>
    </aside>
  );
};

interface PromptKeeperPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
  isLoading: boolean;
  errorMessage: string | null;
  balance: number | null;
  currentUserLabel?: string;
  isFetchingUser: boolean;
  cost: number;
  reason?: string;
}

const PromptKeeperPaywallModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  errorMessage,
  balance,
  currentUserLabel,
  isFetchingUser,
  cost,
  reason,
}: PromptKeeperPaywallModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            解锁 PromptKeeper Premium
          </h3>
          <p className="text-gray-500 mt-2 text-sm">
            扣除 {cost} 积分即可使用全部高级提示词合集
            {reason ? `（${reason}）` : ''}。
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>当前账号</span>
            <span className="font-medium">{currentUserLabel || '未登录'}</span>
          </div>
          <div className="flex justify-between">
            <span>账户余额</span>
            <span className="font-medium">
              {typeof balance === 'number' ? balance : '--'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>扣费项目</span>
            <span className="font-medium text-gray-900">
              {reason ?? 'PromptKeeper Premium'} · {cost} 积分
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {errorMessage}
          </div>
        )}

        <button
          onClick={() => onConfirm()}
          disabled={isLoading || isFetchingUser}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center disabled:opacity-60"
        >
          {isLoading ? '扣费中...' : `确认扣除 ${cost} 积分`}
        </button>
      </div>
    </div>
  );
};
