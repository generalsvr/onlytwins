import { useModalStore } from '@/lib/stores/modalStore';

export default function SuccessSubscription({ plan }) {
  const closeModal = useModalStore((state) => state.closeModal);

  // Function to get plan name
  const getPlanName = (plan) => {
    switch (plan) {
      case 'year':
        return 'Annual Subscription';
      case 'month':
        return 'Monthly Subscription';
      case 'quarter':
        return 'Quarterly Subscription';
      default:
        return 'Premium Subscription';
    }
  };

  // Function to calculate subscription expiration date
  const getExpirationDate = (plan) => {
    const now = new Date();
    let expirationDate = new Date(now);

    switch (plan) {
      case 'year':
        expirationDate.setFullYear(now.getFullYear() + 1);
        break;
      case 'month':
        expirationDate.setMonth(now.getMonth() + 1);
        break;
      case 'quarter':
        expirationDate.setMonth(now.getMonth() + 3);
        break;
      default:
        expirationDate.setMonth(now.getMonth() + 1);
    }

    return expirationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center text-center p-8 max-w-md mx-auto bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-3">Congratulations!</h2>

      {/* Subscription Plan */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 mb-4 w-full">
        <p className="text-purple-300 text-sm font-medium mb-1">
          Subscription Activated
        </p>
        <p className="text-white text-lg font-bold">{getPlanName(plan)}</p>
      </div>

      {/* Description */}
      <p className="text-zinc-300 mb-4 leading-relaxed">
        You now have full access to all premium features of the platform!
      </p>

      {/* Expiration Date */}
      <div className="bg-zinc-700/50 border border-zinc-600/30 rounded-lg p-3 mb-6 w-full">
        <p className="text-zinc-400 text-sm mb-1">Subscription valid until:</p>
        <p className="text-white font-semibold">{getExpirationDate(plan)}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <button
          onClick={() => closeModal()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
