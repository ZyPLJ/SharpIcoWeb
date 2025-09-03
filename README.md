# 基于SharpIco开发图片转ICO工具网站

# SharpIcoWeb

[![License](https://camo.githubusercontent.com/bb4e5c0036a6a8cdbc59b38d44f09ad8f6dc722751dad34d3df5bf0ac61913c1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c7565)](https://camo.githubusercontent.com/bb4e5c0036a6a8cdbc59b38d44f09ad8f6dc722751dad34d3df5bf0ac61913c1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c7565)

![.NET](https://camo.githubusercontent.com/7732c145abc7fb05a8373d4d161318970723f355ddd1d080a3fbef3c6941cd0f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2e4e45542d392e302d707572706c65)

![Stars](https://img.shields.io/github/stars/ZyPLJ/SharpIcoWeb?color=gold&style=for-the-badge)

## 📝项目介绍

[SharpIcoWeb](https://github.com/ZyPLJ/SharpIcoWeb)是基于[SharpIco](https://github.com/star-plan/sharp-ico)开发的图片转ICO工具网站，支持上传png、jpg等图片转换为多尺寸的Ico图片文件。采用前后端分离技术。

后端接口使用 `.NET Minimal API`开发，够轻量。

## 📍项目地址

`https://github.com/ZyPLJ/SharpIcoWeb`

## 🎯 应用场景

* 网站Favicon 🌐
* 软件图标 🖥️
* 个性化文件夹标识 📂

```html
<link rel="icon" type="image/x-icon" href="/logo.ico" />
```

## ✨核心技术

| **⚡** **Vite+Vue+Element-Plus** **极速的开发服务器和高效的生产构建** |    **🗂️ → ❌** **纯文件操作（无需SQLite/MySQL）**    |
| :-------------------------------------------------------------------------------------: | :-----------------------------------------------------------------: |
|            **🏗️.NET 9 MiniAPI 轻量级API开发，处理图像转换业务逻辑**            | **🖼️** **后端使用的强大图像处理库，实现PNG/JPG转ICO** |
|                     **🐳** **可容器化（Docker 支持）**                     |        **📱 + 💻** **响应式设计（适配移动端）**        |

## ✅后续更新

* [X] 不同尺寸ICO,可分别生成ICO文件。
* [X] 前端显示ICO文件图标数量数据、大小、偏移等数据。
* [ ] 批量转换功能。

## 🚀快速开始

### Docker部署

<font color='red'>注意注释部分配置可能需要根据实际情况修改</font>

#### Docker CLI

```dockerfile
docker-compose up --build -d
```

#### default.conf

```dsconfig
server {
    listen       5173; # 配置端口
    server_name  0.0.0.0; # 修改为docker服务宿主机的ip 
  
    # 设置允许的最大请求体大小（例如 100MB）
    client_max_body_size 100M;
 
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }
  
    location /api {
        proxy_pass http://backend:5235;  # Docker 内部网络
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
 
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./sharp-ico-vue   # 指向前端目录
      dockerfile: Dockerfile
    ports:
      - "5173:5173"               # 前端映射到宿主机的5173端口
    depends_on:
      - backend

  backend:
    build:
      context: .    # 指向后端目录
      dockerfile: Dockerfile
    ports:
      - "5235:5235"            # 后端端口
```

### 手动部署

#### clone

`git clone https://github.com/ZyPLJ/SharpIcoWeb.git`

#### 后端运行

```
cd SharpIcoWeb

dotnet build -c Release

dotnet run
```

#### 前端运行

```bash
cd ..

cd sharp-ico-vue

npm install

npm run dev
```

## 👀如何使用

前后端项目运行或部署后，打开运行后网址。

选择需要生成的ICO图表尺寸，可多选

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-06/82586b88-2c72-47db-8c42-4b90d7b43235.png)

上传图片文件，点击转换。

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-06/77b11313-ff66-4d3f-924d-f31c0c16b349.png)

### 1.1.0 版本

该版本更新了分别生成功能，将图片转为不同尺寸的单ico文件。

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-07/2756baed-a0e4-4e17-8e57-9b770def0469.png)

### 1.2.0 版本

该版本更新了前端显示ICO文件图标数量数据、大小、偏移等数据功能。

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-07/a2e8c67d-c95a-44f2-ad32-2259275c91db.png)

### 1.5.0 版本

该版本新增多语言国际化支持，支持中文、英文、日文界面切换，提升用户体验。

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-09/Snipaste_2025-09-03_10-53-51.png)

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-09/Snipaste_2025-09-03_10-54-18.png)


## 🛠 开发指南

### 项目结构

```
sharp-ico/
├── SharpIco/               # 图标转换类库
    ├── IcoEndpoints.cs     # 端点类
│   ├── SharpIco.csproj
├── SharpIcoWeb/            # 后端Api项目
│   ├── SharpIcoWeb.csproj
├── sharp-ico-vue           # 前端项目
```

### 开发环境

* .Net 9
* Node.js 20.19+
* Vue3

### 运行项目

#### 后端

```bash
dotnet build -c Release

dotnet run
```

#### 前端

```bash
npm install

npm run dev
```

## 常见问题

### 部署后前端容器不启动

`unknown directive "﻿server" in /etc/nginx/conf.d/default.conf:1`

查看前端目录下 `default.conf`文件开头是否存在特殊符号或者空格：

![image.png](https://raw.githubusercontent.com/ZyPLJ/note-gen-image-sync/main/2025-07/45f8b1fc-7270-4d03-9e0a-e0f9ffac5152.png)

## 相关链接

* [SharpIco](https://github.com/star-plan/sharp-ico "SharpIco是一个纯 C# AOT 实现的轻量级图标生成工具") 🌟 Star if useful!

- [SharpIcoWeb](https://github.com/ZyPLJ/SharpIcoWeb)  🌟 Star if useful!