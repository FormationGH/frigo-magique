export default function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#902124] rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500">Chargement... Merci de patienter </p>
    </div>
  );
}
