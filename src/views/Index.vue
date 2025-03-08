<template>
  <div class="container">
    <h1>BTCPFC 訂單簿</h1>
    
    <OrderBook 
      :order-book-data="orderBookData" 
      :last-price="lastPrice"
      :previous-last-price="previousLastPrice"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import OrderBook from '@/components/OrderBook/Index.vue';
import { useOrderBookWebSocket } from '@/apis/websocketApi';

const { connect, disconnect, orderBookData, lastPrice, previousLastPrice } = useOrderBookWebSocket();


onMounted(() => {
  connect();
});

onUnmounted(() => {
  disconnect();
});
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #F0F4F8;
}

/* 平板裝置樣式 */
@media (max-width: 992px) {
  .container {
    padding: 15px;
  }
  
  h1 {
    margin-bottom: 15px;
  }
}

/* 行動裝置樣式 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
}

/* 小型行動裝置 */
@media (max-width: 480px) {
  .container {
    padding: 8px;
  }
  
  h1 {
    font-size: 1.3rem;
    margin-bottom: 12px;
  }
}

/* 處理極小螢幕 */
@media (max-width: 320px) {
  .container {
    padding: 5px;
  }
  
  h1 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
}
</style>