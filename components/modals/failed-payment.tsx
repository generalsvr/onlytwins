export default function FailedPayment() {
    return (
        <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4 transform transition-all duration-300 scale-100 animate-in zoom-in-90">
                <div className="flex flex-col items-center text-center">
                    <svg
                        className="w-16 h-16 text-red-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Оплата была отменена</h1>
                    <p className="text-gray-600 mb-6">Попробуйте снова или свяжитесь с поддержкой.</p>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}