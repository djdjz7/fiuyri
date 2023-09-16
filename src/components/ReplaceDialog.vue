<script setup lang="ts">
import { ref, type HtmlHTMLAttributes } from "vue";
import axios from "axios";
import type { NoteInfo } from "@/scripts/models";
import OSS from "ali-oss";
import { useUserInfoStore } from "@/stores/userInfo";
import str2gbk from "str2gbk";
import Loading from "./Loading.vue";

const originalFileContent = ref("");
var originalFileBuffer: ArrayBuffer;
var newFileBuffer: ArrayBuffer;
const newFileContent = ref("");
const decoder = new TextDecoder("gbk");
const isShowing = ref(false);
const fileName = ref("");
const fileUrl = ref("");
const isLoading = ref(false);

async function readFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files == null || target.files?.length == 0) return;
  const file = target.files[0];
  newFileBuffer = await file.arrayBuffer();
  newFileContent.value = file.name.concat("\n", decoder.decode(newFileBuffer));
}

async function beginUpload() {
  isLoading.value = true;
  const userInfo = useUserInfoStore();
  const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: "oss-cn-hangzhou",
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: userInfo.accessKeyId,
    accessKeySecret: userInfo.accessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: userInfo.securityToken,
    // 填写Bucket名称。
    bucket: "friday-note",
  });

  await client.put(fileUrl.value, new Blob([str2gbk(newFileContent.value)]));
  alert("Download now.");
  await client.put(fileUrl.value, new Blob([originalFileBuffer]));
  alert("Restored.");
  isLoading.value = false;
  isShowing.value = false;
}

const openDialog = async (note: NoteInfo) => {
  isLoading.value = true;
  const downloadedContent = await axios.get(note.fileUrl as string, {
    baseURL: "https://friday-note.oss-cn-hangzhou.aliyuncs.com/",
    responseType: "arraybuffer",
  });
  fileName.value = note.fileName;
  fileUrl.value = note.fileUrl;
  isShowing.value = true;
  originalFileBuffer = downloadedContent.data;
  originalFileContent.value = decoder.decode(originalFileBuffer);
  newFileContent.value = "";
  isLoading.value = false;
};

defineExpose({ openDialog });
</script>

<template>
  <Transition>
    <div
      v-if="isShowing"
      md:backdrop-blur-lg
      fixed
      top-0
      left-0
      right-0
      bottom-0
      md:flex="~ col items-center justify-center"
      overflow-y-scroll
      overflow-x-clip
    >
      <div
        bg-light
        md:rounded-4
        absolute
        top-0
        bottom-0
        left-0
        right-0
        md:relative
        p-6
        md:p-12
        md:shadow-lg
        md:w-192
      >
        <h1>Replace</h1>
        <button
          flex="~ justify-center items-center"
          h-10
          w-10
          rounded-full
          border-none
          absolute
          top-6
          right-6
          md:top-12
          md:right-12
          @click="isShowing = false"
        >
          <span class="material-symbols-rounded"> close </span>
        </button>
        <h2 block truncate>{{ fileName }}</h2>
        <span block text-gray truncate>{{ fileUrl }}</span>

        <h3 m-t-2>Original file content</h3>
        <div
          v-if="originalFileContent.trim() != ''"
          h-40
          overflow-y-scroll
          m-t-1
          shadow-md
          rounded-1
          border="gray/40 1 solid"
        >
          <span block m-2 break-words whitespace-pre-wrap>{{
            originalFileContent
          }}</span>
        </div>
        <div v-else m-t-1>
          <span>Empty</span>
        </div>

        <input
          m-t-2
          block
          type="file"
          accept=".txt"
          @change="readFile($event)"
        />

        <h3 m-t-1>New file content</h3>
        <div
          v-if="newFileContent.trim() != ''"
          h-40
          overflow-y-scroll
          m-t-1
          shadow-md
          rounded-1
          border="gray/40 1 solid"
        >
          <span block m-2 break-words whitespace-pre-wrap>{{
            newFileContent
          }}</span
          >>
        </div>
        <div v-else m-t-1>
          <span>Empty</span>
        </div>
        <button v-if="newFileContent.trim() != ''" m-t-2 @click="beginUpload()">
          Start
        </button>
      </div>
    </div>
  </Transition>
  <Transition>
    <Loading v-if="isLoading" />
  </Transition>
</template>