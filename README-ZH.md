<div align="center">

<h1>GroundBench — Web</h1>

固定顶点预算多边形定位基准的项目主页
</br>
<em>The project site for an exact-N polygon grounding benchmark</em>

[![Site](https://img.shields.io/badge/site-social--ai--2026.github.io-1baf7a?style=flat-square)](https://social-ai-2026.github.io/Groundbench-web/)
[![Build](https://img.shields.io/badge/build-%E6%97%A0%20%C2%B7%20%E7%BA%AF%E9%9D%99%E6%80%81-e87ba4?style=flat-square)](#站点一览)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com/)
[![Bilingual](https://img.shields.io/badge/i18n-EN%20%C2%B7%20%E4%B8%AD%E6%96%87-2563EB?style=flat-square)](#站点一览)
[![Licence](https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square)](LICENSE)

[![Code](https://img.shields.io/badge/Project-Groundbench--codebase-1baf7a?style=flat-square&logo=github&logoColor=white)](https://github.com/Social-AI-2026/Groundbench-codebase)
[![Dataset](https://img.shields.io/badge/Project-%F0%9F%A4%97%20GroundBench-FFD21E?style=flat-square)](https://huggingface.co/datasets/Social-AI-2026/GroundBench)

[English](./README.md) | [中文文档](./README-ZH.md)

</div>

## ⚡ 项目概述

**GroundBench** 要求视觉语言系统把指代表达描述的目标**画成一个多边形**，且顶点数是给定的。给定图像、指代表达和顶点数 N，模型必须返回恰好 N 个有序顶点，也就是 2N 个数值。同一批 1,500 个项目会在五个顶点预算下各问一遍，图像、短语和指代对象保持不变，变的只有作答面。

本仓库**只是项目主页**。评测代码在 [Groundbench-codebase](https://github.com/Social-AI-2026/Groundbench-codebase)，题目与参考答案作为冻结发布在 [`Social-AI-2026/GroundBench`](https://huggingface.co/datasets/Social-AI-2026/GroundBench)。

> **范围：**本仓库只承载展示层——页面结构、样式，以及页面用到的图。</br>
> 它不跑任何评测、不含任何基准数据，**也不是**页面上任何一个数字的权威来源。

### 站点一览

| 项目 | 取值 |
|------|------|
| **技术栈** | 原生 HTML / CSS / JavaScript |
| **构建步骤** | 无 —— 提交什么就服务什么 |
| **依赖** | 零；运行时不拉取任何东西 |
| **托管** | GitHub Pages，从 `main` 发布，带 `.nojekyll` |
| **语言** | 英文写在标签里，中文在 `i18n.js`，由导航栏切换 |
| **数字来源** | `results.js`，由冻结协议的产出誊写而来 —— 绝不写死在页面里 |

## 🔄 一次改动怎么走到线上

1. **修改** —— 改本仓库的结构、样式或某张图
2. **预览** —— 本地起静态服务，两种语言都看一遍
3. **提交** —— 推到 `main`
4. **发布** —— GitHub Pages 服务新提交；`.nojekyll` 保证文件不被 Jekyll 处理
5. **核对** —— 刷新线上地址，确认页面和两个语言状态都渲染正常

## 📦 页面上有什么

三个页面，都通过导航栏的开关做中英切换：

| 页面 | 是什么 |
|------|--------|
| `index.html` | 项目主页 —— 差距、任务、标准目标、cohort、结果、发现、运行与引用 |
| `explorer.html` | 论文里的每一张表（T1–T5），可切片查看 |
| `playground.html` | 自己放恰好 *N* 个顶点，把你描的轮廓和 G<sub>N</sub> 打分对比 |

> 所有图都是用论文自己的算法和数字**在 `<canvas>` 里现画的**，没有需要同步维护的静态图片。首屏会让每个指代对象在 N ∈ {8, 16, 64} 之间轮转，任务图和目标构造图则可以自己挑对象。

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

页面上每一个分数都由[代码发布包](https://github.com/Social-AI-2026/Groundbench-codebase)里的冻结评测协议产出。题目与参考答案是[数据仓](https://huggingface.co/datasets/Social-AI-2026/GroundBench)上发布的冻结材料，而数据仓本身**不含任何模型输出、也不含任何分数**——它是卷子和标准答案，不是谁的成绩单。

> 分数只有在那套冻结协议下才可比。prompt、图像处理、坐标映射和多边形后端，任何一项不同都会改变一个数字的含义。页面不得把来自另一条流水线的数字当成同一回事来展示。

## 🗂️ 目录结构

```text
index.html        项目主页
explorer.html     论文全部表格，可切片
playground.html   自己描轮廓并打分

results.js        论文全部数字，挂在 window.GB —— 每个指标都是 [fixed, parseable-only]
poly.js           几何工具箱：源轮廓、exact-N 构造、栅格 IoU、canvas 绘制
shapes.js         四个指代对象的轮廓，所有图和 playground 共用
i18n.js           EN + 中文 词典，以及 data-t / data-th 运行时
app.js            主页：导航、滚动高亮、首屏与各图的 canvas、图表、榜单
explorer.js       explorer 的表格与图表
playground.js     描点交互、合法性检查、打分
styles.css        主题 —— 框用琥珀色，标准目标用薄荷色，模型预测用珊瑚色

uploads/          页面链接的论文 PDF
.nojekyll         告诉 GitHub Pages 原样服务这些文件
```

**更新结果。**所有数字都从 `results.js` 读。新增一个配置就在 `GB.configs` 里加一条（id、名称、厂商、颜色），并在 `GB.table1` 的每个预算块里加对应的键；有诊断数据的话再补 `GB.selcon.data` 和 `GB.slices.data`。别的地方都不用动。

## 🔬 范围与局限

- 本站是展示层，它自身不复现任何结果，也不验证任何结论。
- 图是导出的产物。底层分析变了就必须重新导出——页面无法察觉自己已经过期。
- 页面是静态的：没有服务端、没有统计、运行时不拉数据。
- 这里复现的任何数字，新鲜程度只等于最后一次改动它的提交。

## 📬 参与贡献

欢迎提 issue 和聚焦的 pull request。改动请限制在展示层，两种语言一起更新，且不要提交凭据或私有运行制品。

## 📄 引用与许可

基准的引用元数据在代码发布包里（[CITATION.cff](https://github.com/Social-AI-2026/Groundbench-codebase/blob/main/CITATION.cff)）。本文档不虚构 DOI 或公开论文链接。

本仓库采用 [MIT License](LICENSE)，[代码发布](https://github.com/Social-AI-2026/Groundbench-codebase)同样如此。COCO、RefCOCO 系列材料以及任何图的来源**不在其覆盖范围内**，仍适用各自条款。
