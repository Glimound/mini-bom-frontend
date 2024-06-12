import { saveJwtToken, deleteJwtToken } from "@/services/jwtServices";
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    uid: ''
  }),
  getters: {

  },
  actions: {
    login(token, uid) {
      this.authenticated = true
      this.uid = uid
      saveJwtToken(token)
    },
    logout() {
      this.authenticated = false
      this.uid = ''
      deleteJwtToken()
    }
  },
})