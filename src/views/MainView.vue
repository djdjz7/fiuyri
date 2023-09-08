<script setup lang="ts">
import { useUserInfoStore } from "@/stores/userInfo";
import axios, { type AxiosRequestConfig } from "axios";
import { ref } from "vue";
import { AesDecrypt } from "@/scripts/aes";
import type {
  CommonResponse,
  GetAllNotesResponse,
  NoteCommonResponse,
  NoteInfo,
StorageCredential,
} from "@/scripts/models";
import ReplaceDialog from "@/components/ReplaceDialog.vue";
import router from "@/router"

const dialogRef = ref();
var noteList = new Array<NoteInfo>();
const userToken = useUserInfoStore().token;
if(userToken.trim() == '')
router.push({
  path: '/login',
});

var config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer ".concat(userToken),
  },
  baseURL: "http://sxz.api6.zykj.org/",
};

const getOssCredentialResponse = await axios.get(
  "api/services/app/OssHelper/GetStorageCredentialAsync?id=0",
  config
);
const getOssCredentialResponseData =
  getOssCredentialResponse.data as CommonResponse;
if (!getOssCredentialResponseData.success) {
  alert(
    getOssCredentialResponseData.error.details +
      "\n" +
      getOssCredentialResponseData.error.message
  );
} else {

  const ossCredential = getOssCredentialResponseData.result as StorageCredential;
  const userInfo = useUserInfoStore();
  userInfo.accessKeyId = ossCredential.accessKeyId;
  userInfo.accessKeySecret = ossCredential.accessKeySecret;
  userInfo.securityToken = ossCredential.securityToken;

  const getAllResponse = await axios.get("CloudNotes/api/Notes/GetAll", config);
  const getAllResponseData = getAllResponse.data as NoteCommonResponse;
  const getAllData = getAllResponseData.data;

  noteList = (
    JSON.parse(AesDecrypt(getAllData)) as GetAllNotesResponse
  ).noteList
    .filter((x) => {
      return x.type == 6;
    })
    .sort((a, b): number => {
      var aTime = new Date(a.updateTime).getTime();
      var bTime = new Date(b.updateTime).getTime();
      return -aTime + bTime;
    });
}

async function openDialog(note: NoteInfo) {
  dialogRef.value.openDialog(note);
}
</script>

<template>
  <div m-6 md:m-12 h-full flex="~ col items-center">
    <table>
      <tr v-for="note in noteList">
        <td text-lg>{{ note.fileName }}</td>
        <td text-sm text-gray>{{ note.updateTime }}</td>
        <td>
          <button
            flex="~ items-center justify-center"
            p-1
            rounded-full
            h-8
            w-8
            border-none
            @click="openDialog(note)"
          >
            <span class="material-symbols-rounded"> chevron_right </span>
          </button>
        </td>
      </tr>
    </table>
  </div>
  <ReplaceDialog ref="dialogRef" />
</template>
