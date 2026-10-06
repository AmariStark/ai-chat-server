# ai-chat-server — AI 问答应用服务端

Node.js + Koa 实现的服务端，为 [ai-chat-app](https://github.com/AmariStark/ai-chat-app) 提供注册、登录与 AI 对话接口。

## 功能

- 注册：用 bcrypt 生成随机盐并哈希存储密码，不保存明文
- 登录：用 bcrypt 比对校验密码，成功后返回用户信息
- AI 对话：服务端代理调用讯飞星火大模型开放平台，前端只负责发送用户输入与渲染结果，密钥不暴露给浏览器
- 跨域：通过 koa2-cors 处理前后端分离带来的跨域请求

## 技术栈

| 项目 | 说明 |
| --- | --- |
| 运行时 | Node.js |
| Web 框架 | Koa 3 + koa-router |
| 中间件 | koa-body（解析请求体）、koa2-cors（跨域） |
| 密码 | bcrypt |
| HTTP 客户端 | axios（调用大模型开放接口） |

## 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/` | 健康检查，回显 `page` 查询参数 |
| POST | `/register` | 注册，返回加密后的密码 |
| POST | `/login` | 登录，校验账号密码 |
| POST | `/axios` | 对话接口，代理调用讯飞星火大模型 |

请求示例：

```bash
curl -X POST http://127.0.0.1:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

## 运行方式

1. 安装依赖：

```bash
npm install
```

2. 配置密钥（`.env` 已被 .gitignore 忽略，不会提交到仓库）：

```bash
copy .env.example .env
# 编辑 .env，填入自己在讯飞开放平台申请的 SPARK_API_KEY
```

`.env` 内容示例：

```
SPARK_API_KEY=你的APIKey:你的APISecret
SPARK_API_URL=https://spark-api-open.xf-yun.com/v1/chat/completions
SPARK_MODEL=4.0Ultra
PORT=3000
```

3. 启动：

```bash
npm start      # 读取 .env 后启动
npm run dev    # 开发模式，nodemon 热重载
```

服务默认监听 `http://127.0.0.1:3000`。

## 安全说明

- 大模型密钥通过环境变量注入，代码与仓库中不含任何密钥
- 未配置密钥时，`/axios` 会直接返回明确提示，而不是带着空密钥去请求上游
- 上游调用失败会返回 `502` 与错误原因，方便前端提示

## 已知限制

- 用户数据目前只存在内存中，重启后注册信息会丢失，后续应接入 MySQL
- 对话接口每次只发送当前一轮内容，尚未接入多轮上下文与 RAG 知识库
