import { useModalStore } from '@/lib/stores/modalStore';

export default function InsufficientTokens({ currentBalance, requiredTokens, buyToken }) {
  const closeModal = useModalStore(state => state.closeModal);

  // Function to format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  // Calculate needed tokens
  const neededTokens = requiredTokens - currentBalance;

  return (
    <div className="flex flex-col items-center text-center p-8 max-w-md bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl">
      {/* Warning Icon */}
      <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-3">
        Insufficient Tokens
      </h2>

      {/* Token Balance Info */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-4 mb-4 w-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-red-300 text-sm font-medium">
            Current Balance
          </p>
          <p className="text-white text-lg font-bold">
            {formatNumber(currentBalance)} Tokens
          </p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-red-300 text-sm font-medium">
            Required
          </p>
          <p className="text-white text-lg font-bold">
            {formatNumber(requiredTokens)} Tokens
          </p>
        </div>
        <div className="border-t border-red-500/30 mt-2 pt-2">
          <div className="flex justify-between items-center">
            <p className="text-red-300 text-sm font-medium">
              Need to Purchase
            </p>
            <p className="text-red-400 text-xl font-bold">
              {formatNumber(neededTokens)} Tokens
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-300 mb-6 leading-relaxed">
        You don't have enough tokens to continue. Purchase more tokens to access premium features.
      </p>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <button
          onClick={() => {
            buyToken()
          }}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Buy Tokens
        </button>
        <button
          onClick={() => closeModal()}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-medium py-3 px-6 rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}