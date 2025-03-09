<template>
  <div class="last-price" :class="[priceChangeClass, {
    'mobile-price': isMobileMD,
    'small-mobile-price': isMobileSM,
    'xs-mobile-price': isMobileXS
  }]">
    {{ formattedPrice }} 
    <span class="price-arrow" v-if="priceChangeClass === 'price-up'">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
           fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" 
           stroke-linejoin="round" class="arrow-icon">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </span>
    <span class="price-arrow" v-if="priceChangeClass === 'price-down'">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
           fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" 
           stroke-linejoin="round" class="arrow-icon">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBreakpoint } from '@/composables/useBreakpoint';

interface Props {
  price: number;
  previousPrice?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  previousPrice: null
});

const { isMobileMD, isMobileSM, isMobileXS } = useBreakpoint()


const formattedPrice = computed(() => {
  return props.price.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
});

const priceChangeClass = computed(() => {
  if (props.previousPrice === null) return '';
  if (props.price > props.previousPrice) return 'price-up';
  if (props.price < props.previousPrice) return 'price-down';
  return 'price-same';
});
</script>

<style scoped>
.last-price {
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-flex; /* 改為 inline-flex */
  align-items: center; /* 確保內容垂直居中 */
  justify-content: center; /* 水平居中內容 */
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s ease;
  background-color: #0F1622; /* 添加背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 添加陰影增強視覺分離 */
  margin: 2px 0; /* 添加一些垂直空間 */
}

.price-up {
  color: #00b15d;
}

.price-down {
  color: #FF5B5A;
}

.price-same {
  color: #F0F4F8;
}

.price-arrow {
  margin-left: 3px;
  display: inline-flex; 
  align-items: center;
  vertical-align: middle;
}

.arrow-icon {
  vertical-align: middle;
  position: relative;
  top: -1px;
}

/* 平板裝置樣式 */
@media (max-width: 992px) {
  .last-price {
    padding: 6px 12px; 
    margin: 4px 0;
  }
}

/* 行動裝置樣式 */
.mobile-price {
  font-size: 14px;
  padding: 4px 8px;
}

.small-mobile-price {
  font-size: 13px;
  padding: 3px 7px;
}

.xs-mobile-price {
  font-size: 12px;
  padding: 2px 6px;
}

/* 小型行動裝置 */
@media (max-width: 480px) {
  .last-price {
    font-size: 13px;
    padding: 3px 7px;
  }
}

/* 處理極小螢幕 */
@media (max-width: 320px) {
  .last-price {
    font-size: 12px;
    padding: 2px 6px;
  }
}
</style>