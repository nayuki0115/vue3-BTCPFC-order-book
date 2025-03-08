<template>
  <div class="order-book" :class="{ 
    'mobile-view': isMobileMD, 
    'small-mobile-view': isMobileSM,
    'xs-mobile-view': isMobileXS 
  }">
    <div class="order-book-title">Order Book</div>
    
    <div class="order-book-header">
      <div class="header-cell price-header">{{ isMobile ? 'Price' : 'Price (USD)' }}</div>
      <div class="header-cell">Size</div>
      <div class="header-cell">Total</div>
    </div>
    
    <div class="order-book-sells">
      <OrderBookRow
        v-for="(level, index) in limitedSellOrders"
        :key="`sell-${level.price}-${index}`"
        :level="level"
        type="sell"
      />
    </div>
    
    <div class="last-price-container">
      <LastPrice
        v-if="lastPrice"
        :price="lastPrice"
        :previous-price="previousLastPrice"
      />
    </div>
    
    <div class="order-book-buys">
      <OrderBookRow
        v-for="(level, index) in limitedBuyOrders"
        :key="`buy-${level.price}-${index}`"
        :level="level"
        type="buy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OrderBookRow from './OrderBookRow.vue';
import LastPrice from '../LastPrice.vue';
import { useBreakpoint } from '@/composables/useBreakpoint';


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

interface Props {
  orderBookData: OrderBookData;
  lastPrice?: number | null;
  previousLastPrice?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  lastPrice: null,
  previousLastPrice: null
});

const { isMobileMD, isMobileSM, isMobileXS } = useBreakpoint();
const visibleRowCount = computed(() => {
  if (isMobileXS.value) return 5;
  if (isMobileSM.value) return 7;
  if (isMobileMD.value) return 8;
  return 10; // 默認/桌面版顯示行數
});

// 限制顯示的訂單數量
const limitedSellOrders = computed(() => {
  return props.orderBookData.sell.slice(0, visibleRowCount.value);
});

const limitedBuyOrders = computed(() => {
  return props.orderBookData.buy.slice(0, visibleRowCount.value);
});


</script>

<style scoped>
.order-book {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: #131B29;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.order-book-title {
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(134, 152, 170, 0.2);
  color: #F0F4F8;
}

.order-book-header {
  display: flex;
  padding: 8px 16px;
  font-size: 14px;
  color: #8698aa;
  border-bottom: 1px solid rgba(134, 152, 170, 0.2);
}

.header-cell {
  flex: 1;
  text-align: right;
}

.price-header {
  text-align: left;
}

.order-book-sells, .order-book-buys {
  max-height: 240px;
  overflow-y: auto;
  /* 確保滾動平滑 */
  scrollbar-width: thin;
  scrollbar-color: rgba(134, 152, 170, 0.3) transparent;
}

.order-book-sells::-webkit-scrollbar,
.order-book-buys::-webkit-scrollbar {
  width: 4px;
}

.order-book-sells::-webkit-scrollbar-thumb,
.order-book-buys::-webkit-scrollbar-thumb {
  background-color: rgba(134, 152, 170, 0.3);
  border-radius: 4px;
}

.last-price-container {
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(134, 152, 170, 0.2);
  border-bottom: 1px solid rgba(134, 152, 170, 0.2);
  background-color: #0F1622;
}

/* 平板裝置樣式 */
@media (max-width: 992px) {
  .order-book {
    max-width: 450px;
  }
  
  .order-book-sells, .order-book-buys {
    max-height: 200px;
  }
}

/* 行動裝置樣式 */
.mobile-view {
  font-size: 14px;
}

.mobile-view .order-book-title {
  padding: 12px;
  font-size: 16px;
}

.mobile-view .order-book-header {
  padding: 6px 12px;
  font-size: 13px;
}

.mobile-view .last-price-container {
  padding: 8px 12px;
}

.mobile-view .order-book-sells, 
.mobile-view .order-book-buys {
  max-height: 180px;
}

.small-mobile-view .order-book-title {
  padding: 10px;
  font-size: 15px;
}

.small-mobile-view .order-book-header {
  padding: 5px 10px;
  font-size: 12px;
}

.small-mobile-view .order-book-sells,
.small-mobile-view .order-book-buys {
  max-height: 150px;
}

/* 極小型螢幕樣式 */
.xs-mobile-view .order-book-title {
  font-size: 14px;
  padding: 8px;
}

.xs-mobile-view .order-book-header {
  font-size: 11px;
}

.xs-mobile-view .order-book-sells,
.xs-mobile-view .order-book-buys {
  max-height: 130px;
}


/* 小型行動裝置 */
@media (max-width: 480px) {
  .order-book {
    border-radius: 0;
    max-width: 100%;
  }
  
  .order-book-title {
    padding: 10px;
    font-size: 15px;
  }
  
  .order-book-header {
    padding: 5px 10px;
    font-size: 12px;
  }
  
  .order-book-sells, .order-book-buys {
    max-height: 150px;
  }
}

/* 處理極小螢幕 */
@media (max-width: 320px) {
  .order-book-title {
    font-size: 14px;
    padding: 8px;
  }
  
  .order-book-header {
    font-size: 11px;
  }
  
  .order-book-sells, .order-book-buys {
    max-height: 130px;
  }
}
</style>