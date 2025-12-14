"use client";

import { useState } from "react";

// Definimos que este componente aceita uma função chamada 'onSearch'
interface SearchFormProps {
  onSearch: (data: { airline: string; date: string; flightNumber: string }) => void;
  isLoading: boolean; // Para saber se bloqueamos o botão
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [airline, setAirline] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Envia os dados para a página principal
    onSearch({ airline, date, flightNumber });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl mt-8"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Companhia Aérea
          </label>
          <input
            type="text"
            required
            placeholder="Ex: TAP, RyanAir..."
            className="w-full bg-black text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            disabled={isLoading} // Bloqueia enquanto carrega
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Data do Voo
          </label>
          <input
            type="date"
            required
            className="w-full bg-black text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition [color-scheme:dark]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Nº de Voo <span className="text-gray-600 text-xs">(Opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: TP123"
            className="w-full bg-black text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-3 px-4 rounded-lg mt-6 transition duration-200 ease-in-out flex justify-center items-center ${
            isLoading 
              ? "bg-blue-900 text-blue-300 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]"
          }`}
        >
          {isLoading ? (
            // Spinner simples de loading
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              A procurar...
            </>
          ) : (
            "Pesquisar Voos"
          )}
        </button>
      </div>
    </form>
  );
}