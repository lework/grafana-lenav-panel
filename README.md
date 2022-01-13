# grafana-lenav-panel

站点导航面板

# 使用

## 安装

1. 下载插件包：https://github.com/lework/grafana-lenav-panel/releases/download/v1.0.0/lework-lenav-panel-v1.0.0.zip
2. 解压到 `data/plugins/` 目录下
3. 重启 grafana 。

或者使用命令行安装

```bash
grafana-cli plugins install lework-lenav-panel
```

## 配置

![lenav-screenshot-1.png](https://cdn.jsdelivr.net/gh/lework/grafana-lenav-panel@master/src/img/lenav-screenshot-1.png)

![lenav-screenshot-2.png](https://cdn.jsdelivr.net/gh/lework/grafana-lenav-panel@master/src/img/lenav-screenshot-2.png)

# Plugin 开发

## Getting started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

## Learn more

- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
