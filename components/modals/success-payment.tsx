import { useModalStore } from '@/lib/stores/modalStore';

export default function SuccessPayment() {
  const closeModal = useModalStore(state => state.closeModal)
    return (
      <div className="flex flex-col items-center text-center p-8 max-w-md mx-auto bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl">
        {/* Success Icon */}
        <div
          className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Payment Successful!
        </h2>

        {/* Description */}
        <p className="text-zinc-300 mb-6 leading-relaxed">
          Your payment has been processed successfully. You now have access to premium features.
        </p>


        {/* Actions */}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => closeModal()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all">
            Continue
          </button>
          {/*<button*/}
          {/*  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 px-6 rounded-xl border border-zinc-700 transition-colors">*/}
          {/*  Download Receipt*/}
          {/*</button>*/}
        </div>
      </div>
    );
}