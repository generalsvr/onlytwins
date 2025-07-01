import { useState } from 'react';
import { useModalStore } from '@/lib/stores/modalStore';

export default function CancelSubscription({ onConfirm }) {
  const closeModal = useModalStore(state => state.closeModal);
  const [atPeriodEnd, setAtPeriodEnd] = useState(true);

  const handleConfirm = () => {
    onConfirm(atPeriodEnd);
    closeModal();
  };

  return (
    <div className="flex flex-col items-center text-center p-8 max-w-md mx-auto bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-3">
        Cancel Subscription
      </h2>

      {/* Description */}
      <p className="text-zinc-300 mb-6 leading-relaxed">
        Are you sure you want to cancel your subscription? You can choose when the cancellation should take effect.
      </p>

      {/* Checkbox Option */}
      <div className="bg-zinc-700/50 border border-zinc-600/30 rounded-lg p-4 mb-6 w-full">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={atPeriodEnd}
              onChange={(e) => setAtPeriodEnd(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-zinc-700 border-zinc-600 rounded focus:ring-purple-500 focus:ring-2"
            />
          </div>
          <div className="text-left">
            <p className="text-white font-medium mb-1">
              Cancel at period end
            </p>
            <p className="text-zinc-400 text-sm">
              {atPeriodEnd
                ? "Your subscription will remain active until the end of your current billing period. No refund will be issued."
                : "Your subscription will be canceled immediately and you will lose access to premium features right away."
              }
            </p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <button
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Confirm Cancellation
        </button>
        <button
          onClick={() => closeModal()}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Keep Subscription
        </button>
      </div>
    </div>
  );
}