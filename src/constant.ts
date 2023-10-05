import { reactive } from 'vue';

enum Site {
  ZhengFuYunPortal = 'ZhengFuYunPortal',
  ZhengFuYunAdmin = 'ZhengFuYunAdmin',
  JiangXi = 'JiangXi',
}

const tabsMap = {
  [Site.ZhengFuYunPortal]: {
    label: '政采云官网',
    url: 'https://www.zcygov.cn/',
    // detailUrl: `${this[Site.ZhengFuYunPortal].url}items/`,
  },
  [Site.ZhengFuYunAdmin]: {
    label: '政采云后台',
    url: 'https://www.zcygov.cn/goods-center/goods/list',
  },
  [Site.JiangXi]: {
    label: '江西后台',
    url: 'https://www.jxemall.com/goods-center/goods/list',
  },
};

type ITabsMap = typeof tabsMap;
type TabsKey = keyof ITabsMap;

export const tabsList = Object.keys(tabsMap).map((v) => ({
  ...tabsMap[v as TabsKey],
  key: v,
}));
