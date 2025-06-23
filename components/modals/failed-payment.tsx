export default function FailedPayment() {
    return (
      <div className="flex flex-col items-center text-center p-8 max-w-md mx-auto">
        {/* Error Icon */}
        <div
          className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Payment Failed
        </h2>

        {/* Description */}
        <p className="text-zinc-300 mb-6 leading-relaxed">
          We couldn't process your payment. Please check your payment details and try again.
        </p>

        {/* Error Details */}
        <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-300 mb-1">
                Payment Error
              </p>
              <p className="text-sm text-red-400">
                Your card was declined. Please check your card details or try a different payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col w-full gap-3">
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all">
            Try Again
          </button>
          <button
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 px-6 rounded-xl border border-zinc-700 transition-colors">
            Change Payment Method
          </button>
          <button className="w-full text-zinc-400 hover:text-zinc-300 font-medium py-2 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    );
}