<template>
  <div class="form-container">
    <el-form :model="registerForm">
      <p>欢迎注册</p>
      <el-alert v-if="error" :title="errorMessage" type="error" show-icon :closable="false" />
      <el-form-item>
        <el-input
          class="input"
          v-model="registerForm.account"
          type="text"
          :placeholder="accountPlaceholder"
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          class="input"
          v-model="registerForm.password"
          type="password"
          placeholder="密码"
          show-password
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          class="input"
          v-model="registerForm.code"
          type="text"
          :placeholder="codePlaceholder"
          :prefix-icon="Message"
          style="width: 62%;"
        />
        <el-button
          class="button-get-code"
          type="primary"
          plain
          @click="getCode"
          :disabled="getCodeDisabled"
          :loading="getCodeLoading"
        >
          {{ getCodeDesc }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="button-register" type="primary" @click="register">注 册</el-button>
      </el-form-item>
      <el-form-item>
        <div class="toggle-area">
          <el-button @click="toggleChange" class="button-text" type="primary" link>{{ registerTypeButtonText }}</el-button>
          <el-button @click="routeToLogin" class="button-text" type="primary" link>登录帐号</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const registerForm = ref({
  account: '',
  password: '',
  code: ''
})
const emailRegisterToggle = ref(true)
const emailGetCodeDisabled = ref(false)
const phoneGetCodeDisabled = ref(false)
const emailGetCodeLoading = ref(false)
const phoneGetCodeLoading = ref(false)
const accountPlaceholder = ref('邮箱')
const codePlaceholder = ref('邮箱验证码')
const registerTypeButtonText = ref('手机号注册')
const emailGetCodeCountDown = ref(0)
const phoneGetCodeCountDown = ref(0)
const error = ref(false)
const errorMessage = ref("")
let emailGetCodeTimer = null
let phoneGetCodeTimer = null
const router = useRouter()

const getCodeDesc = computed(() => {
  if (emailRegisterToggle.value) {
    return (emailGetCodeCountDown.value == 0) ? '获取验证码' : `${emailGetCodeCountDown.value}秒后重发`
  } else {
    return (phoneGetCodeCountDown.value == 0) ? '获取验证码' : `${phoneGetCodeCountDown.value}秒后重发`
  }
})

const getCodeDisabled = computed(() => {
  if (emailRegisterToggle.value && emailGetCodeDisabled.value) {
    return true
  } else if (!emailRegisterToggle.value && phoneGetCodeDisabled.value) {
    return true
  } else {
    return false
  }
})

const getCodeLoading = computed(() => {
  if (emailRegisterToggle.value && emailGetCodeLoading.value) {
    return true
  } else if (!emailRegisterToggle.value && phoneGetCodeLoading.value) {
    return true
  } else {
    return false
  }
})

function toggleChange() {
  emailRegisterToggle.value = !emailRegisterToggle.value
  error.value = false
  if (emailRegisterToggle.value == true) {
    accountPlaceholder.value = "邮箱"
    codePlaceholder.value = "邮箱验证码"
    registerTypeButtonText.value = "手机号注册"
  } else {
    accountPlaceholder.value = "手机号"
    codePlaceholder.value = "短信验证码"
    registerTypeButtonText.value = "邮箱注册"
  }
}

function getCode() {
  if (emailRegisterToggle.value) {
    // check
    if (!loginForm.value.account) {
      error.value = true
      errorMessage.value = "邮箱不能为空"
      return
    }
    if (!loginForm.value.password) {
      error.value = true
      errorMessage.value = "密码不能为空"
      return
    }

    // set status
    error.value = false
    emailGetCodeDisabled.value = true
    emailGetCodeLoading.value = true

    // get code

    // set text
    emailGetCodeLoading.value = false
    emailGetCodeCountDown.value = 60
    emailGetCodeTimer = setInterval(() => {
      emailGetCodeCountDown.value -= 1
      if (emailGetCodeCountDown.value <= 0) {
        clearInterval(emailGetCodeTimer)
        emailGetCodeTimer = null
        emailGetCodeDisabled.value = false
      }
    }, 1000)
  } else {
    // check
    if (!registerForm.value.account) {
      error.value = true
      errorMessage.value = "手机号不能为空"
      return
    }
    if (!registerForm.value.password) {
      error.value = true
      errorMessage.value = "密码不能为空"
      return
    }

    // set status
    error.value = false
    phoneGetCodeDisabled.value = true
    phoneGetCodeLoading.value = true

    // get code

    // set text
    phoneGetCodeLoading.value = false
    phoneGetCodeCountDown.value = 60
    phoneGetCodeTimer = setInterval(() => {
      phoneGetCodeCountDown.value -= 1
      if (phoneGetCodeCountDown.value <= 0) {
        clearInterval(phoneGetCodeTimer)
        phoneGetCodeTimer = null
        phoneGetCodeDisabled.value = false
      }
    }, 1000)
  }
}

function register() {
  if (emailRegisterToggle.value) {
    // check
    if (!registerForm.value.account) {
      error.value = true
      errorMessage.value = "邮箱不能为空"
      return
    }
    if (!registerForm.value.password) {
      error.value = true
      errorMessage.value = "密码不能为空"
      return
    }
    if (!registerForm.value.code) {
      error.value = true
      errorMessage.value = "验证码不能为空"
      return
    }
    
    // set status
    error.value = false

    // get code

    // commit

  } else {
    // check
    if (!registerForm.value.account) {
      error.value = true
      errorMessage.value = "手机号不能为空"
      return
    }
    if (!registerForm.value.password) {
      error.value = true
      errorMessage.value = "密码不能为空"
      return
    }
    if (!registerForm.value.code) {
      error.value = true
      errorMessage.value = "验证码不能为空"
      return
    }

    // set status
    error.value = false

    // get code

    // commit
  }
}

function routeToLogin() {
  router.push('/login')
}
</script>

<style lang="scss">
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .el-form {
    width: 260px;
    padding: 20px 40px 20px 40px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);

    .el-form-item {
      margin-top: 15px;
      margin-bottom: 15px;

      .button-register {
        font-size: 13px;
        width: 100%;
        height: 35px;
      }

      .button-get-code {
        font-size: 13px;
        width: 35%;
        height: 35px;
        margin-left: auto;
      }

      .button-text {
        font-size: 12px;
      }
    }

    .toggle-area {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    p {
      color: #000000cc;
      font-size: 20px;
      text-align: left;
      margin-bottom: 30px;
    }

    .el-alert {
      height: 35px;
      margin-top: -10px;

      :first-child {
        font-size: 13px;
      } 
    }

    .input {
      font-size: 13px;
      height: 35px;
    }
  }
}
</style>