<script setup lang="ts">
import { useUserInfoStore } from "@/stores/userInfo";
import axios, { type AxiosRequestConfig } from "axios";
import { ref, onMounted, Transition } from "vue";
import { AesDecrypt } from "@/scripts/aes";
import type {
  CommonResponse,
  GetAllNotesResponse,
  NoteCommonResponse,
  NoteInfo,
  StorageCredential,
} from "@/scripts/models";
import ReplaceDialog from "@/components/ReplaceDialog.vue";
import router from "@/router";
import Loading from "@/components/Loading.vue";

const isLoading = ref(true);
const currentFolder = ref("0");
const currentParent = ref("0");

const dialogRef = ref();
const showFolders = ref(false);
let noteList = new Array<NoteInfo>();
const displayedNoteList = ref(new Array<NoteInfo>());
const userToken = useUserInfoStore().token;
if (userToken.trim() == "")
  router.push({
    path: "/login",
  });

onMounted(async () => {
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
    const ossCredential =
      getOssCredentialResponseData.result as StorageCredential;
    const userInfo = useUserInfoStore();
    userInfo.accessKeyId = ossCredential.accessKeyId;
    userInfo.accessKeySecret = ossCredential.accessKeySecret;
    userInfo.securityToken = ossCredential.securityToken;

    const getAllResponse = await axios.get(
      "CloudNotes/api/Notes/GetAll",
      config
    );
    const getAllResponseData = getAllResponse.data as NoteCommonResponse;
    const getAllData = getAllResponseData.data;

    noteList = (
      JSON.parse(AesDecrypt(getAllData)) as GetAllNotesResponse
    ).noteList
      .filter((x) => {
        return x.type == 6 || x.type == 0;
      })
      .sort((a, b): number => {
        var aTime = new Date(a.updateTime).getTime();
        var bTime = new Date(b.updateTime).getTime();
        return -aTime + bTime;
      })
      .sort((a, b): number => {
        return a.type - b.type;
      });

    let tempList = new Array<NoteInfo>();
    noteList.forEach((currentValue) => {
      if (currentValue.type == 6) {
        tempList.push(currentValue);
      }
    });

    displayedNoteList.value = tempList;
  }

  isLoading.value = false;
});

function onNoteClicked(note: NoteInfo) {
  if (note.type == 6) {
    dialogRef.value.openDialog(note);
    return;
  }
  if (note.type == -1) {
    if (currentParent.value == "0") {
      currentFolder.value = "0";
      refreshFolders();
      return;
    }
    for (let i = 0; i < noteList.length; i++) {
      if (noteList[i].fileId == currentParent.value) {
        currentParent.value = noteList[i].parentId;
        currentFolder.value = noteList[i].fileId;
        refreshFolders();
        break;
      }
    }
    return;
  }
  currentParent.value = currentFolder.value;
  currentFolder.value = note.fileId;
  refreshFolders();
}

function showFoldersChanged() {
  if (!showFolders.value) {
    let tempList = new Array<NoteInfo>();

    noteList.forEach((currentValue) => {
      if (currentValue.type == 6) {
        tempList.push(currentValue);
      }
    });
    displayedNoteList.value = tempList;
    return;
  }
  refreshFolders();
}

function refreshFolders() {
  let tempList = new Array<NoteInfo>();
  if (currentFolder.value != "0") {
    tempList.push({
      fileId: "",
      fileName: "...",
      fileUrl: "",
      parentId: "",
      version: 0,
      shared: false,
      type: -1,
      createTime: "",
      updateTime: "",
    });
  }
  noteList.forEach((currentValue) => {
    if (currentValue.parentId == currentFolder.value) {
      tempList.push(currentValue);
    }
  });
  displayedNoteList.value = tempList;
}
</script>

<template>
  <div
    fixed
    bottom-0
    left-0
    w-full
    z-1
    flex="~ items-center justify-center"
  >
    <div shadow-lg backdrop-blur-lg p-4 m-b-4 rounded-full class="bg-light/30 dark:bg-dark/50">
      <button
        h-12
        w-12
        flex="~ items-center justify-center"
        rounded-full
        :class="[showFolders ? 'toggleButtonToggled' : 'toggleButton']"
        @click="
          showFolders = !showFolders;
          showFoldersChanged();
        "
      >
        <span
          :class="[
            'material-symbols-rounded',
            { 'translate-x-0.4 translate-y-0.4': showFolders },
          ]"
        >
          folder_open
        </span>
      </button>
    </div>
  </div>
  <div m-6 md:m-12 m-b-26 flex="~ justify-center">
    <table m-0 w-full max-w-md>
      <thead>
        <tr shadow-md>
          <th dark:bg-dark></th>
          <th dark:bg-dark>File</th>
          <th dark:bg-dark></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="note in displayedNoteList" @click="onNoteClicked(note)">
          <td text-xl>
            <span
              v-if="note.type == 0 || note.type == -1"
              flex="!~ justify-center items-center"
              class="material-symbols-rounded"
              >folder</span
            >
            <span
              v-if="note.type == 6"
              flex="!~ justify-center items-center"
              class="material-symbols-rounded"
              >description</span
            >
          </td>
          <td>
            <div>
              <span block text-lg text-truncate>{{ note.fileName }}</span>
              <span block text="sm gray">{{ note.updateTime }}</span>
            </div>
          </td>
          <td>
            <button
              flex="~ items-center justify-center"
              p-1
              rounded-full
              h-8
              w-8
              border-none
              dark:bg-dark
              v-if="note.type != -1"
            >
              <span class="material-symbols-rounded" dark:text-light>
                chevron_right
              </span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ReplaceDialog ref="dialogRef" />
  <Loading v-if="isLoading" />
</template>
