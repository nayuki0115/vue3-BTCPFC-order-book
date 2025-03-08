interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  percentage: number;
  isNew?: boolean;
  sizeChanged?: 'increase' | 'decrease' | null;
}

interface OrderBookData {
  sell: OrderBookLevel[];
  buy: OrderBookLevel[];
  seqNum: number;
}

interface WebSocketResponse {
  topic: string;
  data: any;
  type?: string;
  seqNum?: number;
  prevSeqNum?: number;
}

interface TradeData {
  symbol: string;
  side: string;
  price: number;
  size: number;
  timestamp: number;
}