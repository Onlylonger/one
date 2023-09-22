<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ArrowLeftBold, ArrowRightBold, RefreshRight, Right } from '@element-plus/icons-vue';
const { ipcRender } = window.electron;

const input = ref('');
const info = reactive({
  version: '',
  progress: 0,
  text: '',
});

onMounted(() => {
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
</script>

<template>
  <el-container>
    <el-header>
      <el-row :gutter="10">
        <el-col :span="1">
          <ArrowLeftBold class="icon" />
        </el-col>
        <el-col :span="1">
          <ArrowRightBold class="icon" />
        </el-col>
        <el-col :span="1">
          <RefreshRight class="icon" />
        </el-col>
        <el-col :span="20">
          <div class="input-wrap">
            <el-input v-model="input" placeholder="请输入网址" />
          </div>
        </el-col>
        <el-col :span="1">
          <Right class="icon" />
        </el-col>
      </el-row>
    </el-header>
    <div>
      hello world wangshilong
      <p>current app version: {{ info.version }}</p>
      <p>{{ info.text }}</p>
      <p v-if="info.progress">下载进度：{{ info.progress }}%</p>
    </div>
  </el-container>
  <!--  -->
</template>

<style scoped>
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
</style>
