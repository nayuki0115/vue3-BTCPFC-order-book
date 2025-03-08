<template>
  <div class="last-price" :class="[priceChangeClass, {
    'mobile-price': isMobileMD,
    'small-mobile-price': isMobileSM,
    'xs-mobile-price': isMobileXS
  }]">
    {{ formattedPrice }} <span class="price-arrow" v-if="priceChangeClass === 'price-up'">↑</span>
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
  display: inline-block;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s ease;
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
}

/* 平板裝置樣式 */
@media (max-width: 992px) {
  .last-price {
    font-size: 15px;
    padding: 4px 8px;
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