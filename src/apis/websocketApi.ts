// src/apis/websocketApi.ts
import { ref, computed } from 'vue';

export function useOrderBookWebSocket() {
  // 添加連接狀態跟踨
  const connectionStatus = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const errorMessage = ref<string | null>(null);

  // 保留現有的數據引用
  const orderBookData = ref<OrderBookData>({
    sell: [],
    buy: [],
    seqNum: 0
  });
  const lastPrice = ref<number | null>(null);
  const previousLastPrice = ref<number | null>(null);

  // 分別為訂單簿和交易歷史建立WebSocket引用
  const orderBookSocket = ref<WebSocket | null>(null);
  const tradeHistorySocket = ref<WebSocket | null>(null);

  // 連接訂單簿WebSocket
  const connectOrderBook = () => {
    try {
      // 關閉任何現有連接
      if (orderBookSocket.value) {
        orderBookSocket.value.close();
      }

      connectionStatus.value = 'connecting';
      errorMessage.value = null;

      //  WebSocket端點
      const ws = new WebSocket('wss://ws.btse.com/ws/oss/futures');

      ws.onopen = () => {
        console.log('訂單簿WebSocket連接成功');

        // 訂閱
        const subscribeMsg = JSON.stringify({
          op: 'subscribe',
          args: ['update:BTCPFC']
        });
        ws.send(subscribeMsg);
        console.log('已發送訂閱請求:', subscribeMsg);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // 記錄接收到的數據，用於調整
          // console.log('收到訂單簿WebSocket數據:', data);

          // 檢查是否有錯誤消息
          if (data.severity === 'ERROR') {
            console.error('訂單簿訂閱錯誤:', data.errors);
            errorMessage.value = `訂閱錯誤: ${data.errors[0]?.error?.message || '未知錯誤'}`;
            return;
          }

          // 處理訂單簿數據
          if (data.topic && data.topic.includes('update:')) {
            handleOrderBookUpdate(data);
          }
        } catch (err) {
          console.error('處理訂單簿WebSocket消息時出錯:', err);
          errorMessage.value = '處理數據時出錯';
        }
      };

      ws.onerror = (error) => {
        console.error('訂單簿WebSocket錯誤:', error);
        connectionStatus.value = 'error';
        errorMessage.value = '訂單簿WebSocket連接錯誤';
      };

      ws.onclose = () => {
        console.log('訂單簿WebSocket連接關閉');
        if (tradeHistorySocket.value === null) {
          connectionStatus.value = 'disconnected';
        }
      };

      orderBookSocket.value = ws;
    } catch (err) {
      console.error('建立訂單簿WebSocket時出錯:', err);
      connectionStatus.value = 'error';
      errorMessage.value = '無法建立訂單簿WebSocket連接';
    }
  };

  // 連接交易歷史WebSocket
  const connectTradeHistory = () => {
    try {
      // 關閉任何現有連接
      if (tradeHistorySocket.value) {
        tradeHistorySocket.value.close();
      }

      const ws = new WebSocket('wss://ws.btse.com/ws/futures');

      ws.onopen = () => {
        console.log('交易歷史WebSocket連接成功');

        // 使用正確的主題格式訂閱
        const subscribeMsg = JSON.stringify({
          op: 'subscribe',
          args: ['tradeHistoryApi:BTCPFC']
        });
        ws.send(subscribeMsg);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // 記錄接收到的數據，用於調試
          console.log('收到交易歷史WebSocket數據:', data);

          // 檢查是否有錯誤消息
          if (data.severity === 'ERROR') {
            console.error('交易歷史訂閱錯誤:', data.errors);
            return;
          }

          // 處理交易歷史數據，獲取最新價格
          console.log('data.topic', data.topic)
          if (data.topic && data.topic.includes('tradeHistoryApi')) {
            handlePriceUpdate(data);
          }
        } catch (err) {
          console.error('處理交易歷史WebSocket消息時出錯:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('交易歷史WebSocket錯誤:', error);
      };

      ws.onclose = () => {
        console.log('交易歷史WebSocket連接關閉');
      };

      tradeHistorySocket.value = ws;
    } catch (err) {
      console.error('建立交易歷史WebSocket時出錯:', err);
    }
  };

  // 連接所有WebSocket
  const connect = () => {
    connectOrderBook();
    connectTradeHistory();
    connectionStatus.value = 'connected';
  };

  // 斷開所有WebSocket連接
  const disconnect = () => {
    if (orderBookSocket.value) {
      orderBookSocket.value.close();
      orderBookSocket.value = null;
    }

    if (tradeHistorySocket.value) {
      tradeHistorySocket.value.close();
      tradeHistorySocket.value = null;
    }

    connectionStatus.value = 'disconnected';
  };

  // 處理訂單簿更新
  const handleOrderBookUpdate = (data: any) => {
    // 根據API文件處理數據
    if (data.data.type === 'snapshot') {
      // 處理完整快照數據
      const sells: OrderBookLevel[] = [];
      const buys: OrderBookLevel[] = [];

      if (data.data && Array.isArray(data.data.asks)) {
        let total = 0;
        data.data.asks.forEach((item: [number, number]) => {
          total += Number(item[1]);
          sells.push({
            price: item[0],
            size: Number(item[1]),
            total: total,
            percentage: 0,
            isNew: true
          });
        });
      }

      if (data.data && Array.isArray(data.data.bids)) {
        let total = 0;
        data.data.bids.forEach((item: [number, number]) => {
          total += Number(item[1]);
          buys.push({
            price: item[0],
            size: Number(item[1]),
            total: total,
            percentage: 0,
            isNew: true
          });
        });
      }

      // 計算百分比
      calculatePercentages(sells, buys);

      // 更新數據
      orderBookData.value = {
        sell: sells,
        buy: buys,
        seqNum: data.seqNum || 0
      };
    } else if (data.data.type === 'delta') {
      // 處理更新的數據
      // 檢查序列號是否吻合
      if (data.prevSeqNum !== orderBookData.value.seqNum) {
        // console.warn('序列號不合，重新訂閱獲取完整快照');
        // 重新訂閱以獲取新的快照
        if (orderBookSocket.value) {
          const resubscribeMsg = JSON.stringify({
            op: 'unsubscribe',
            args: ['update:BTCPFC']
          });
          orderBookSocket.value.send(resubscribeMsg);

          setTimeout(() => {
            if (orderBookSocket.value) {
              const subscribeMsg = JSON.stringify({
                op: 'subscribe',
                args: ['update:BTCPFC']
              });
              orderBookSocket.value.send(subscribeMsg);
            }
          }, 100);
        }
        return;
      }

      // 建立當前數據的副本
      const newSells = [...orderBookData.value.sell];
      const newBuys = [...orderBookData.value.buy];

      // 應用增量更新 - 賣單(asks)
      if (data.data && Array.isArray(data.data.asks)) {
        data.data.asks.forEach((item: [number, number]) => {
          const price = item[0];
          const size = item[1];

          // 查詢是否存在此價格等級
          const index = newSells.findIndex(level => level.price === price);

          if (size === 0 && index !== -1) {
            // 如果大小為0，則刪除該等級
            newSells.splice(index, 1);
          } else if (index !== -1) {
            // 更新現有等級
            newSells[index].size = size;
            newSells[index].isNew = true;
          } else if (size > 0) {
            // 添加新等級
            let insertIndex = 0;
            while (insertIndex < newSells.length && newSells[insertIndex].price < price) {
              insertIndex++;
            }

            newSells.splice(insertIndex, 0, {
              price,
              size,
              total: 0, // 稍後重新計算
              percentage: 0,
              isNew: true
            });
          }
        });
      }

      // 應用增量更新 - 買單(bids)
      if (data.data && Array.isArray(data.data.bids)) {
        data.data.bids.forEach((item: [number, number]) => {
          const price = item[0];
          const size = item[1];

          // 查找是否存在此價格等級
          const index = newBuys.findIndex(level => level.price === price);

          if (size === 0 && index !== -1) {
            // 如果大小為0，則刪除該等級
            newBuys.splice(index, 1);
          } else if (index !== -1) {
            // 更新現有等級
            newBuys[index].size = size;
            newBuys[index].isNew = true;
          } else if (size > 0) {
            // 添加新等級
            let insertIndex = 0;
            while (insertIndex < newBuys.length && newBuys[insertIndex].price > price) {
              insertIndex++;
            }

            newBuys.splice(insertIndex, 0, {
              price,
              size,
              total: 0, // 稍後重新計算
              percentage: 0,
              isNew: true
            });
          }
        });
      }

      // 重新計算總量
      let sellTotal = 0;
      newSells.forEach(level => {
        sellTotal += Number(level.size);
        level.total = sellTotal;
      });

      let buyTotal = 0;
      newBuys.forEach(level => {
        buyTotal += Number(level.size);
        level.total = buyTotal;
      });

      // 重新計算百分比
      calculatePercentages(newSells, newBuys);

      // 更新數據並設置新的序列號
      orderBookData.value = {
        sell: newSells,
        buy: newBuys,
        seqNum: data.seqNum || 0
      };
    }
  };

  // 計算顯示百分比
  const calculatePercentages = (sells: OrderBookLevel[], buys: OrderBookLevel[]) => {
    // 找出最大總量，用於計算百分比
    const maxSellTotal = sells.length > 0 ? sells[sells.length - 1].total : 0;
    const maxBuyTotal = buys.length > 0 ? buys[buys.length - 1].total : 0;
    const maxTotal = Math.max(maxSellTotal, maxBuyTotal);

    // 計算每個級別的百分比
    sells.forEach(level => {
      level.percentage = maxTotal > 0 ? (level.total / maxTotal) * 100 : 0;
    });

    buys.forEach(level => {
      level.percentage = maxTotal > 0 ? (level.total / maxTotal) * 100 : 0;
    });
  };

  // 處理價格更新
  const handlePriceUpdate = (data: any) => {
    console.log('處理價格更新:', data);

    // 檢查 topic 是否只是 "tradeHistoryApi"，而不是 "tradeHistoryApi:BTCPFC"
    if (data.topic && (data.topic === 'tradeHistoryApi' || data.topic.includes('tradeHistoryApi:'))) {
      // 按照文件，檢查data是否直接是交易 Array 
      if (Array.isArray(data.data) && data.data.length > 0) {
        // 使用第一筆交易的價格作為最新價格
        const newPrice = data.data[0].price;
        console.log('提取到新價格:', newPrice);

        previousLastPrice.value = lastPrice.value;
        lastPrice.value = newPrice;
      } else {
        console.warn('未找到有效的交易數據:', data);
      }
    }
  };

  // 每5秒檢查一次連接狀態，如果斷開則重新連接
  const startAutoReconnect = () => {
    setInterval(() => {
      if (connectionStatus.value !== 'connected' && connectionStatus.value !== 'connecting') {
        console.log('檢測到斷開連接，嘗試重新連接...');
        connect();
      }
    }, 5000);
  };

  return {
    connect,
    disconnect,
    orderBookData,
    lastPrice,
    previousLastPrice,
    connectionStatus,
    errorMessage,
    isConnected: computed(() => connectionStatus.value === 'connected'),
    startAutoReconnect
  }
}