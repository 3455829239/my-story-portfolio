import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Blur-up: 先显示低清图，高清异步加载完成后淡入替换。
 */
export function useBlurUp(fullSrc) {
  const ready = ref(false)
  let img = null

  onMounted(() => {
    img = new Image()
    img.src = fullSrc
    if (img.complete) {
      ready.value = true
      return
    }
    img.onload = () => {
      ready.value = true
    }
  })

  onUnmounted(() => {
    if (img) {
      img.onload = null
      img = null
    }
  })

  return { ready }
}
