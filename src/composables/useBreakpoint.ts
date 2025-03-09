import { ref, onMounted, onUnmounted, computed } from 'vue';
import { breakpoints } from '@/utils/breakpoints';

export function useBreakpoint() {
  const windowWidth = ref(window.innerWidth);

  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    windowWidth,
    isMobileXS: computed(() => windowWidth.value < breakpoints.mobileXS),
    isMobileSM: computed(() => windowWidth.value < breakpoints.mobileSM),
    isMobileMD: computed(() => windowWidth.value < breakpoints.mobileMD),
    isTablet: computed(() => windowWidth.value >= breakpoints.mobileMD && windowWidth.value < breakpoints.tablet),
    isDesktop: computed(() => windowWidth.value >= breakpoints.tablet)
  };
}