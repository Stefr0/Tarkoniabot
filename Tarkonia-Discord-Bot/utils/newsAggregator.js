import fetch from 'node-fetch';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

const RSS_FEEDS = [
  'https://www.escapefromtarkov.com/rss/news_en',
  'https://twitter.com/bstategames/rss',
  // Add more RSS feeds as needed
];

export async function fetchLatestNews() {
  const newsItems = [];

  for (const feed of RSS_FEEDS) {
    try {
      const response = await fetch(feed);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xml = await response.text();
      const result = await parseXml(xml);

      if (!result.rss || !result.rss.channel || !result.rss.channel[0].item) {
        console.error(`Invalid RSS feed structure for ${feed}`);
        continue;
      }

      const items = result.rss.channel[0].item;
      for (const item of items.slice(0, 5)) { // Get the 5 most recent items
        if (!item.title || !item.link || !item.pubDate) {
          console.error(`Invalid item structure in feed ${feed}`);
          continue;
        }
        newsItems.push({
          title: item.title[0],
          link: item.link[0],
          pubDate: new Date(item.pubDate[0]),
          source: feed.includes('twitter') ? 'Twitter' : 'Official Website'
        });
      }
    } catch (error) {
      console.error(`Error fetching news from ${feed}:`, error);
    }
  }

  return newsItems.sort((a, b) => b.pubDate - a.pubDate).slice(0, 10); // Return the 10 most recent items overall
}

