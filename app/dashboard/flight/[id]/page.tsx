"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import NewsFeed from "@/components/NewsFeed";
import FlightCard from "@/components/FlightCard";
import SearchForm from "@/components/SearchForm";
import { Menu, X, Plane, Map as MapIcon, Coffee, Languages, LogOut, Newspaper, ShoppingBag, Utensils, Navigation, Footprints, Bus, Clock, Target, ArrowRight, ChevronDown, Check, Volume2, VolumeX, User, Globe, Thermometer, Sun, CloudRain } from "lucide-react"; 

// --- 1. DEFINIÇÃO DO TIPO ---
type Translation = {
  greeting: string; subtitle: string; menuTitle: string; menuNews: string; menuRadar: string; menuAirport: string; menuMaps: string; menuPrefs: string; menuLogout: string; quickAccess: string; searchFlight: string; systemStatus: string; online: string; newsTitle: string; newsSubtitle: string; mapsTitle: string; mapsDesc: string; whereAreYou: string; whereToGo: string; calculateRoute: string; steps: string; shuttle: string; gates: string; services: string; walkTime: string; distance: string; nextBus: string; busStop: string; select: string; soundOn: string; soundOff: string;
  instr_start: string; instr_line: string; instr_arrive: string; instr_shuttle_1: string; instr_shuttle_2: string; instr_shuttle_stop: string; instr_shuttle_catch: string; instr_central: string;
  loc_entrance: string; loc_exit: string; loc_shuttle: string; loc_checkin: string; loc_security: string; loc_dutyfree: string; loc_lounge: string; loc_mcdonalds: string; loc_starbucks: string; loc_terminal1: string; loc_terminal2: string; loc_gate: string;
  inspireMe: string; spinGlobe: string; destSuggested: string;
  open: string; closed: string;
};

// --- 2. DICIONÁRIOS ---
const translations: Record<"PT" | "EN", Translation> = {
  PT: {
    greeting: "Olá", subtitle: "A tua torre de controlo pessoal.", menuTitle: "Menu", menuNews: "Feed & Notícias", menuRadar: "Radar de Voos", menuAirport: "Guia Aeroporto", menuMaps: "Navegação GPS", menuPrefs: "Preferências", menuLogout: "Terminar Sessão", quickAccess: "Acesso Rápido", searchFlight: "Pesquisar Voo", systemStatus: "Estado do Sistema", online: "Online", newsTitle: "Últimas da Aviação", newsSubtitle: "Mundo Inteiro", mapsTitle: "GPS do Terminal", mapsDesc: "Cálculo de rota real passo-a-passo.", whereAreYou: "Ponto de Partida", whereToGo: "Destino Final", calculateRoute: "Navegar", steps: "Instruções Reais:", shuttle: "Transfer Autocarro", gates: "Portas de Embarque", services: "Terminais e Serviços", walkTime: "Tempo estimado", distance: "Distância real", nextBus: "Próximo Bus:", busStop: "Paragem Shuttle", select: "Selecione...", soundOn: "Voz Ativada", soundOff: "Voz Desativada",
    instr_start: "Começa em:", instr_line: "Segue a linha azul.", instr_arrive: "Chegas ao destino:", instr_shuttle_1: "Sai do Terminal 2.", instr_shuttle_2: "Apanha o autocarro para T1.", instr_shuttle_stop: "Vai à paragem shuttle.", instr_shuttle_catch: "Apanha o autocarro para T2.", instr_central: "Vai até à praça central.",
    loc_entrance: "Entrada / Partidas", loc_exit: "Saída / Chegadas", loc_shuttle: "Paragem Shuttle", loc_checkin: "Balcões Check-in", loc_security: "Segurança", loc_dutyfree: "Duty Free", loc_lounge: "TAP Lounge", loc_mcdonalds: "McDonald's", loc_starbucks: "Starbucks", loc_terminal1: "Terminal 1", loc_terminal2: "Terminal 2", loc_gate: "Porta",
    inspireMe: "Próxima Aventura?", spinGlobe: "Girar o Globo 🌍", destSuggested: "Destino Sugerido",
    open: "Aberto", closed: "Fechado"
  },
  EN: {
    greeting: "Hello", subtitle: "Your personal control tower.", menuTitle: "Menu", menuNews: "Feed & News", menuRadar: "Flight Radar", menuAirport: "Airport Guide", menuMaps: "GPS Navigation", menuPrefs: "Preferences", menuLogout: "Log Out", quickAccess: "Quick Access", searchFlight: "Search Flight", systemStatus: "System Status", online: "Online", newsTitle: "Global Aviation News", newsSubtitle: "International", mapsTitle: "Terminal GPS", mapsDesc: "Real-time step-by-step routing.", whereAreYou: "Start Point", whereToGo: "Destination", calculateRoute: "Navigate", steps: "Real Instructions:", shuttle: "Bus Transfer", gates: "Boarding Gates", services: "Terminals & Services", walkTime: "Est. Time", distance: "Real Distance", nextBus: "Next Bus:", busStop: "Shuttle Stop", select: "Select...", soundOn: "Voice On", soundOff: "Voice Off",
    instr_start: "Start at:", instr_line: "Follow the blue line.", instr_arrive: "Arrive at destination:", instr_shuttle_1: "Exit Terminal 2.", instr_shuttle_2: "Take the bus to T1.", instr_shuttle_stop: "Go to the shuttle stop.", instr_shuttle_catch: "Take the bus to T2.", instr_central: "Go to central plaza.",
    loc_entrance: "Entrance / Departures", loc_exit: "Exit / Arrivals", loc_shuttle: "Shuttle Stop", loc_checkin: "Check-in Counters", loc_security: "Security Check", loc_dutyfree: "Duty Free", loc_lounge: "TAP Lounge", loc_mcdonalds: "McDonald's", loc_starbucks: "Starbucks", loc_terminal1: "Terminal 1", loc_terminal2: "Terminal 2", loc_gate: "Gate",
    inspireMe: "Next Adventure?", spinGlobe: "Spin the Globe 🌍", destSuggested: "Suggested Destination",
    open: "Open", closed: "Closed"
  }
};

// --- DADOS DOS LOCAIS ---
const locationsData: any = {
    "Hall_Entry": { x: 5, y: 50 }, "Hall_Checkin": { x: 15, y: 50 }, "Hall_Security": { x: 25, y: 50 }, "Hall_Central": { x: 38, y: 50 }, "Hall_North_Start": { x: 45, y: 30 }, "Hall_North_End": { x: 95, y: 30 }, "Hall_South_Start": { x: 45, y: 70 }, "Hall_South_End": { x: 95, y: 70 }, "Outside_Curbside": { x: 2, y: 65 },

    "Entrance": { x: 2, y: 50, translationKey: "loc_entrance", term: 1, type: "service", link: "Hall_Entry" },
    "Exit": { x: 2, y: 80, translationKey: "loc_exit", term: 1, type: "service", link: "Outside_Curbside" },
    "ShuttleStop": { x: 5, y: 70, translationKey: "loc_shuttle", term: 1, type: "transport", link: "Outside_Curbside" },
    "Checkin": { x: 15, y: 40, translationKey: "loc_checkin", term: 1, type: "service", link: "Hall_Checkin" },
    "Security": { x: 25, y: 40, translationKey: "loc_security", term: 1, type: "service", link: "Hall_Security" },
    "DutyFree": { x: 38, y: 40, translationKey: "loc_dutyfree", term: 1, type: "shop", link: "Hall_Central" },
    "McDonalds": { x: 45, y: 25, translationKey: "loc_mcdonalds", term: 1, type: "food", link: "Hall_North_Start" },
    "Starbucks": { x: 45, y: 75, translationKey: "loc_starbucks", term: 1, type: "food", link: "Hall_South_Start" },
    "Lounge": { x: 45, y: 15, translationKey: "loc_lounge", term: 1, type: "lounge", link: "Hall_North_Start" },
    "Terminal2": { x: 50, y: 90, translationKey: "loc_terminal2", term: 2, type: "terminal", link: "ShuttleStop" }
};

const connections: any = {
    "Entrance": ["Hall_Entry", "Outside_Curbside"], "Outside_Curbside": ["Entrance", "ShuttleStop", "Exit"], "Exit": ["Outside_Curbside"], "ShuttleStop": ["Outside_Curbside"], "Hall_Entry": ["Entrance", "Hall_Checkin"], "Hall_Checkin": ["Hall_Entry", "Checkin", "Hall_Security"], "Checkin": ["Hall_Checkin"], "Hall_Security": ["Hall_Checkin", "Security", "Hall_Central"], "Security": ["Hall_Security"], "Hall_Central": ["Hall_Security", "DutyFree", "Hall_North_Start", "Hall_South_Start"], "DutyFree": ["Hall_Central"], "Hall_North_Start": ["Hall_Central", "McDonalds", "Lounge", "Hall_North_End"], "McDonalds": ["Hall_North_Start"], "Lounge": ["Hall_North_Start"], "Hall_North_End": ["Hall_North_Start"], "Hall_South_Start": ["Hall_Central", "Starbucks", "Hall_South_End"], "Starbucks": ["Hall_South_Start"], "Hall_South_End": ["Hall_South_Start"]
};

// --- DESTINOS DIVERTIDOS (A TUA ROLETA) ---
const funDestinations = [
    { name: "Bora Bora", lat: -16.5004, lon: -151.7415 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Reykjavik", lat: 64.1466, lon: -21.9426 },
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
    { name: "Dubai", lat: 25.2048, lon: 55.2708 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Cape Town", lat: -33.9249, lon: 18.4241 },
    { name: "Madeira", lat: 32.7607, lon: -16.9595 },
    { name: "Bali", lat: -8.4095, lon: 115.1889 }
];

// --- COMPONENTE SELECT ---
const CustomSelect = ({ label, value, onChange, groups }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const selectedLabel = useMemo(() => {
        if (!value) return label;
        for (const group of groups) { const found = group.items.find((item: any) => item.id === value); if (found) return found.label; }
        return value;
    }, [value, groups, label]);
    return (
        <div className="relative mb-4" ref={containerRef}>
            <label className="text-xs text-gray-500 mb-1 block uppercase font-bold tracking-wider">{label}</label>
            <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between bg-black border ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-700'} rounded-xl p-3 text-white text-sm transition hover:border-gray-500`}>
                <span className={value ? "text-white" : "text-gray-500"}>{selectedLabel}</span><ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (<div className="absolute top-full left-0 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">{groups.map((group: any, idx: number) => (<div key={idx}><div className="px-3 py-2 text-[10px] uppercase font-bold text-gray-500 bg-black/30 sticky top-0 backdrop-blur-sm">{group.label}</div>{group.items.map((item: any) => (<button key={item.id} onClick={() => { onChange(item.id); setIsOpen(false); }} className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition ${value === item.id ? "bg-blue-600/20 text-blue-400" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}>{item.label}{value === item.id && <Check size={14} />}</button>))}</div>))}</div>)}
        </div>
    );
};
export default function Dashboard() {
  const router = useRouter(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState("home"); 
  
  // AUTH
  const [user, setUser] = useState<any>(null); 
  const [loadingAuth, setLoadingAuth] = useState(true); 
  const [showNameModal, setShowNameModal] = useState(false);
  const [newName, setNewName] = useState("");

  // SEARCH
  const [flightData, setFlightData] = useState<any>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  // MAPA & VOZ
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [routePath, setRoutePath] = useState<any>(null);
  const [busTimer, setBusTimer] = useState(120); 
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // CONFIGS
  const [language, setLanguage] = useState<"PT" | "EN">("PT");
  const t = translations[language]; 

  // ROLETA
  const [randomDest, setRandomDest] = useState<any>(null);

  // --- AUTH CHECK ---
  useEffect(() => {
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/"); } else { setUser(user); setLoadingAuth(false); if (!user.user_metadata?.display_name) { setShowNameModal(true); } }
    };
    checkUser();
  }, []);

  const handleSaveName = async (e: React.FormEvent) => { e.preventDefault(); if (!newName.trim()) return; const { data, error } = await supabase.auth.updateUser({ data: { display_name: newName } }); if (!error && data.user) { setUser(data.user); setShowNameModal(false); } };
  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Viajante";

  // --- TIMERS & API ---
  useEffect(() => { const timer = setInterval(() => setBusTimer((prev) => (prev > 0 ? prev - 1 : 600)), 1000); return () => clearInterval(timer); }, []);
  const formatTime = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  
  const handleSearch = async (data: any) => {
    setIsLoadingSearch(true);
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/flight/${data.flightNumber}`);
        const info = await res.json();
        setFlightData({ 
            ...data, 
            origin: info.dep_iata || "---", 
            destination: info.arr_iata || "---", 
            airline: info.airline_iata || "---",
            depTime: info.dep_time, 
            arrTime: info.arr_time 
        }); 
    } catch (error) { 
        console.error("Erro:", error); 
        setFlightData({ ...data, origin: "ERR", destination: "ERR" }); 
    } finally { 
        setIsLoadingSearch(false); 
    }
  };

  // --- VOZ ---
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = (text: string) => {
      if (isMuted || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === "EN") {
          const enVoice = voices.find(v => v.lang.startsWith("en-") && (v.name.includes("Google") || v.name.includes("Microsoft")));
          if (enVoice) utterance.voice = enVoice;
          utterance.lang = "en-US";
      } else {
          const ptVoice = voices.find(v => v.lang === "pt-PT");
          if (ptVoice) utterance.voice = ptVoice;
          utterance.lang = "pt-PT";
      }
      window.speechSynthesis.speak(utterance);
  };

  // --- ROLETA ---
  const spinGlobe = async () => {
      const dest = funDestinations[Math.floor(Math.random() * funDestinations.length)];
      try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lon}&current_weather=true`);
          const data = await res.json();
          setRandomDest({ 
              ...dest, 
              temp: data.current_weather?.temperature || "--",
              photo: `https://image.pollinations.ai/prompt/${encodeURIComponent(dest.name + " city landmark beautiful travel photography")}?width=800&height=400&nologo=true&seed=${Math.random()}`
          });
      } catch (e) { console.error(e); }
  };

  // --- MAPA LOGIC ---
  const { allLocations, selectGroups } = useMemo(() => {
      const fullGraph = { ...locationsData };
      for (let i = 1; i <= 13; i++) { const id = `Gate${i}`; fullGraph[id] = { x: 55 + (i * 3.0), y: 25, label: `${t.loc_gate} ${i}`, term: 1, type: "gate", link: `Hall_N_${i}` }; }
      for (let i = 14; i <= 26; i++) { const id = `Gate${i}`; const idx = i - 13; fullGraph[id] = { x: 55 + (idx * 3.0), y: 75, label: `${t.loc_gate} ${i}`, term: 1, type: "gate", link: `Hall_S_${idx}` }; }
      Object.keys(fullGraph).forEach(key => { if (fullGraph[key].translationKey) { fullGraph[key].label = t[fullGraph[key].translationKey as keyof Translation]; } });
      const services = Object.keys(fullGraph).filter(k => fullGraph[k].type && fullGraph[k].type !== "gate" && fullGraph[k].label).map(k => ({ id: k, label: fullGraph[k].label }));
      const gates = Object.keys(fullGraph).filter(k => fullGraph[k].type === "gate").map(k => ({ id: k, label: fullGraph[k].label }));
      const groups = [{ label: t.services, items: services }, { label: t.gates, items: gates }];
      return { allLocations: { graph: fullGraph, conns: connections }, selectGroups: groups };
  }, [language, t]);

  useEffect(() => { if(startPoint && endPoint) calculateRoute(); }, [language]); 

  const calculateRoute = () => {
    if (!endPoint || !startPoint) return;
    const { graph } = allLocations;
    let startNode = graph[startPoint];
    let endNode = graph[endPoint];
    if (!startNode || !endNode) return;

    let steps = []; let type = "walking"; let pathString = ""; let time = ""; let dist = ""; let voiceMsg = "";

    if (startNode.term !== endNode.term) {
        type = "transfer"; const shuttleStop = graph["ShuttleStop"];
        if (startNode.term === 2) { 
            pathString = `M ${startNode.x},${startNode.y} Q 30,90 ${shuttleStop.x},${shuttleStop.y}`;
            steps = [`1. ${t.instr_shuttle_1}`, `2. ${t.instr_shuttle_2}`, `3. ${t.instr_arrive} ${endNode.label}.`];
            voiceMsg = language === "PT" ? "Atenção. Mudar de terminal." : "Attention. Change terminal.";
        } else { 
            pathString = `M ${startNode.x},${startNode.y} L ${shuttleStop.x},${shuttleStop.y} Q 30,90 ${endNode.x},${endNode.y}`;
            steps = [`1. ${t.instr_shuttle_stop}`, `2. ${t.instr_shuttle_catch}`];
            voiceMsg = language === "PT" ? "Vai para a paragem do shuttle." : "Go to the shuttle stop.";
        }
        time = "15 min"; dist = "BUS";
    } else {
        type = "walking"; let pathD = `M ${startNode.x},${startNode.y}`;
        if (startNode.x > 38) { const cy = startNode.y < 50 ? 30 : 70; pathD += ` L ${startNode.x},${cy} L 38,${cy}`; } else { pathD += ` L 38,${startNode.y}`; }
        const ty = endNode.y < 50 ? 30 : 70; pathD += ` L 38,${ty} L ${endNode.x},${ty} L ${endNode.x},${endNode.y}`;
        pathString = pathD;
        const distUnits = Math.abs(endNode.x - startNode.x) + Math.abs(endNode.y - startNode.y);
        const realMeters = Math.round(distUnits * 5); 
        const realMinutes = Math.ceil(realMeters / 80) + 1;
        time = `${realMinutes} min`; dist = `${realMeters}m`;
        steps = [`1. ${t.instr_start} ${startNode.label}.`, `2. ${t.instr_line}`, `3. ${t.instr_arrive} ${endNode.label}.`];
        voiceMsg = language === "PT" ? `Rota calculada. ${realMinutes} minutos.` : `Route calculated. ${realMinutes} minutes.`;
    }
    setRoutePath({ type, pathString, dist, time, instructions: steps });
    speak(voiceMsg);
  };

  const airportShops = [ { name: "McDonald's", type: "Food", loc: "T1, Piso 2", status: t.open, color: "text-yellow-400" }, { name: "Starbucks", type: "Coffee", loc: "T1, Portão 14", status: t.open, color: "text-green-400" }, { name: "Duty Free", type: "Shop", loc: "T1, Central", status: t.open, color: "text-blue-400" }, { name: "TAP Lounge", type: "Lounge", loc: "T1, Piso 3", status: t.open, color: "text-green-600" }, { name: "Pizza Hut", type: "Food", loc: "T1, Piso 2", status: t.closed, color: "text-red-500" } ];

  if (loadingAuth) return <div className="min-h-screen bg-black flex items-center justify-center text-white animate-pulse">A carregar...</div>;

  return (
    <main className="min-h-screen bg-black text-white relative flex overflow-x-hidden">
      {showNameModal && (<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in-up text-center"><div className="flex justify-center mb-4 text-blue-500"><User size={48} /></div><h2 className="text-2xl font-bold text-white mb-2">Bem-vindo a bordo! ✈️</h2><p className="text-gray-400 mb-6">Como preferes que te chamemos?</p><form onSubmit={handleSaveName}><input type="text" required placeholder="Ex: Comandante Silva, Nuno..." className="w-full bg-black border border-gray-600 rounded-xl p-4 text-white text-lg focus:border-blue-500 outline-none text-center mb-6" value={newName} onChange={(e) => setNewName(e.target.value)} /><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">Confirmar e Descolar 🚀</button></form></div></div>)}
      
      {isMenuOpen && ( <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)}></div> )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-800"><h2 className="text-xl font-bold tracking-tight">InFlight <span className="text-blue-500">{t.menuTitle}</span></h2><button onClick={() => setIsMenuOpen(false)}><X className="text-gray-400 hover:text-white" /></button></div>
        <nav className="p-4 space-y-2">
            <button onClick={() => { setView("home"); setIsMenuOpen(false)}} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${view === 'home' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}><Newspaper size={20} /> {t.menuNews}</button>
            <button onClick={() => { setView("search"); setIsMenuOpen(false)}} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${view === 'search' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}><Plane size={20} /> {t.menuRadar}</button>
            <button onClick={() => { setView("airport"); setIsMenuOpen(false)}} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${view === 'airport' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}><Coffee size={20} /> {t.menuAirport}</button>
            <button onClick={() => { setView("maps"); setIsMenuOpen(false)}} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${view === 'maps' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}><Navigation size={20} /> {t.menuMaps}</button>
            <div className="border-t border-gray-800 my-4 pt-4">
                <button onClick={() => setLanguage(language === "EN" ? "PT" : "EN")} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"><Languages size={20} /> <span>Idioma: <span className="font-bold text-blue-400">{language}</span></span></button>
                <button onClick={() => setIsMuted(!isMuted)} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${isMuted ? 'text-gray-500 hover:bg-gray-800' : 'text-green-400 hover:bg-green-900/20'}`}>{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />} <span>{isMuted ? t.soundOff : t.soundOn}</span></button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition"><LogOut size={20} /> {t.menuLogout}</button>
            </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="p-6 lg:p-10 pb-0 flex items-center gap-4 z-10 bg-black/90 backdrop-blur-sm"><button onClick={() => setIsMenuOpen(true)} className="p-2 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition hover:scale-105 active:scale-95"><Menu /></button><div><h1 className="text-3xl font-bold">{view === "home" && `${t.greeting}, ${displayName} 👋`}{view === "search" && `${t.menuRadar} 📡`}{view === "airport" && `${t.menuAirport} 🏢`}{view === "maps" && `${t.mapsTitle} 🧭`}</h1><p className="text-gray-500 text-sm">{t.subtitle}</p></div></div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            
            {/* HOME COM ROLETA */}
            {view === "home" && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/10 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={spinGlobe}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><Globe size={80} /></div>
                            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">{t.inspireMe}</h3>
                            <p className="text-2xl font-bold mt-1 text-white">{t.spinGlobe}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/10 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={() => setView("search")}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><Plane size={80} /></div>
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider">{t.quickAccess}</h3>
                            <p className="text-2xl font-bold mt-1 text-white">{t.searchFlight}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl"><h3 className="text-green-400 text-xs font-bold uppercase tracking-wider">{t.systemStatus}</h3><div className="flex items-center gap-2 mt-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div><p className="text-xl font-bold text-white">{t.online}</p></div></div>
                    </div>

                    {randomDest && (
                        <div className="animate-fade-in bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden relative group h-64 shadow-2xl border-purple-500/50">
                            <img src={randomDest.photo} alt={randomDest.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-700" />
                            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/70 to-transparent">
                                <h3 className="text-3xl font-bold text-white mb-1">{randomDest.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1"><Thermometer size={16} className="text-yellow-400"/> {randomDest.temp}ºC</span>
                                    <span className="bg-purple-600 px-2 py-0.5 rounded text-xs font-bold text-white">{t.destSuggested}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold flex items-center gap-2">📰 {t.newsTitle}</h2><span className="text-xs font-medium text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">{t.newsSubtitle}</span></div><NewsFeed /></div>
                </div>
            )}

            {view === "search" && <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] w-full animate-fade-in"><div className="w-full max-w-md"><SearchForm onSearch={handleSearch} isLoading={isLoadingSearch} />{flightData && <div className="flex justify-center mt-8"><FlightCard flightNumber={flightData.flightNumber} airline={flightData.airline} date={flightData.date} origin={flightData.origin} destination={flightData.destination} depTime={flightData.depTime} arrTime={flightData.arrTime} /></div>}</div></div>}
            {view === "airport" && <div className="animate-fade-in pb-20"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{airportShops.map((shop, idx) => (<div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between hover:border-gray-600 transition group cursor-pointer"><div className="flex items-center gap-4"><div className="p-3 bg-black rounded-lg">{shop.type === "Food" && <Utensils size={20} className="text-orange-400" />}{shop.type === "Coffee" && <Coffee size={20} className="text-yellow-700" />}{shop.type === "Shop" && <ShoppingBag size={20} className="text-purple-400" />}{shop.type === "Tech" && <Plane size={20} className="text-blue-400" />}{shop.type === "Lounge" && <Coffee size={20} className="text-green-400" />}</div><div><h3 className="font-bold text-white">{shop.name}</h3><p className="text-xs text-gray-500">{shop.loc}</p></div></div><span className={`text-xs px-2 py-1 rounded bg-gray-800 ${shop.name === "Pizza Hut" ? "text-red-400" : "text-green-400"}`}>{shop.status}</span></div>))}</div></div>}

            {view === "maps" && (
                <div className="animate-fade-in flex flex-col items-center w-full">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col h-fit">
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-6 tracking-wider flex items-center gap-2"><Navigation size={18} className="text-blue-500" /> GPS Indoor</h3>
                            <div className="space-y-4 mb-6">
                                <CustomSelect label={t.whereAreYou} value={startPoint} onChange={setStartPoint} groups={selectGroups} />
                                <div className="flex justify-center"><div className="h-8 w-[2px] bg-gray-700"></div></div>
                                <CustomSelect label={t.whereToGo} value={endPoint} onChange={setEndPoint} groups={selectGroups} />
                                <button onClick={calculateRoute} disabled={!endPoint || !startPoint} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-900/20">{t.calculateRoute}</button>
                            </div>
                            {routePath && (
                                <div className="bg-black/50 rounded-xl p-4 border border-gray-800 animate-fade-in space-y-4">
                                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${routePath.type === "transfer" ? "bg-yellow-900/20 border-yellow-800" : "bg-blue-900/20 border-blue-800"}`}>
                                        <div className={`${routePath.type === "transfer" ? "bg-yellow-500 text-black" : "bg-blue-500 text-white"} p-2 rounded-full`}>{routePath.type === "transfer" ? <Bus size={16} /> : <Footprints size={16} />}</div>
                                        <div><p className={`text-xs uppercase font-bold ${routePath.type === "transfer" ? "text-yellow-400" : "text-blue-300"}`}>{routePath.type === "transfer" ? t.shuttle : t.walkTime}</p><p className="text-white font-mono">{routePath.time} <span className="text-gray-500">({routePath.dist})</span></p></div>
                                    </div>
                                    {routePath.type === "transfer" && (<div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg animate-pulse"><Clock size={16} className="text-green-400"/><span className="text-gray-400 text-xs uppercase font-bold">{t.nextBus}</span><span className="text-white font-mono text-lg ml-auto">{formatTime(busTimer)}</span></div>)}
                                    <div><h4 className="text-gray-400 font-bold mb-2 text-xs uppercase">{t.steps}</h4><ul className="space-y-2">{routePath.instructions?.map((step:string, i:number) => (<li key={i} className="text-sm text-gray-300 flex gap-2 leading-relaxed"><ArrowRight size={14} className="mt-1 text-blue-500 shrink-0"/>{step}</li>))}</ul></div>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-2 bg-black border border-gray-800 rounded-2xl p-4 relative overflow-hidden flex items-center justify-center group min-h-[500px]"><div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div><div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-gray-700 z-10 text-green-400 flex gap-2 items-center"><Target size={12}/> Live Blueprint</div><div className="relative w-full max-w-lg aspect-[4/3]"><svg className="w-full h-full" viewBox="0 0 100 100"><path d="M0,40 L40,40 L40,20 L100,20 L100,40 L40,40 L40,60 L100,60 L100,80 L40,80 L40,60 L0,60 Z" fill="none" stroke="#334155" strokeWidth="2" /><rect x="2" y="42" width="22" height="16" fill="#1e293b" opacity="0.5" rx="2" /><rect x="25" y="42" width="8" height="16" fill="#334155" opacity="0.8" rx="1" /><rect x="42" y="25" width="56" height="10" fill="#1e293b" opacity="0.5" rx="2" /><rect x="42" y="65" width="56" height="10" fill="#1e293b" opacity="0.5" rx="2" /><circle cx="38" cy="50" r="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.5" /><text x="38" y="51" fontSize="2" fill="white" textAnchor="middle" fontWeight="bold">Duty Free</text><rect x="45" y="88" width="10" height="10" fill="#4c1d95" opacity="0.8" rx="2" /><text x="50" y="94" fontSize="2" fill="white" textAnchor="middle">T2</text>{Object.keys(allLocations.graph).map((key) => {const node = allLocations.graph[key];const isRelevant = key === startPoint || key === endPoint || (routePath?.type === "transfer" && key === "ShuttleStop");if (!isRelevant) return null;return (<g key={key} className="animate-fade-in"><circle cx={node.x} cy={node.y} r="2" fill={key === "ShuttleStop" ? "#eab308" : (startPoint === key ? "#22c55e" : "#ef4444")} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" /><text x={node.x} y={node.y - 5} fontSize="3" fill="white" textAnchor="middle" className="font-bold drop-shadow-md bg-black/70 px-2 py-1 rounded">{node.label}</text></g>)})}{routePath && (<><path d={routePath.pathString} fill="none" stroke={routePath.type === "transfer" ? "#eab308" : "#3b82f6"} strokeWidth="1" strokeDasharray="2,1" className="animate-pulse" />{routePath.type === "transfer" ? (<circle r="1.5" fill="#fbbf24"><animateMotion dur="4s" repeatCount="indefinite" path={routePath.pathString} rotate="auto" /></circle>) : (<g><polygon points="-1.5,-1.5 2,0 -1.5,1.5" fill="#00ffff" /><animateMotion dur="4s" repeatCount="indefinite" path={routePath.pathString} rotate="auto" /></g>)}</>)}</svg></div></div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}