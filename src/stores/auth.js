import { saveJwtToken, deleteJwtToken, saveUsername, deleteUsername } from "@/services/localStorageServices";
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    username: ''
  }),
  getters: {
    getUsername() {
      return this.username
    }
  },
  actions: {
    login(token, username) {
      this.authenticated = true
      this.username = username
      saveJwtToken(token)
      saveUsername(username)
    },
    logout() {
      this.authenticated = false
      this.username = ''
      deleteJwtToken()
      deleteUsername()
    }
  },
})