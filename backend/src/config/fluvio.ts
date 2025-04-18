import axios from 'axios';
import { exec } from 'child_process';
import util from 'util';
import { Stock } from '../models/Stock';
import dotenv from 'dotenv';


const execPromise = util.promisify(exec);

dotenv.config();
const tickers = process.env.TICKERS?.split(',') || [];
const count = tickers.length;
const limitNewsProduction = Number(process.env.NEWS_PRODUCE_LIMIT || 5);
const limitNewsConsumption = Number(process.env.NEWS_CONSUME_LIMIT || 10);
const batchSize = Number(process.env.NEWS_BATCH_SIZE || 5);
const STOCK_TOPIC = process.env.FLUVIO_TOPIC_STOCKS || 'stocks';
const NEWS_TOPIC = process.env.FLUVIO_TOPIC_NEWS || 'news';

// API config
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
const FINNHUB_API_URLSTOCKS = process.env.FINNHUB_STOCK_URL!;
const FINNHUB_API_URLNEWS = process.env.FINNHUB_NEWS_URL!;

// Interfaces
interface StockData {
  c: number;  // Current price
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
}

interface NewsData {
  category: string;
  datetime: number; // Unix timestamp
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export class FluvioService {

  static async fetchAndProduceStocks() {
    const producePromises = tickers.map(async (symbol) => {
      try {
        // Fetch latest stock data from Finnhub
        const { data, headers } = await axios.get<StockData>(`${FINNHUB_API_URLSTOCKS}?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        
        // Log rate limit status
        const remainingRequests = headers['x-ratelimit-remaining'];
        const resetTime = headers['x-ratelimit-reset'];
        console.log(`[Rate Limit] Remaining requests: ${remainingRequests}, Reset time: ${new Date(Number(resetTime) * 1000).toLocaleString()}`);
  
        // Check if we're about to hit the rate limit
        if (remainingRequests && Number(remainingRequests) <= 5) {
          console.warn('[Rate Limit Warning] About to hit the rate limit. Consider waiting before making more requests.');
        }
  
        const stockData = {
          symbol,
          price: data.c, // current price
          time: new Date().toISOString(),
          high: data.h,
          low: data.l,
          open: data.o,           
          previousClose: data.pc 
        };
  
        // Produce to Fluvio topic using CLI
        const cmd = `echo '${JSON.stringify(stockData)}' | fluvio produce ${STOCK_TOPIC}`;
        await execPromise(cmd);
        console.log(cmd);
  
        console.log(`[fetchAndProduceStock] ✅ Produced stock: ${symbol}`);
      } catch (err: any) {
        console.error(`[Stock Fetch ERROR] ❌ ${symbol}:`, err?.response?.data || err.message || err);
      }
    });
  
    // Wait for all to finish in parallel
    await Promise.all(producePromises);
  }
  

  static async consumeStocks(): Promise<any[]> {
    try {
      const { stdout } = await execPromise(`fluvio consume ${STOCK_TOPIC} -B -d | tail -n ${count}`);
  
      const stocks = stdout
        .trim()
        .split('\n')
        .map((line: string) => {
          try {
            const parsed = JSON.parse(line);
  
            // Log the parsed object to ensure it has all fields
            console.log('[FluvioService] Parsed stock:', parsed);
  
            // Return the entire stock object
            return {
              ...parsed // Spread the entire parsed object
            };
          } catch (err) {
            console.error('[FluvioService] Error parsing stock line:', err, 'Line:', line);
            return null;
          }
        })
        .filter(Boolean); // Filter out null values from any failed parsing
  
      console.log(`[FluvioService] Consumed ${stocks.length} full stocks from Fluvio`);
      return stocks;
    } catch (error) {
      console.error('[FluvioService] Error consuming stocks from Fluvio:', error);
      return [];
    }
  }
  

  static async fetchAndProduceNews(): Promise<NewsData[]> {
    try {
      // Fetch the latest news data from Finnhub
      const { data, headers } = await axios.get<NewsData[]>(`${FINNHUB_API_URLNEWS}&token=${FINNHUB_API_KEY}`);
      
      // Log rate limit status
      const remainingRequests = headers['x-ratelimit-remaining'];
      const resetTime = headers['x-ratelimit-reset'];
      console.log(`[Rate Limit] Remaining requests: ${remainingRequests}, Reset time: ${new Date(Number(resetTime) * 1000).toLocaleString()}`);
  
      // Check if we're about to hit the rate limit
      if (remainingRequests && Number(remainingRequests) <= 5) {
        console.warn('[Rate Limit Warning] About to hit the rate limit. Consider waiting before making more requests.');
      }
  
      const producedNews: NewsData[] = [];
  
      const limitedData = data.slice(0, limitNewsProduction); // Limit the number of news items to produce
  
      // Process news in smaller chunks to avoid delays and timeouts
      for (let i = 0; i < limitedData.length; i += batchSize) {
        const batch = limitedData.slice(i, i + batchSize); // Process 'batchSize' items at a time
  
        const batchPromises = batch.map(async (item) => {
          try {
            const newsItem: NewsData = {
              category: item.category,
              datetime: item.datetime,
              headline: item.headline,
              id: item.id,
              image: item.image,
              related: item.related,
              source: item.source,
              summary: item.summary,
              url: item.url,
            };
  
            const jsonStr = JSON.stringify(newsItem).replace(/'/g, `'\\''`);
            const cmd = `echo '${jsonStr}' | fluvio produce ${NEWS_TOPIC}`;
            console.log('[Produce News Command]', cmd); // Debugging line
  
            // Execute the command to produce the news item
            await execPromise(cmd);
            producedNews.push(newsItem); // Add the produced news item to the array
          } catch (err) {
            console.error('[Produce News Error]:', err);
          }
        });
  
        // Wait for all batch promises to resolve before continuing
        await Promise.all(batchPromises);
  
        // Optional: Add a small delay between batches to prevent timeouts
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between batches
      }
  
      console.log('[fetchAndProduceNews] Produced news:', producedNews);
      return producedNews;
  
    } catch (err: any) {
      console.error('[News Fetch ERROR]:', err?.response?.data || err.message || err);
      return []; // Return an empty array in case of error
    }
  }
  
  
  static async consumeNews(): Promise<NewsData[]> {
    try {
      // Consume a batch of news items from Fluvio, based on the limitNewsConsumption variable
      const { stdout } = await execPromise(`fluvio consume ${NEWS_TOPIC} -B -d | tail -n ${limitNewsConsumption}`);
      
      const news = stdout
        .trim()
        .split('\n')
        .map((line: string) => {
          try {
            const parsed = JSON.parse(line);
  
            const formattedNews: NewsData = {
              category: parsed.category || 'general',
              datetime: parsed.datetime || Math.floor(Date.now() / 1000),
              headline: parsed.headline || 'No headline provided',
              id: parsed.id || Date.now(), // fallback unique ID
              image: parsed.image || '',
              related: parsed.related || '',
              source: parsed.source || 'Unknown Source',
              summary: parsed.summary || '',
              url: parsed.url || '#',
            };
  
            return formattedNews;
          } catch (err) {
            console.error('[FluvioService] Error parsing news line:', err, 'Line:', line);
            return null;
          }
        })
        .filter((item): item is NewsData => item !== null); // Type-safe filter
  
      // Check if we have exactly the number of news items as expected
      if (news.length !== limitNewsConsumption) {
        console.warn(`[FluvioService] Expected ${limitNewsConsumption} news items, but received ${news.length}.`);
      }
  
      return news; // Return the batch of news items
  
    } catch (error) {
      console.error('[FluvioService] Error consuming news from Fluvio:', error);
      return []; // Return an empty array in case of error
    }
  }


  private static isPollingStocks = false;
  static async storeStocksToMongoOnly() {
    for (const symbol of tickers) {
      try {
        const { data } = await axios.get<StockData>(
          `${FINNHUB_API_URLSTOCKS}?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
  
        const stockData = {
          symbol,
          price: data.c,
          time: new Date().toISOString(),
        };
  
        await Stock.create(stockData);
        console.log(`[storeStocksToMongoOnly] ✅ Stored: ${symbol}`);
      } catch (err: any) {
        console.error(`[DB Store ERROR] ${symbol}:`, err?.response?.data || err.message || err);
      }
    }
    console.log('📌 All stocks polling completed.');
  }
  static startStockPolling(intervalMs: number = 150000) {
    const minutes = (intervalMs / 60000).toFixed(2);
    console.log(`📊 Stock polling to MongoDB started. Every ${intervalMs} ms (~${minutes} minute(s))...`);

    // Immediate run
    this.storeStocksToMongoOnly();
  
    const ClassRef = this;
  
    setInterval(async () => {
      if (ClassRef.isPollingStocks) return;
  
      ClassRef.isPollingStocks = true;
      console.log('⏱️ Polling stock data for DB...');
  
      try {
        await ClassRef.storeStocksToMongoOnly();
      } catch (err) {
        console.error('Polling DB-only error:', err);
      } finally {
        ClassRef.isPollingStocks = false;
      }
    }, intervalMs);
  }

}

