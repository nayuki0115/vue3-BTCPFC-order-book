<template>
  <div 
    class="order-book-row" 
    :class="[
      type === 'sell' ? 'sell-row' : 'buy-row',
      { 'new-row': level.isNew },
      { 'mobile-row': isMobileMD },
      { 'small-mobile-row': isMobileSM },
      { 'xs-mobile-row': isMobileXS }
    ]"
  >
    <div class="percentage-bar" :style="{ width: `${level.percentage}%`, backgroundColor: barColor }"></div>
    <div class="row-content">
      <div class="price-cell" :class="type === 'sell' ? 'sell-price' : 'buy-price'">
        {{ formatPrice(level.price) }}
      </div>
      <div 
        class="size-cell" 
        :class="{ 
          'size-increase': level.sizeChanged === 'increase',
          'size-decrease': level.sizeChanged === 'decrease'
        }"
      >
        {{ formatNumber(level.size) }}
      </div>
      <div class="total-cell">
        {{ formatNumber(level.total) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBreakpoint } from '@/composables/useBreakpoint';

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  percentage: number;
  isNew?: boolean;
  sizeChanged?: 'increase' | 'decrease' | null;
}

interface Props {
  level: OrderBookLevel;
  type: 'buy' | 'sell';
}

const props = defineProps<Props>();

const { isMobileMD, isMobileSM, isMobileXS } = useBreakpoint();

// 用於格式化 total 的函數 (保留千分位)
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0
  });
};

const formatPrice = (num: number) => {
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 1, 
    maximumFractionDigits: 1
  });
};

const barColor = computed(() => {
  return props.type === 'sell' 
    ? 'rgba(255, 90, 90, 0.12)' 
    : 'rgba(16, 186, 104, 0.12)';
});
</script>

<style scoped>
.order-book-row {
  position: relative;
  display: flex;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: unset;
  height: auto;
}

.order-book-row:hover {
  background-color: #1E3059;
}

.percentage-bar {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1;
}

.row-content {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 2;
  align-items: center;
}

.price-cell, .size-cell, .total-cell {
  flex: 1;
  text-align: right;
  font-weight: 500;
}

.price-cell {
  text-align: left;
}

.sell-price {
  color: #FF5B5A;
}

.buy-price {
  color: #00b15d;
}

.new-row {
  animation: flashNew 1s;
}

.size-increase {
  animation: flashGreen 1s;
}

.size-decrease {
  animation: flashRed 1s;
}

@keyframes flashNew {
  0% { background-color: transparent; }
  50% { background-color: rgba(255, 91, 90, 0.5); }
  100% { background-color: transparent; }
}

.buy-row.new-row {
  animation: flashNewGreen 1s;
}

@keyframes flashNewGreen {
  0% { background-color: transparent; }
  50% { background-color: rgba(0, 177, 93, 0.5); }
  100% { background-color: transparent; }
}

@keyframes flashGreen {
  0% { transform: scale(1); background-color: transparent; }
  50% { transform: scale(1.02); background-color: rgba(0, 177, 93, 0.5); }
  100% { transform: scale(1); background-color: transparent; }
}

@keyframes flashRed {
  0% { background-color: transparent; }
  50% { background-color: rgba(255, 91, 90, 0.5); }
  100% { background-color: transparent; }
}

/* 平板裝置樣式 */
@media (max-width: 992px) {
  .order-book-row {
    padding: 5px 14px;
    font-size: 13px;
  }
}

/* 行動裝置樣式 */
.mobile-row {
  padding: 5px 12px;
  font-size: 14px;
}

.small-mobile-row {
  padding: 4px 10px;
  font-size: 13px;
}

.xs-mobile-row {
  padding: 3px 8px;
  font-size: 12px;
}

/* 小型行動裝置 */
@media (max-width: 480px) {
  .order-book-row {
    padding: 4px 10px;
  }
  
  .mobile-row {
    padding: 3px 10px;
    font-size: 11px;
  }
}

/* 處理極小螢幕 */
@media (max-width: 320px) {
  .order-book-row {
    padding: 2px 8px;
  }

  .mobile-row {
    padding: 2px 8px;
    font-size: 10px;
  }
}
</style>