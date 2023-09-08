import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', () => {
    const token = ref('');
    const accessKeyId = ref('');
    const accessKeySecret = ref('');
    const securityToken = ref('');
  return { token, accessKeyId, accessKeySecret, securityToken }
})
