"use client";

export default function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border bg-[#7EAF50] text-white rounded-xl hover:bg-[#89AF66]"
    >
      {children}
    </button>
  );
}
