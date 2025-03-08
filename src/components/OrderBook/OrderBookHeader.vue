<template>
  <div class="order-book-header">
    <div class="header-cell">價格 (USD)</div>
    <div class="header-cell">數量</div>
    <div class="header-cell">總計</div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
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

.header-cell:first-child {
  text-align: left;
}
</style>