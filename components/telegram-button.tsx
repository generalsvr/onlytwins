export default function TelegramButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
         flex items-center justify-center gap-2
         bg-[#54a9eb] hover:bg-[#4a9de6] transition-all duration-200 hover:scale-[1.02]
         text-white font-medium text-base
         px-6 py-2 rounded-xl
         border-none outline-none
         cursor-pointer
         shadow-lg hover:shadow-xl shadow-[#54a9eb]/25
         min-w-[155px] w-full
       "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        fill="white"
      >
        <path d="M5.83,23.616c12.568-5.529,28.832-12.27,31.077-13.203c5.889-2.442,7.696-1.974,6.795,3.434 c-0.647,3.887-2.514,16.756-4.002,24.766c-0.883,4.75-2.864,5.313-5.979,3.258c-1.498-0.989-9.059-5.989-10.7-7.163 c-1.498-1.07-3.564-2.357-0.973-4.892c0.922-0.903,6.966-6.674,11.675-11.166c0.617-0.59-0.158-1.559-0.87-1.086 c-6.347,4.209-15.147,10.051-16.267,10.812c-1.692,1.149-3.317,1.676-6.234,0.838c-2.204-0.633-4.357-1.388-5.195-1.676 C1.93,26.43,2.696,24.995,5.83,23.616z" />
      </svg>
      {/* Telegram Icon */}
      Telegram
    </button>
  );
}
