import { ref } from 'vue';

export interface CopyStatus {
  text: string;
  success: boolean;
  timestamp: number;
}

export function useCopyToClipboard() {
  const copyStatus = ref<CopyStatus | null>(null);
  
  const copyToClipboard = async (text: string | undefined) => {
    if (text === undefined) {
      text = "-";
    }
    
    try {
      // 首先尝试使用现代clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showCopyStatus(text, true);
        return;
      }
      
      // 如果clipboard API不可用，使用传统方法
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (successful) {
        showCopyStatus(text, true);
      } else {
        showCopyStatus(text, false);
      }
    } catch (err) {
      console.error("复制失败:", err);
      showCopyStatus(text, false);
    }
  };
  
  const showCopyStatus = (text: string, success: boolean) => {
    copyStatus.value = {
      text,
      success,
      timestamp: Date.now(),
    };
    
    // 2秒后清除提示
    setTimeout(() => {
      if (copyStatus.value?.timestamp === Date.now()) {
        copyStatus.value = null;
      }
    }, 2000);
  };
  
  return {
    copyStatus,
    copyToClipboard
  };
} 