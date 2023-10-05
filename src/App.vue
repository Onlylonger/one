<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { ArrowLeftBold, ArrowRightBold, RefreshRight, Right, Setting, InfoFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { type WebviewTag } from 'electron/renderer';

import { tabsList } from './constant';

import jsString from './webViewPreloads/test.js?raw';

const { ipcRender, packageInfo, IPC_CHANNEL, webviewPreload } = window.electron;

const defaultUrl = tabsList[0].url;
// const defaultUrl = 'https://www.jd.com/';
// const defaultUrl = 'https://www.baidu.com';
// const defaultUrl = 'https://www.electronjs.org/';
// const defaultUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe';

const userInput = ref(defaultUrl);
const loading = ref(false);
const input = ref(defaultUrl);
const tab = ref(tabsList[0].key);
// const info = reactive({
//   version: '',
//   progress: 0,
//   text: '',
// });
const webviewRef = ref<WebviewTag | null>(null);
const navigateInfo = reactive({
  canBack: false,
  canGoForWard: false,
});

watch(userInput, () => {
  if (webviewRef.value?.canGoBack) {
    navigateInfo.canBack = webviewRef.value?.canGoBack();
  }
  if (webviewRef.value?.canGoForward) {
    navigateInfo.canGoForWard = webviewRef.value?.canGoForward();
  }
  console.log(navigateInfo.canBack, navigateInfo.canGoForWard);
});

onMounted(() => {
  // ipcRender.receive('did-navigate-in-page', (data: any) => {
  //   userInput.value = data.url;
  //   input.value = data.url;
  // });
  // // 给主进程发通知，让主进程告诉我们当前应用的版本是多少
  // ipcRender.send('checkAppVersion');
  // // 接收主进程发来的通知，检测当前应用版本
  // ipcRender.receive('version', (version: string) => {
  //   info.version = version;
  // });
  // // 给主进程发通知，检测当前应用是否需要更新
  // ipcRender.send('checkForUpdate');
  // // 接收主进程发来的通知，告诉用户当前应用是否需要更新
  // ipcRender.receive('message', (text: string) => {
  //   info.text = text;
  // });
  // // 如果当前应用有新版本需要下载，则监听主进程发来的下载进度
  // ipcRender.receive('downloadProgress', (data: Record<string, any>) => {
  //   const progress = parseInt(data.percent, 10);
  //   info.progress = progress;
  // });
  ipcRender.receive(IPC_CHANNEL.OpenWindow, (data: Record<string, any>) => {
    input.value = data.url;
    userInput.value = data.url;
  });
  ipcRender.receive(IPC_CHANNEL.GetPageNetWorkResponseBody, (data: Record<string, any>) => {
    console.log(data);
    // input.value = data.url;
    // userInput.value = data.url;
  });
  webviewRef.value?.addEventListener('did-start-loading', () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 10000);
  });
  webviewRef.value?.addEventListener('did-stop-loading', () => {
    loading.value = false;
  });
  webviewRef.value?.addEventListener('did-navigate', (event) => {
    const { url } = event;
    userInput.value = url;
  });
  webviewRef.value?.addEventListener('did-navigate-in-page', (event) => {
    const { url } = event;
    userInput.value = url;
  });
  webviewRef.value?.addEventListener('ipc-message', (event) => {
    console.log(event.channel);
  });
  webviewRef.value?.addEventListener('dom-ready', () => {
    // if (!webviewRef.value?.isDevToolsOpened()) {
    //   webviewRef.value?.openDevTools();
    // }
    ipcRender.send(IPC_CHANNEL.SendWebViewContentId, {
      id: webviewRef.value?.getWebContentsId(),
      url: input.value,
    });
  });
});

const dropMenuMap = {
  about: {
    label: '关于',
    Icon: InfoFilled,
    handle() {
      ElMessageBox.alert(`当前版本信息： ${packageInfo.version} - ${webviewPreload}`, '关于', {
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
  } catch (error: any) {
    ElMessage.error('请输入正确的链接地址');
  }
};

const handleBack = () => {
  webviewRef.value?.goBack();
};

const handleForward = () => {
  webviewRef.value?.goForward();
};

const handleRefreshWebView = () => {
  webviewRef.value?.reload();
};

const handleGather = () => {
  // webviewRef.value?.executeJavaScript(jsString);
  // const document = webviewRef.value?.querySelector('document');
  // webview.getRootNode()
  console.log(jsString);
  // webviewRef.value?.executeJavaScript(jsString);
  // import('./webViewPreloads/zhengfuyun/index?raw').then((res) => {
  //   console.log(res.default);
  //   webviewRef.value?.executeJavaScript(res.default);
  // });
};
</script>

<template>
  <el-container>
    <el-header class="header">
      <el-row :gutter="10" align="middle">
        <el-col :span="1">
          <ArrowLeftBold class="icon" @click="handleBack" />
          <!-- <ArrowLeftBold v-show="navigateInfo.canBack" class="icon" @click="handleBack" />
          <ArrowLeftBold v-show="!navigateInfo.canBack" class="icon disabled" /> -->
        </el-col>
        <el-col :span="1">
          <ArrowRightBold class="icon" @click="handleForward" />
          <!-- <ArrowRightBold v-show="navigateInfo.canGoForWard" class="icon" @click="handleForward" />
          <ArrowRightBold v-show="!navigateInfo.canGoForWard" class="icon disabled" /> -->
        </el-col>
        <el-col :span="1">
          <RefreshRight class="icon" @click="handleRefreshWebView" />
        </el-col>
        <el-col :span="19">
          <div class="input-wrap">
            <el-input v-model="userInput" placeholder="请输入网址" spellcheck="false" @keyup.enter="handleGo" disabled />
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
    <el-radio-group class="radio-group" v-model="tab">
      <el-space wrap>
        <el-radio-button v-for="item in tabsList" :key="item.key" :label="item.label" />
      </el-space>
    </el-radio-group>

    <el-divider />
    <el-container>
      <el-aside width="80%">
        <div v-loading="loading">
          <!-- <webview :src="input" class="iframe" ref="webviewRef" id="webview" allowpopups="true" /> -->
          <webview :src="input" class="iframe" ref="webviewRef" id="webview" allowpopups="true" :preload="`${webviewPreload}`" /></div
      ></el-aside>
      <el-main>
        <h2>当前页面信息</h2>
        {{ webviewPreload }}
        <h3>商品类目: {{}} <el-link type="primary">采集当前页面类目</el-link></h3>
        <h3>商品ID: {{}}<el-link type="primary">采集当前页面商品id</el-link></h3>

        <el-button @click="handleGather">采集信息</el-button>
      </el-main>
    </el-container>
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
.icon.disabled {
  cursor: not-allowed;
  color: var(--el-disabled-text-color);
}
.icon:not(.disabled):hover {
  cursor: pointer;
  color: var(--el-color-primary);
  border: 1px solid var(--el-color-primary);
}
.iframe {
  width: 100%;
  height: calc(100vh - 180px);
}

.radio-group {
  padding: 0 20px;
}
</style>
