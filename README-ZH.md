<div align="center">

<h1>GroundBench — Web</h1>

固定顶点预算多边形定位基准的项目主页
</br>
<em>The project site for an exact-N polygon grounding benchmark</em>

[![Site](https://img.shields.io/badge/site-social--ai--2026.github.io-1baf7a?style=flat-square)](https://social-ai-2026.github.io/Groundbench-web/)
[![Build](https://img.shields.io/badge/build-%E6%97%A0%20%C2%B7%20%E7%BA%AF%E9%9D%99%E6%80%81-e87ba4?style=flat-square)](#站点一览)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com/)
[![Bilingual](https://img.shields.io/badge/i18n-EN%20%C2%B7%20%E4%B8%AD%E6%96%87-2563EB?style=flat-square)](#站点一览)

[![Code](https://img.shields.io/badge/Project-Groundbench--codebase-1baf7a?style=flat-square&logo=github&logoColor=white)](https://github.com/Social-AI-2026/Groundbench-codebase)
[![Dataset](https://img.shields.io/badge/Project-%F0%9F%A4%97%20GroundBench-FFD21E?style=flat-square)](https://huggingface.co/datasets/Social-AI-2026/Groundbench)

[English](./README.md) | [中文文档](./README-ZH.md)

</div>

## ⚡ 项目概述

**GroundBench** 要求视觉语言系统把指代表达描述的目标**画成一个多边形**，且顶点数是给定的。给定图像、指代表达和顶点数 N，模型必须返回恰好 N 个有序顶点，也就是 2N 个数值。同一批 1,500 个项目会在五个顶点预算下各问一遍，图像、短语和指代对象保持不变，变的只有作答面。

本仓库**只是项目主页**。评测代码在 [Groundbench-codebase](https://github.com/Social-AI-2026/Groundbench-codebase)，题目与参考答案作为冻结发布在 [`Social-AI-2026/Groundbench`](https://huggingface.co/datasets/Social-AI-2026/Groundbench)。

> **范围：**本仓库只承载展示层——页面结构、样式，以及页面用到的图。</br>
> 它不跑任何评测、不含任何基准数据，**也不是**页面上任何一个数字的权威来源。

### 站点一览

| 项目 | 取值 |
|------|------|
| **技术栈** | 原生 HTML / CSS / JavaScript |
| **构建步骤** | 无 —— 提交什么就服务什么 |
| **依赖** | 零；运行时不拉取任何东西 |
| **托管** | GitHub Pages，从 `main` 发布，带 `.nojekyll` |
| **语言** | 英文与中文，在页面内切换 |
| **数字来源** | 代码发布包里的冻结协议，绝不手填 |

## 🔄 一次改动怎么走到线上

1. **修改** —— 改本仓库的结构、样式或某张图
2. **预览** —— 本地起静态服务，两种语言都看一遍
3. **提交** —— 推到 `main`
4. **发布** —— GitHub Pages 服务新提交；`.nojekyll` 保证文件不被 Jekyll 处理
5. **核对** —— 刷新线上地址，确认页面和两个语言状态都渲染正常

## 📦 页面上有什么

| 板块 | 作用 |
|------|------|
| 任务 | exact-N 多边形作答是什么，以及四个数的框为什么表达不了它 |
| 榜单 | 前沿托管配置在同一套冻结协议下的成绩 |
| 顶点预算 | 结果如何随五个预算变化，且在同一批项目上配对比较 |
| Cohort | 1,500 道题由什么构成 —— 来源族、语义组、干扰对象、轮廓复杂度、相对大小 |
| 资源 | 指向代码发布、数据卡与引用 |

## 🚀 快速开始

### 一、本地预览（推荐）

#### 前置要求

| 工具 | 版本 | 用途 | 检查命令 |
|------|------|------|----------|
| **Python** | 3.x | 仅用于起一个静态文件服务 | `python3 --version` |
| **git** | 任意 | 克隆与发布 | `git --version` |
| **浏览器** | 任意 | 除此之外什么都不需要 | —— |

#### 1. 克隆仓库

```bash
git clone https://github.com/Social-AI-2026/Groundbench-web.git
cd Groundbench-web
```

#### 2. 起服务

```bash
python3 -m http.server 8000
# 然后打开 http://localhost:8000
```

任何静态服务器都行，没有要装的东西，也没有要编译的东西。

> 提交前**两种语言都要看**。只在一种语言里加了字符串、另一种漏掉，是这种布局最容易出的错，而且不切换就发现不了。

### 二、发布到 GitHub Pages

#### 1. 推到 `main`

```bash
git add -A
git commit -m "Update the site"
git push origin main
```

#### 2. 确认部署

Pages 从 `main` 构建并服务仓库根目录。`.nojekyll` 已提交，因此以 `_` 开头的文件不会被丢弃，也不会有任何东西经过 Jekyll。

> 部署后常常需要强制刷新 —— 浏览器对 `styles.css` 和脚本的缓存很激进。

## 📤 数字从哪来

页面上每一个分数都由[代码发布包](https://github.com/Social-AI-2026/Groundbench-codebase)里的冻结评测协议产出。题目与参考答案是[数据仓](https://huggingface.co/datasets/Social-AI-2026/Groundbench)上发布的冻结材料，而数据仓本身**不含任何模型输出、也不含任何分数**——它是卷子和标准答案，不是谁的成绩单。

> 分数只有在那套冻结协议下才可比。prompt、图像处理、坐标映射和多边形后端，任何一项不同都会改变一个数字的含义。页面不得把来自另一条流水线的数字当成同一回事来展示。

## 🗂️ 目录结构

```text
index.html      页面结构与两种语言的文案
styles.css      样式
app.js          渲染与页内导航
i18n.js         语言切换与 EN / 中文 字符串表
figures/        从论文导出的图
.nojekyll       告诉 GitHub Pages 原样服务这些文件
```

## 🔬 范围与局限

- 本站是展示层，它自身不复现任何结果，也不验证任何结论。
- 图是导出的产物。底层分析变了就必须重新导出——页面无法察觉自己已经过期。
- 页面是静态的：没有服务端、没有统计、运行时不拉数据。
- 这里复现的任何数字，新鲜程度只等于最后一次改动它的提交。

## 📬 参与贡献

欢迎提 issue 和聚焦的 pull request。改动请限制在展示层，两种语言一起更新，且不要提交凭据或私有运行制品。

## 📄 引用与许可

基准的引用元数据在代码发布包里（[CITATION.cff](https://github.com/Social-AI-2026/Groundbench-codebase/blob/main/CITATION.cff)）。关联稿件仍在匿名评审期，因此本文档不虚构 DOI 或公开论文链接。

本仓库的许可**尚未确定**。代码发布采用非商业的 [GroundBench Peer-Review Research License](https://github.com/Social-AI-2026/Groundbench-codebase/blob/main/LICENSE)；COCO、RefCOCO 系列材料以及任何图的来源，仍适用各自条款。
