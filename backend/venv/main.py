from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import asyncio
import json
import random

# --- CONFIGURAÇÃO ---
API_KEY = "14e9ebea-ae3f-4098-ab77-3809241bcb2e" 
BASE_URL = "https://airlabs.co/api/v9/flights"

app = FastAPI()

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "InFlight Backend v3.0 (Card API + Photos) Online 🟢"}

# --- HELPER: BUSCAR DADOS (USADO PELO API E PELO WEBSOCKET) ---
def fetch_flight_data(flight_input):
    clean_input = flight_input.upper()
    
    # 1. Tentar AirLabs
    if clean_input[:3].isalpha(): code_type = "flight_icao"
    else: code_type = "flight_iata"

    url = f"{BASE_URL}?{code_type}={clean_input}&api_key={API_KEY}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if "response" in data and len(data["response"]) > 0:
            f = data["response"][0]
            return {
                "found": True,
                "lat": f.get("lat"), "lon": f.get("lng"), "alt": f.get("alt"),
                "speed": f.get("speed"), "status": f.get("status"),
                "dep_iata": f.get("dep_iata"), "arr_iata": f.get("arr_iata"),
                "airline_iata": f.get("airline_iata"), # IMPORTANTE PARA A FOTO!
                "flight_number": f.get("flight_number"),
                # Horas (formato HH:MM)
                "dep_time": str(f.get("dep_time", "---"))[-5:], 
                "arr_time": str(f.get("arr_time", "---"))[-5:],
                "source": "REAL"
            }
    except:
        pass

    # 2. Simulação (Se não encontrar)
    return {
        "found": False,
        "lat": 38.7223, "lon": -9.1393, "alt": 30000, "speed": 850,
        "status": "en-route", "dep_iata": "LIS", "arr_iata": "JFK",
        "airline_iata": "TP", "flight_number": clean_input,
        "dep_time": "14:30", "arr_time": "18:45",
        "source": "SIMULADO"
    }

# --- NOVA ROTA PARA O CARTÃO DO DASHBOARD ---
@app.get("/api/flight/{flight_input}")
def get_flight_info(flight_input: str):
    data = fetch_flight_data(flight_input)
    return data

# --- FUNÇÃO DE METEOROLOGIA ---
def get_real_weather(lat, lon):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        res = requests.get(url, timeout=2).json()
        wcode = res.get("current_weather", {}).get("weathercode", 0)
        cond = "Limpo"
        if wcode > 3: cond = "Nublado"
        if wcode > 50: cond = "Chuva"
        return {
            "temp": res.get("current_weather", {}).get("temperature"),
            "wind": res.get("current_weather", {}).get("windspeed"),
            "condition": cond
        }
    except:
        return {"temp": "--", "wind": "--", "condition": "Sem dados"}

@app.websocket("/ws/flight/{flight_input}")
async def flight_radar(websocket: WebSocket, flight_input: str):
    await websocket.accept()
    
    # Estado inicial
    flight_state = fetch_flight_data(flight_input)
    print(f"📡 Radar: {flight_input} ({flight_state['source']})")

    try:
        while True:
            # Atualizar dados (a cada loop tenta dados reais, senão simula)
            new_data = fetch_flight_data(flight_input)
            
            if new_data["source"] == "REAL":
                flight_state = new_data
            else:
                # Movimento simulado suave
                flight_state["lat"] += 0.05
                flight_state["lon"] -= 0.05
            
            # Buscar tempo real para onde o avião está
            weather = get_real_weather(flight_state["lat"], flight_state["lon"])
            
            packet = {
                "lat": flight_state["lat"], "lon": flight_state["lon"],
                "altitude": flight_state["alt"], "speed": flight_state["speed"],
                "status": flight_state["status"], "dep_iata": flight_state["dep_iata"],
                "arr_iata": flight_state["arr_iata"], "airline_iata": flight_state["airline_iata"],
                "weather": weather
            }
            
            await websocket.send_json(packet)
            await asyncio.sleep(5) 
            
    except Exception as e:
        print(f"❌ Off: {e}")