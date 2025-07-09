import { useModalStore } from '@/lib/stores/modalStore';

export default function FreeTrial() {
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <div className="flex flex-col items-center text-center p-8 max-w-md bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl">
      {/* Gift Icon */}
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-3">
        Free Trial Activated!
      </h2>

      {/* Trial Benefits */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 mb-4 w-full">
        <p className="text-purple-300 text-sm font-medium mb-3">
          Your One-Time Free Trial Includes:
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 text-sm">Messages</span>
            <span className="text-white text-lg font-bold">15 Free</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 text-sm">Pre-Generated Image</span>
            <span className="text-white text-lg font-bold">1 Free</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-300 mb-6 leading-relaxed">
        Welcome! Enjoy your <strong>one-time free trial</strong> to explore our premium features. Start chatting and creating!
      </p>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <button
          onClick={() => closeModal()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
}