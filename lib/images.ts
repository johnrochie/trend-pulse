// Image utilities for Trend Pulse
// Strategy: use article's own imageUrl first; fall back to a large curated Unsplash library

export interface ImageOptions {
  width?: number;
  height?: number;
  category?: string;
  text?: string;
}

export interface Article {
  id: number | string;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  tags?: string[];
  sourceName?: string;
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Large curated Unsplash photo libraries — 20-30 per category
// Used as fallback when an article has no imageUrl
// ---------------------------------------------------------------------------
const UNSPLASH: Record<string, string[]> = {
  technology: [
    '1518770660439-4636190af475', // circuit board
    '1526374965328-7f61d4dc18c5', // green code matrix
    '1488590528505-98d2b5aba04b', // laptop/code
    '1461749280684-dccba630e2f6', // dark code screen
    '1504639725590-34d0984388bd', // developer workspace
    '1484417894907-623942c8ee29', // tech abstract neon
    '1560472355-536de3962603',    // server racks / data centre
    '1451187580459-43490279c0fa', // space / satellite
    '1563986768494-4dee2763ff3f', // PCB close-up
    '1677442135703-1787eea5ce01', // neural-network diagram
    '1593642632559-0c6d3fc62b89', // coding closeup
    '1550745165-9bc0b252726f',    // devices on desk
    '1499951360447-b19be8fe80f5', // laptop workspace
    '1551434678-e076c223a692',    // code on monitor
    '1552664730-d307ca884978',    // data visualisation
    '1522071820081-009f0129c71c', // tech team
    '1444653614773-995cb1ef9efa', // office workspace
    '1556761175-b413da4baf72',    // office meeting
    '1581091226825-a6a2a5aee158', // VR headset
    '1629904853716-f0bc54eea481', // smart home / IoT
    '1498050108023-c5249f4df085', // laptop on desk
  ],
  business: [
    '1507679799987-c73779587ccf', // businessperson walking
    '1454165804606-c3d57bc86b40', // office collaboration
    '1556742049-0cfed4f6a45d',    // modern office
    '1542744094-24638eff58bb',    // presentation / whiteboard
    '1600880292203-757bb62b4baf', // business growth chart
    '1486406146926-c627a92ad1ab', // conference room
    '1460925895917-afdab827c52f', // finance charts
    '1551288049-bebda4e38f71',    // business meeting
    '1444653614773-995cb1ef9efa', // office workspace
    '1556761175-b413da4baf72',    // office meeting
    '1507003211169-0a1dd7228f2d', // professional headshot style
    '1520333789090-1afc82db536a', // handshake / deal
    '1499951360447-b19be8fe80f5', // laptop workspace
    '1573164713714-d95e436ab8d6', // city skyline / commerce
    '1568952433726-3896e3881c65', // delivery / logistics
    '1611532736597-de2d4265fba3', // e-commerce / shopping
    '1553877522-43269d4ea984',    // startup culture
  ],
  entertainment: [
    '1536440136628-849c177e76a1', // movie popcorn
    '1493225457124-a3eb161ffa5f', // live performance
    '1596394516093-501ba68a0ba6', // headphones / music
    '1511512578047-dfb367046420', // esports / gaming arena
    '1585951237318-9ea5e175b891', // gaming setup RGB
    '1607604276583-eef5d076aa5f', // music studio
    '1598488035139-bdbb2231ce04', // DJ / turntable
    '1522869635100-9f4c5e86aa37', // Netflix / streaming
    '1440404653325-ab127d49abc1', // film reel / director
    '1618336753974-aae8e04506aa', // gaming controller
    '1552820728-8b83bb6b773f',    // film production
    '1470229722913-7c0e2dbbafd3', // concert crowd
    '1571019613454-1cb2f99b2d8b', // actor / film
    '1559583985-c80d8ad9b29f',    // radio / podcast mic
  ],
  science: [
    '1507413245164-6160d8298b31', // lab equipment
    '1532187643603-ba119ca4109e', // microscope
    '1576319155264-99536e0be1ee', // lab research
    '1628595351029-c2bf17511435', // DNA / genetics
    '1465101162946-4377e57745c3', // astronomy / stars
    '1451187580459-43490279c0fa', // space / satellite
    '1582719471384-894fbb16e074', // rocket launch
    '1446776811953-b23d57bd21aa', // telescope / space
    '1507003211169-0a1dd7228f2d', // researcher
    '1522071820081-009f0129c71c', // research team
    '1495592822108-9e6261896da8', // chemistry lab
    '1486825586573-7131f7991bdd', // molecular biology
    '1518152006812-edab29b069ac', // climate science
    '1469395446868-fb6a048d5ca3', // ocean / marine
    '1576671081837-49000212a370', // doctor / medical
  ],
  health: [
    '1576091160550-2173dba999ef', // medical / stethoscope
    '1559757175-5700dde675bc',    // wellness / meditation
    '1490645935967-10de6ba17061', // fitness / exercise
    '1505751172876-fa1923c5c528', // healthcare professional
    '1584515933487-779824d29309', // medical technology
    '1571019613454-1cb2f99b2d8b', // health consultation
    '1526256262350-7da7584cf5eb', // healthy food / lifestyle
    '1512438248247-f0f2a5a8b7f0', // running / exercise
    '1576671081837-49000212a370', // doctor with tablet
    '1500595046743-cd271d694d30', // salad / nutrition
    '1532187643603-ba119ca4109e', // medical research
    '1579684385127-1ef15d508118', // pharmacy / medicine
    '1518152006812-edab29b069ac', // environment / health
    '1544367567-0f2fcb009e0b',    // yoga / mindfulness
  ],
  lifestyle: [
    '1506126613408-eca07ce68773', // morning coffee / lifestyle
    '1488521787991-ed7bbaae773c', // travel / adventure
    '1476514525535-07fb3b4ae5f1', // travel / wanderlust
    '1522202176988-66273c2fd55f', // friends / social
    '1549298916-b41d501d3772',    // sneakers / fashion
    '1484154218962-a197022b5858', // cooking / food
    '1414235077428-338989a2e8c0', // restaurant / dining
    '1504674900247-0877df9cc836', // food photography
    '1519985176271-adb1088fa94c', // adventure / outdoor
    '1507525428034-b723cf961d3e', // beach / travel
    '1571019613454-1cb2f99b2d8b', // lifestyle portrait
    '1586348943529-beaae6c28db9', // food & drink
    '1558618666-fcd25c85cd64',    // coffee shop
    '1533090161767-e6ffed986c88', // outdoor activity
  ],
  politics: [
    '1541872703-74c5e44368f9',    // Capitol / parliament
    '1503676260728-1c00da094a0b', // vote / election
    '1543286386-713bdd548da4',    // flag / patriotic
    '1491336477066-31156b5e4f35', // protest / democracy
    '1504711434969-e33886168f5c', // news / journalism
    '1519389950473-47ba0277781c', // government / policy
    '1504868584819-f8e8b4b6d7e3', // policy / document
  ],
  general: [
    '1504711434969-e33886168f5c', // news / newspaper
    '1495020689067-958852a7765e', // world news
    '1504868584819-f8e8b4b6d7e3', // documents
    '1588681664899-f142ff2dc9b1', // breaking news
    '1557804506-669a67965ba0',    // media / press
    '1502101872923-d48509bff386', // morning news
  ],
};

/**
 * Returns the article's source imageUrl if valid, otherwise the Unsplash fallback.
 * NOTE: source images may be blocked by hotlink protection — use ArticleImage
 * component instead of <Image> directly so onError can switch to the fallback.
 */
export function getArticleImage(article: any): string {
  // Use the article's own image if it looks like a real HTTP URL
  if (article.imageUrl && typeof article.imageUrl === 'string') {
    const url = article.imageUrl.trim();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
  }

  // Fallback: pick from the curated Unsplash pool
  return getUnsplashFallback(article);
}

/**
 * Always returns the Unsplash fallback (no hotlink risk).
 * Used as the onError replacement in the ArticleImage component.
 */
export function getArticleFallbackImage(article: any): string {
  return getUnsplashFallback(article);
}

/**
 * Deterministically picks an Unsplash image based on category + article id/title.
 * Same article always gets the same image — but different articles within a
 * category get different images thanks to the seed derived from the id.
 */
function getUnsplashFallback(article: any): string {
  const cat = (article.category || 'general').toLowerCase();
  const pool = UNSPLASH[cat] || UNSPLASH['general'];

  // Build a numeric seed from the article id and title
  const seedStr = String(article.id || '') + (article.title || '');
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = Math.imul(seed ^ seedStr.charCodeAt(i), 0x9e3779b9);
  }

  const idx = Math.abs(seed) % pool.length;
  return `https://images.unsplash.com/photo-${pool[idx]}?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format`;
}

/**
 * Emergency fallback if the primary Unsplash pick 404s (photos occasionally
 * get taken down). Always returns the category's first pool entry — a fixed,
 * different image from the deterministic pick, used only in onError.
 */
export function getArticleUltimateFallback(article: any): string {
  const cat = (article.category || 'general').toLowerCase();
  const pool = UNSPLASH[cat] || UNSPLASH['general'];
  return `https://images.unsplash.com/photo-${pool[0]}?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format`;
}

/**
 * Get image alt text
 */
export function getImageAltText(article: any): string {
  if (article.imageAlt) return article.imageAlt;
  const category = article.category || 'general';
  const title = article.title || 'News article';
  return `${title} — ${category} news on Trend Pulse`;
}

/**
 * Get optimized Unsplash URL with custom dimensions
 */
export function getOptimizedImageUrl(url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}): string {
  const { width = 800, height = 450, quality = 80 } = options;
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&h=${height}&fit=crop&crop=entropy&q=${quality}&auto=format`;
  }
  return url;
}

/**
 * Placeholder image (for backward compatibility)
 */
export function getPlaceholderImage(options: ImageOptions = {}): string {
  return getArticleImage({
    id: options.text || 'default',
    title: options.text || 'Default',
    category: options.category || 'technology',
  });
}
