import { useModalStore } from '@/lib/stores/modalStore';

export default function SuccessTokens({ amount }) {
  const closeModal = useModalStore(state => state.closeModal);

  // Function to format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="flex flex-col items-center text-center p-8 max-w-md  bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl">
      {/* Success Icon */}
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-3">
        Tokens Added!
      </h2>

      {/* Token Amount */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 mb-4 w-full">
        <p className="text-purple-300 text-sm font-medium mb-1">
          Tokens Purchased
        </p>
        <p className="text-white text-2xl font-bold">
          {formatNumber(amount)} Tokens
        </p>
      </div>

      {/* Description */}
      <p className="text-zinc-300 mb-6 leading-relaxed">
        Your tokens have been successfully added to your account. Start using them for premium features!
      </p>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <button
          onClick={() => closeModal()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Start Using Tokens
        </button>
      </div>
    </div>
  );
}