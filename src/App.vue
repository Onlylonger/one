<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ArrowLeftBold, ArrowRightBold, RefreshRight, Right, Setting, InfoFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const { ipcRender, packageInfo } = window.electron;

const defaultUrl = 'https://www.jd.com/';
// const defaultUrl = 'https://www.baidu.com';
// const defaultUrl = 'https://www.electronjs.org/';
// const defaultUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe';

const userInput = ref(defaultUrl);
const input = ref(defaultUrl);
const tab = ref('New York');
const info = reactive({
  version: '',
  progress: 0,
  text: '',
});
onMounted(() => {
  ipcRender.receive('did-navigate-in-page', (data: any) => {
    userInput.value = data.url;
    input.value = data.url;
  });
  // 给主进程发通知，让主进程告诉我们当前应用的版本是多少
  ipcRender.send('checkAppVersion');
  // 接收主进程发来的通知，检测当前应用版本
  ipcRender.receive('version', (version: string) => {
    info.version = version;
  });
  // 给主进程发通知，检测当前应用是否需要更新
  ipcRender.send('checkForUpdate');
  // 接收主进程发来的通知，告诉用户当前应用是否需要更新
  ipcRender.receive('message', (text: string) => {
    info.text = text;
  });
  // 如果当前应用有新版本需要下载，则监听主进程发来的下载进度
  ipcRender.receive('downloadProgress', (data: Record<string, any>) => {
    const progress = parseInt(data.percent, 10);
    info.progress = progress;
  });
});

const dropMenuMap = {
  about: {
    label: '关于',
    Icon: InfoFilled,
    handle() {
      ipcRender.send('back');
      ElMessageBox.alert(`当前版本信息： ${packageInfo.version}`, '关于', {
        showClose: false,
        confirmButtonText: '关闭',
      });
    },
  },
};

type IDropMenuMap = typeof dropMenuMap;
type DropMenuMapKey = keyof IDropMenuMap;

const aryList = Object.keys(dropMenuMap).map((v) => ({
  ...dropMenuMap[v as DropMenuMapKey],
  key: v,
}));

const handleCommand = (command: DropMenuMapKey) => {
  const item = dropMenuMap[command];
  if (item && item.handle) {
    item.handle();
  }
};

const handleGo = () => {
  try {
    new URL(userInput.value);
    input.value = userInput.value;
    // ipcRender.send('update-url', { url: userInput.value });
  } catch (error: any) {
    ElMessage.error('请输入正确的链接地址');
  }
};
</script>

<template>
  <el-container>
    <el-header class="header">
      <el-row :gutter="10" align="middle">
        <el-col :span="1">
          <ArrowLeftBold class="icon" />
        </el-col>
        <el-col :span="1">
          <ArrowRightBold class="icon" />
        </el-col>
        <el-col :span="1">
          <RefreshRight class="icon" />
        </el-col>
        <el-col :span="19">
          <div class="input-wrap">
            <el-input v-model="userInput" placeholder="请输入网址" spellcheck="false" @keyup.enter="handleGo" />
          </div>
        </el-col>
        <el-col :span="1">
          <Right class="icon" @click="handleGo" />
        </el-col>
        <el-col :span="1">
          <el-dropdown @command="handleCommand" trigger="click">
            <Setting class="icon" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="menu in aryList" :key="menu.key" :command="menu.key">
                  <el-icon v-if="menu.Icon"><component :is="menu.Icon" /></el-icon>
                  {{ menu.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-radio-group v-model="tab">
      <el-radio-button label="New York" />
      <el-radio-button label="Washington" />
      <el-radio-button label="Los Angeles" />
      <el-radio-button label="Chicago" />
    </el-radio-group>

    <el-divider />
    <div>
      <iframe :src="input" class="iframe" />
      <!-- hello world wangshilong
      <p>{{ info.text }}</p>
      <p v-if="info.progress">下载进度：{{ info.progress }}%</p> -->
    </div>
  </el-container>
  <!--  -->
</template>

<style scoped>
.header {
  padding-top: 10px;
}
.input-wrap {
  display: flex;
  align-items: center;
  height: 100%;
}
.icon {
  padding: 8px;
  width: 20px;
  height: 20px;
  border: 1px solid transparent;
}
.icon:hover {
  cursor: pointer;
  color: var(--el-color-primary);
  border: 1px solid var(--el-color-primary);
}
.iframe {
  width: 100%;
  height: calc(100vh - 180px);
}
</style>
