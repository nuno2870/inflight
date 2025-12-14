import Link from "next/link";

interface FlightCardProps {
  flightNumber: string;
  airline: string;
  date: string;
  origin?: string;
  destination?: string;
  depTime?: string; // OBRIGATÓRIO PARA AS HORAS
  arrTime?: string; // OBRIGATÓRIO PARA AS HORAS
}

export default function FlightCard({ flightNumber, airline, date, origin, destination, depTime, arrTime }: FlightCardProps) {
  
  const displayOrigin = origin || "---";
  const displayDest = destination || "---";
  const displayDep = depTime || "--:--";
  const displayArr = arrTime || "--:--";

  return (
    <Link 
      href={`/dashboard/flight/${flightNumber}`} 
      className="block w-full max-w-2xl transition hover:scale-[1.01]"
    >
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-8 shadow-2xl relative overflow-hidden animate-fade-in-up cursor-pointer hover:border-gray-600">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase">{flightNumber}</h2>
            <p className="text-gray-400 text-sm">{airline}</p>
          </div>
          <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
            A Horas
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 relative">
          <div className="text-left">
            <p className="text-4xl font-bold text-white">{displayOrigin}</p>
            <p className="text-gray-500 text-sm">Origem</p>
            <p className="text-white font-mono mt-2 text-xl">{displayDep}</p> {/* AQUI ESTÁ A HORA */}
          </div>

          <div className="flex-1 px-8 flex flex-col items-center relative">
              <div className="w-full h-[2px] bg-gray-700 absolute top-1/2 -translate-y-1/2"></div>
              <div className="bg-gray-900 p-2 z-10 rotate-90 text-2xl">✈️</div>
              <p className="text-xs text-gray-500 mt-4">Ver no Mapa</p>
          </div>

          <div className="text-right">
            <p className="text-4xl font-bold text-white">{displayDest}</p>
            <p className="text-gray-500 text-sm">Destino</p>
            <p className="text-white font-mono mt-2 text-xl">{displayArr}</p> {/* AQUI ESTÁ A HORA */}
          </div>
        </div>

        <div className="text-center mb-4">
           <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              Data do Voo: {date}
           </span>
        </div>

        <div className="bg-black/40 rounded-xl p-4 border border-gray-800 hover:bg-black/60 transition">
          <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-300 font-medium text-sm">🔮 Previsão InFlight</h3>
              <span className="text-xs text-blue-400">Ver detalhes completos →</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 mb-1">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
          </div>
          <p className="text-xs text-gray-500 text-right">Risco Baixo (15%)</p>
        </div>

      </div>
    </Link>
  );
}