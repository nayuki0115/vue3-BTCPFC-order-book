<template>
  <div class="order-book" :class="{ 
    'tablet-view': isTablet,
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
    
    <div class="price-separator"></div>
  
  <div class="last-price-container">
    <LastPrice
      v-if="lastPrice"
      :price="lastPrice"
      :previous-price="previousLastPrice"
    />
  </div>
  
  <div class="price-separator"></div>
    
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


interface Props {
  orderBookData: OrderBookData;
  lastPrice?: number | null;
  previousLastPrice?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  lastPrice: null,
  previousLastPrice: null
});

const { isMobileMD, isMobileSM, isMobileXS, isTablet } = useBreakpoint();

const isMobile = computed(() => {
  return isMobileMD.value || isMobileSM.value || isMobileXS.value || isTablet.value;
})

const visibleRowCount = computed(() => {
  if (isMobileXS.value) return 4;
  if (isMobileSM.value) return 5;
  if (isMobileMD.value) return 6;
  if (isTablet.value) return 7;
  return 8; // 默認/桌面版顯示行數
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
/* Base styles */
.order-book {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: #131B29;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  font-size: min(16px, 4vw);
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
  flex-wrap: nowrap;
}

.header-cell {
  flex: 1;
  text-align: right;
}

.price-header {
  text-align: left;
}

/* Order sections */
.order-book-sells {
  margin-bottom: 10px;
}

.order-book-buys {
  margin-top: 10px;
}

/* Price section */
.last-price-container {
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(134, 152, 170, 0.2);
  border-bottom: 1px solid rgba(134, 152, 170, 0.2);
  background-color: #0F1622;
  position: relative;
  z-index: 10;
  margin: 5px 0;
}

.price-separator {
  height: 5px;
  background-color: transparent;
}

/* Commented out scrollbar styles - keeping for reference
.order-book-sells, .order-book-buys {
  max-height: 240px;
  overflow-y: auto;
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
*/

/* Responsive Styles - Tablet (992px and below) */
.tablet-view {
  font-size: 15px;
}

.tablet-view .order-book-title {
  padding: 14px;
  font-size: 17px;
}

.tablet-view .order-book-header {
  padding: 7px 14px;
  font-size: 13px;
}

.tablet-view .order-book-sells, 
.tablet-view .order-book-buys {
  max-height: 210px;
}

.tablet-view .price-separator {
  height: 8px;
}

.tablet-view .last-price-container {
  margin: 8px 0;
}

/* Responsive Styles - Mobile (768px and below) */
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
  margin: 10px 0;
}

.mobile-view .order-book-row {
  padding: 4px 12px;
  min-height: 28px;
}

.mobile-view .order-book-sells, 
.mobile-view .order-book-buys {
  max-height: none;
  height: auto;
}

.mobile-view .price-separator {
  height: 10px;
}

/* Responsive Styles - Small Mobile (480px and below) */
.small-mobile-view .order-book-title {
  padding: 10px;
  font-size: 15px;
}

.small-mobile-view .order-book-header {
  padding: 5px 10px;
  font-size: 12px;
}

.small-mobile-view .order-book-row {
  padding: 3px 10px;
  min-height: 24px;
}

.small-mobile-view .order-book-sells,
.small-mobile-view .order-book-buys {
  max-height: none;
  height: auto;
}

/* Responsive Styles - Extra Small Mobile (320px and below) */
.xs-mobile-view .order-book-title {
  font-size: 14px;
  padding: 8px;
}

.xs-mobile-view .order-book-header {
  font-size: 11px;
}

.xs-mobile-view .order-book-row {
  padding: 2px 8px;
  min-height: 20px;
}

.xs-mobile-view .order-book-sells,
.xs-mobile-view .order-book-buys {
  max-height: none;
  height: auto;
}

/* Legacy media queries - these can be removed since we're using class-based responsive design */
@media (max-width: 992px) {
  .order-book {
    max-width: 450px;
  }
}

@media (max-width: 480px) {
  .order-book {
    border-radius: 0;
    max-width: 100%;
  }
}

@media (max-width: 320px) {
  .order-book {
    max-width: 100%;
    margin: 0;
  }
}
</style>