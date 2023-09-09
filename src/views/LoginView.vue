<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  type LoginRequest,
  type CommonResponse,
  type LoginResponse,
} from "@/scripts/models";
import axios, { type AxiosRequestConfig } from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import router from "@/router";
import Popup from "@/components/Popup.vue";

const account = ref("");
const password = ref("");

const protocolRef = ref();
const whyRef = ref();

onMounted(() => {
  if (document.location.protocol.toLowerCase() == "https:") {
    protocolRef.value.show();
  }
});

async function login() {
  if (account.value == "") {
    alert("Account could not be empty.");
    return;
  }
  if (password.value == "") {
    alert("Password could not be empty.");
    return;
  }

  var loginRequest: LoginRequest = {
    userName: account.value,
    password: password.value,
    clientType: 1,
  };

  var config: AxiosRequestConfig = {
    baseURL: "http://sxz.api6.zykj.org/",
    headers: {
      "Content-Type": "application/json",
    },
  };

  var loginResponse = await axios.post(
    "api/TokenAuth/Login",
    JSON.stringify(loginRequest),
    config
  );
  var loginData = loginResponse.data as CommonResponse;
  if (!loginData.success) {
    alert(loginData.error.details + "\n" + loginData.error.message);
    return;
  }
  var loginResult = loginData.result as LoginResponse;
  useUserInfoStore().token = loginResult.accessToken;

  router.push({
    path: "/",
  });
}

function goHttp() {
  document.location.protocol = "http:";
}
</script>

<template>
  <div
    absolute
    top-0
    bottom-0
    left-0
    right-0
    flex="~ justify-center items-center col"
  >
    <span text-lg>FIUYRI.</span>
    <div flex="~ justify-center items-center col">
      <h1>Login</h1>
      <input v-model="account" m-t-2 placeholder="Account" />
      <input type="password" v-model="password" placeholder="Password" m-t-2 />
      <button m-t-4 @click="login">Login</button>
      <a href="#" color-red no-underline m-t-2 @click="whyRef.show()">
        <div flex="~ items-center justify-center" text-sm>
          <span class="material-symbols-rounded"> info </span>
          <span m-l-1 >Why HTTP?</span>
        </div>
      </a>
    </div>
  </div>
  <Popup title="Protocol Error" ref="protocolRef" :can-close="false">
    <p>
      HTTPS is not currently supported by ZY's API, and mixed content is not
      allowed by modern browsers for security reasons.<br />
      Please use HTTP instead.
    </p>
    <button m-t-2 @click="goHttp()">Go HTTP</button>
  </Popup>
  <Popup title="Why HTTP?" ref="whyRef">
    <p>
      HTTPS is not currently supported by ZY's API, and mixed content is not
      allowed by modern browsers for security reasons.
    </p>
  </Popup>
</template>
