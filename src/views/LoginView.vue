<script setup lang="ts">
import { ref } from "vue";
import {
  type LoginRequest,
  type CommonResponse,
  type LoginResponse,
} from "@/scripts/models";
import axios, { type AxiosRequestConfig } from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import router from "@/router";

var account = ref("");
var password = ref("");

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
</script>

<template>
  <div flex="~ justify-center items-center col">
    <h1>Login</h1>
    <input v-model="account" m-t-2 placeholder="Account"/>
    <input type="password" v-model="password" placeholder="Password" m-t-2 />
    <button m-t-4 @click="login">Login</button>
  </div>
</template>
