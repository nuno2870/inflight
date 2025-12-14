"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: { name: string };
  publishedAt: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // --- CHAVE DA API ---
        const apiKey = "17ed4220594442cda2b582574327909a"; // <--- GARANTE QUE A TUA CHAVE ESTÁ AQUI
        
        // MUDANÇA: language=en (Inglês) e pageSize=9 (Mais notícias)
        const url = `https://newsapi.org/v2/everything?q=aviation+airline&language=en&sortBy=publishedAt&pageSize=9&apiKey=${apiKey}`;
        
        const response = await axios.get(url);
        
        // Filtramos notícias que não tenham imagem para não ficar feio
        const validNews = response.data.articles.filter((art: Article) => art.urlToImage && art.title !== "[Removed]");
        setNews(validNews);

      } catch (error) {
        console.error("Erro ao buscar notícias", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-gray-900 rounded-xl animate-pulse border border-gray-800"></div>
        ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
      {news.map((article, index) => (
        <a key={index} href={article.url} target="_blank" className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-blue-900/20 hover:shadow-lg transition group flex flex-col h-full">
          <div className="h-48 bg-gray-800 relative overflow-hidden">
             <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
             <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs text-white font-bold">
                {article.source.name}
             </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="text-xs text-blue-400 mb-2 font-mono">
                {new Date(article.publishedAt).toLocaleDateString()}
            </div>
            <h3 className="text-white font-bold text-lg mb-3 leading-snug group-hover:text-blue-400 transition">{article.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-3 flex-1">{article.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}