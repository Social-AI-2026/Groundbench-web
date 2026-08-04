/* Bilingual copy. EN strings live in the markup; ZH here. T(key) serves JS. */
(function () {
  const ZH = {
    'nav.gap': '总览', 'nav.task': '任务', 'nav.targets': '目标', 'nav.cohort': '题库',
    'nav.results': '结果', 'nav.findings': '发现', 'nav.try': '动手试', 'nav.explorer': '数据浏览', 'nav.cite': '引用',

    'hero.eyebrow': '基准测试 · 2026 · 1,500 题 × 5 个顶点预算',
    'hero.sub': '多分辨率多边形定位，暴露视觉—语言模型的几何能力缺口。',
    'hero.lede': 'RefCOCO 系列定位任务上的边界框分数已难以区分前沿系统，而框本身丢弃了形状。我们把同样的 <strong>1,500 组 图像–指代表达–指代对象</strong> 三元组重新对准到五个顶点预算下的 exact-<em>N</em> 多边形，并在同一个固定分母下分别审计填充区域 IoU 与合法多边形完成率。',

    'btn.paper': '论文', 'btn.code': '代码', 'btn.data': '数据集', 'btn.trace': '自己描一遍',

    'lg.box': '预测边界框', 'lg.target': '标准目标 G<sub>N</sub>', 'lg.target2': '标准目标',
    'lg.pred': '模型多边形', 'lg.hatch': '被框计入的背景',
    'lg.region': '指代区域', 'lg.you': '你的多边形',

    'stat.1': '最强配置的边界框 IoU', 'stat.2': '同一系统直接输出多边形的 IoU',
    'stat.3': '配对题目 × 顶点预算', 'stat.4': 'N = 64 时的合法多边形覆盖率',

    's1.title': '框只负责定位，多边形才能区分。',
    's1.dek': '四个数字的矩形不携带形状、不贴合边界，还把背景内部一并计入。稠密掩码能还原形状，但通常需要专用解码器。<strong>Exact-<em>N</em> 多边形正好落在中间</strong>——足以暴露轮廓，又紧凑到可以用同一个对话接口以文本形式输出。',
    's1.c1.k': '旧契约', 's1.c1.h': '四个坐标，一个框',
    's1.c1.b': '区分度有限 · 区域几何粗糙 · 输出长度固定 · 形状保真度低。',
    's1.c2.k': '新契约', 's1.c2.h': '2N 个坐标，一条轮廓',
    's1.c2.b': '区分度更强 · 边界感知的几何 · 顶点预算可控 · 细粒度形状保真。',
    's1.callout': '最强的受测配置达到 <span class="big">88.2</span> 边界框 IoU 与 <span class="big">97.1</span> Acc@.5——但直接要求输出多边形时只有 <span class="big">57.7</span> 与 <span class="big">69.2</span>。',
    's1.cap': '<b>配对对照。</b>由于边界框 IoU 以真值框为参照，而轮廓 IoU 以 G<sub>N</sub> 为参照，两者不可直接比较。把每个<em>预测框</em>均匀采样成 exact-<em>N</em> 多边形、再与同一轮廓目标比较，汇总后为 57.7（直接输出）对 57.3（由框导出）——这个差距来自输出契约本身，而非评分方式。',

    's2.title': '任务定义',
    's2.dek': '给定图像 <em>I</em>、指代表达 <em>r</em> 和公布的预算 <em>N</em>，模型返回恰好 <em>N</em> 个归一化点：一行，2<em>N</em> 个位于 {0…999} 的整数。不使用工具，不接掩码头，不做任务特定训练。',
    's2.code.hd': '提示词 / 回复契约',
    's2.in.k': '输入', 's2.in.h': '一张图、一句话、一个数字',
    's2.in.b': '一张图像，一句指代表达（例如「栅栏后面的那只斑马」），以及公布的顶点预算 N。',
    's2.out.k': '输出', 's2.out.h': '一行 2N 个数字',
    's2.out.b': '沿着物体边缘走一圈的恰好 N 个点，每个坐标都是 0 到 999 之间的整数。仅此而已——不给工具、不接掩码头、没有画布。',
    's2.sample.raw': 'submitted literally as one flat line', 's2.sample': 'N = 16 时的一个合法答案 —— 顶点按边界顺序排列', 's2.sample.raw': '实际提交时是连成一行的数字',
    's2.a1.k': '轴 01', 's2.a1.h': '填充区域可用性',
    's2.a1.b': '输出的序列是否仍覆盖一块有用的区域？有限坐标映射到像素后，对其裁剪后的循环填充做栅格化，再与标准目标 G<sub>N</sub> 计算 IoU。',
    's2.a2.k': '轴 02', 's2.a2.h': '合法多边形完成率',
    's2.a2.b': '要求顶点为互不相同、落在范围内的整数，且构成简单、正面积的多边形。重复点、零面积与自交一律计零——分母同样固定。',
    's2.three': '三种能力被同时耦合',
    's2.k1': '在同类干扰物中锁定指代对象', 's2.k2': '推断可见边界并沿其分配顶点',
    's2.k3': '串行输出恰好 N 个顶点的闭合有序序列',
    's2.cap': '起点与遍历方向不受限制——填充掩码 IoU 对循环平移与反向都不变。输出长度上限并不构成约束：最长的合法答案约 <b>520 个字符</b>，而最紧的额度也有 <b>1,280 tokens</b>。',

    's3.title': '标准目标的构造',
    's3.dek': '每个指代对象有五个确定性目标，<em>N</em> ∈ {8, 16, 24, 32, 64}，由同一条选定标注轮廓导出并在评测前冻结。图像、短语与指代对象保持不变——<strong>只有答案的表面形式在变</strong>。五个文件共用同一批 1,500 个 UID，因此所有跨预算的结论都在题目交集上严格配对。',
    's3.algo.hd': '算法 1 · 标准目标 G<sub>N</sub>',
    's3.rules': '两条规则，反复执行直到轮廓恰好有 N 个顶点',
    's3.r1.k': '点不够', 's3.r1.h': '把最长的那条边对半',
    's3.r1.b': '找到轮廓上最长的一段直线，在它的中点放下一个新顶点，如此循环。细节总是被加在当前最粗糙的地方。',
    's3.r2.k': '点太多', 's3.r2.h': '去掉最平的那个拐角',
    's3.r2.b': '找到与前后两个邻居围成三角形面积最小的顶点——也就是最“不拐弯”的那个——把它删掉，如此循环。形状总是先丢掉信息量最低的点。',
    's3.rules.cap': '两条规则都是确定性的，平局时取最小下标，因此同一条标注永远得到同样的五个目标。左边可以看它跑。',
    's3.fid': '构造保真度 C<sub>N</sub> —— 形状保留了多少',
    's3.fid.cap': 'exact-<em>N</em> 目标与未化简源部件之间的平均 IoU。数值越高说明近似损失越小——这正是 <b>N = 64 处的崩塌</b>不能归咎于参照更差的原因。',
    's3.c1.k': '多部件', 's3.c1.h': '确定性地只取一个部件',
    's3.c1.b': '当一条标注包含多个多边形部件时，构造取顶点数最多的那个。这影响 <b>148 / 1,500</b> 个 UID；其中所选部件平均覆盖全部件并集的 71.76%，并在 85.14% 的情况下也是面积最大的部件。',
    's3.c2.k': '相位审计', 's3.c2.h': '八个起点偏移',
    's3.c2.b': '把采样起点沿轮廓按 12.5% 的间距移动八次后重建目标，配置排序与高预算处的反转都保持不变。',
    's3.c3.k': '重新评分', 's3.c3.h': '换参照掩码，换评分后端',
    's3.c3.b': '同一批预测在未化简部件、全部件并集与连续面积积分下重新评分。五个预算的均值最多移动 <b>1.1 分</b>，排序不变。',

    's4.title': '题库不是一个平均数',
    's4.dek': '1,500 组唯一的图像–指代对象配对，每张图一题，RefCOCO、RefCOCO+、RefCOCOg 各 500 题。每道题都带有冻结的元数据——干扰物数量、轮廓复杂度、相对尺度、语义组、短语长度，以及可复现的复合难度标签——因此结果可以被切片，而不只是被平均。',
    's4.comp': '构成',
    's4.kv2': '干扰物分箱 D1 / D2 / D3+', 's4.kv3': '难度 易 / 中 / 难',
    's4.kv4': '覆盖 80 个 COCO 类别的语义组', 's4.kv5': '零干扰物的题目',
    's4.kv6': '生成采集时间', 's4.kv7': '图像最长边',
    's4.diff.hd': '复合难度 s',
    's4.cap': '汇总的固定分母 IoU（表 5）。难度、D、Q、RS 使用 IoU²，语义组使用 best-effort 视角。所有配置从易到难、从低到高轮廓复杂度都单调下降——而随目标尺度上升。',

    's5.title': '结果',
    's5.dek': '四个托管配置在全部五个预算上回答全部 1,500 题，另有同端点的 Qwen 关闭思考作为消融。主表 <em>IoU²</em> 取一次主调用加最多两次无状态重试中的首个可解析输出。每个单元格都是<strong>固定分母</strong>——无法解析的回复计零——并与其仅可解析子集的对应值成对给出。',
    's5.note': '每个单元格读作 <b>固定 / 仅可解析</b>：实心条是固定分母分数，其后的淡色条是仅可解析分数，两者之差就是解析失败的代价。粗体为该预算下最佳，下划线为次佳。<a href="explorer.html">打开完整数据浏览 →</a>',
    'ui.sortby': '排序依据',
    's5.curve': '预算曲线',
    's5.f1.k': 'F1 · 几何缺口', 's5.f1.h': '一个巨大且尚未收敛的缺口',
    's5.f1.b': 'Gemini 领先，其后是 Qwen-max、Doubao、Kimi。阈值把 Kimi 在低预算下的找物能力与 Gemini 更强的条件几何区分开来——两者在高 <em>N</em> 上都失去可靠性。',
    's5.f2.k': 'F2 · 对 N 非单调', 's5.f2.h': '在最密预算处崩塌',
    's5.f2.b': '分数在中等预算处见顶，并在 N = 64 处下滑，<em>尽管</em>参照保真度还在上升；即使额外顶点只是细分边、不改变填充目标，下滑依然存在。N = 64 时 Gemini 的填充 IoU 仍有 37.7，而合法多边形覆盖率与 IoU 跌到 <b>7.5 / 4.2</b>。',
    's5.f3.k': '排序稳定性', 's5.f3.h': '单一阈值不足以判定质量',
    's5.f3.b': 'Acc@.5 在四个配置、五个预算上都保持同一排序；固定分母 IoU 在 N = 64 处出现一次 Qwen–Gemini 反转。更低的阈值会带来更多跨预算变化。',

    's6.title': '什么真正改变了分数',
    's6.dek': '在 Qwen 端点上冻结的 13 条件网格——推理深度、视觉证据、分辨率、颜色、提示真伪、解码、可重复性——其中图像干预使用配对的 500-UID 子集，并由 Gemini 复现。',
    's6.p1.k': 'F3 · 证据 ≫ 分辨率 ≫ 颜色',
    's6.p1.b': '固定分母 IoU，N = 8 / 16 / 24 的均值。推理配置是最大的“输入不变”效应；移除图像的损害与之相当，而减半分辨率或去掉颜色的代价小得多。',
    's6.p2.k': '思考、解码与可重复性',
    's6.p2.b': '最大思考在每个预算上都优于关闭思考，既来自更广的解析覆盖，也来自更好的几何。思考额度、温度与独立重跑都只是二阶效应。',
    's6.p3.k': 'F4 · 提示的作用是不对称的',
    's6.p3.b': '错误的空间提示比错误的颜色提示伤害更大，且二者叠加是次可加的；而真实提示没有可靠增益。这诊断的是对冲突语言的易感性，而非空间/颜色之间的内在排序。',
    's6.p4.k': '选择 vs 描摹',
    's6.p4.b': 'Sel 表示目标偏好——预测与目标的重叠超过任何同类干扰物。Con 是在该事件条件下的轮廓 IoU。<b>偏好一直很高，而描摹才是持续的区分项</b>，所以一个 IoU 不能被当成其中任何一种能力单独读取。',
    's6.callout': '在最密预算下目标偏好也终于失守：平均 Sel 从 N = 24 的 <span class="big">82.0</span> 跌到 N = 64 的 <span class="big">53.7</span>，而条件描摹几乎没动。<em>N</em> 是在表示能力与交付能力之间做交换——它并不定义一条一维的难度轴。',

    's7.title': '获取与引用',
    's7.dek': '五个 JSONL 文件共用同一批 1,500 个 UID。评测脚本、每题冻结的元数据、备选参照掩码与官方评分代码都在代码库里——想复现或扩展本页的任何内容，去那里看。',
    's7.code.hd': '快速开始',
    's7.c1.b': '每题一行：<code>{uid, n, points}</code>。原始模型文本会由官方解析器重放——不接受自报分数。',
    's7.c2.b': '端点、推理设置、解码参数、重试策略与采集日期。每个结果都归属于完整标注的配置。',
    's7.callout': 'GroundBench 是对带时间戳的托管配置所做的受控<strong>输出审计</strong>，不是架构层面的比较。坐标输出是一种压力测试，而非规定的接口——掩码头、工具调用与压缩轮廓都是有效的替代方案。',

    's8.title': '引用',

    'foot.1': '多分辨率多边形定位。<br />1,500 题 × 5 个顶点预算。',
    'foot.try': '自己描一遍 →', 'foot.explorer': '完整数据浏览 →', 'foot.pdf': '论文 PDF →',
    'foot.code': 'GitHub 代码仓库 →', 'foot.data': 'Hugging Face 数据集 →',

    'ui.copy': '复制', 'ui.copied': '已复制', 'ui.referent': '指代对象', 'ui.budget': '预算',
    'ui.target': '目标', 'ui.sliceby': '切片维度', 'ui.denom': '分母', 'ui.metric': '指标',
    'ui.submit': '提交', 'ui.layout': '排布', 'ui.condition': '条件', 'ui.configuration': '配置',
    'ui.pooled': '汇总', 'ui.mean': '均值', 'ui.both': '固定 / 可解析', 'ui.fixed': '固定',
    'ui.parse': '仅可解析', 'ui.bybudget': '按预算', 'ui.byconfig': '按配置', 'ui.view': '视图',
    'ui.legend.fixed': '固定分母', 'ui.legend.parse': '仅可解析', 'ui.focus': '重点列',
    'ui.baseline': '基线', 'ui.truecue': '真实提示', 'ui.falsecue': '错误提示', 'ui.imgev': '图像证据',
    'ui.think': '思考深度', 'ui.decode': '解码与可重复性', 'ui.parseonly': '仅可解析',

    'shape.zebra': '斑马', 'shape.bus': '公交车', 'shape.cat': '猫', 'shape.person': '行人', 'shape.image': '自定义图片',
    'ft.try': '描摹台', 'ft.expl': '数据浏览', 'ft.home': '项目主页', 'ft.paper': '论文', 'ft.code': 'GitHub', 'ft.data': '数据集', 'ft.note': '1,500 题 × 5 预算',
    'shape.giraffe': '长颈鹿', 'shape.plane': '飞机', 'shape.umbrella': '雨伞',
    'expr.giraffe': '“正在低头喝水的那只长颈鹿”', 'expr.plane': '“停在最右边的那架飞机”',
    'expr.umbrella': '“被撑开的那把伞”',
    'expr.zebra': '“栅栏后面的那只斑马”', 'expr.bus': '“左边那辆公交车”',
    'expr.cat': '“坐在窗台上的那只猫”', 'expr.person': '“穿红色夹克的那个人”',
    'expr.image': '“你自己图片里的目标”',

    'algo.ready': '就绪', 'algo.ff': '已快进至 N + 18', 'algo.insert': '在最长边上插入中点',
    'algo.remove': '删除最小面积顶点', 'algo.done': '完成 · |C| = N',
    'algo.source': '源轮廓', 'gap.box': '框 vs 区域', 'gap.poly': 'Exact-N vs 区域',

    'sel.g1': 'Sel —— 目标偏好', 'sel.g2': 'Con —— 条件描摹', 'sel.g3': 'IoU —— 固定分母',
    'cue.base': '原始提示', 'cue.S': '真实空间提示', 'cue.C': '真实颜色提示', 'cue.SC': '两者均真',
    'cue.WC': '错误颜色提示', 'cue.WS': '错误空间提示', 'cue.WSC': '两者均错',
    'cue.grey': '灰度图', 'cue.half': '半分辨率', 'cue.noimg': '无图像',
    'rt.max': '最大思考', 'rt.med': '中等思考', 'rt.off': '关闭思考',
    'rt.t0': '温度 0', 'rt.t05': '温度 0.5', 'rt.t10': '温度 1.0', 'rt.rep': '独立重跑',
    'ab.maxthink': '最大思考', 'ab.base': '原始提示（基线）',
    'slice.diff': '难度', 'slice.D': '干扰物', 'slice.Q': '复杂度', 'slice.RS': '尺度', 'slice.group': '语义组',
    'slice.q': ' 题',
    'col.Easy': '易', 'col.Medium': '中', 'col.Hard': '难',
    'col.Animal': '动物', 'col.Food': '食物', 'col.Indoor': '室内', 'col.Outdoor': '室外',
    'col.Person': '人', 'col.Vehicle': '交通工具',

    /* playground */
    'pg.eyebrow': '交互 · 任务的“描摹”一半',
    'pg.title': '自己描一遍',
    'pg.dek': '定位任务要求模型先<em>找到</em>指代对象，再把它<em>描出来</em>。这里指代对象已经直接给你了——只剩下第二步，而它依然很难。围绕高亮区域放下恰好 <strong>N 个顶点</strong>，你的轮廓会用与基准完全相同的策略栅格化，并与标准 exact-<em>N</em> 目标比较。',
    'pg.new': '换一个对象', 'pg.undo': '撤销', 'pg.clear': '清空',
    'pg.reveal': '显示目标', 'pg.hide': '隐藏目标',
    'pg.iou.cap': 'IoU × 100 对 G<sub>N</sub>',
    'pg.idle': '放完 N 个顶点后开始评分。起点与方向自由——填充掩码 IoU 对循环平移与反向都不变。',
    'pg.vs': '你 vs 该预算下的托管配置',
    'pg.note': '模型分数是论文中在 1,500 道真实 RefCOCO 系列题目上的固定分母 IoU²。你的分数只是一条已经把答案指给你看的合成轮廓——这个比较对你相当宽容，而这正是这个练习的意义。',
    'pg.why.k': '为什么难', 'pg.why.h': '瓶颈不在带宽',
    'pg.why.b': '顶点越多，容量越大，但回复也越长，重复点、交叉、抄近路与累计漂移的机会也越多。先试 N = 8，再试 N = 64——本应最容易拿分的预算，恰恰是合法性最先崩掉的那个。',
    'pg.left1': '还差 %n 个顶点', 'pg.left0': '多边形已闭合 · %n 个顶点',
    'pg.float': '还需 %n 个点', 'pg.float.undo': '右键撤销 · 点框外取消',
    'pg.hint.place': '点击放置顶点', 'pg.hint.restart': '点击重新开始',
    'pg.fl.count': '定长', 'pg.fl.simple': '简单多边形', 'pg.fl.area': '正面积', 'pg.fl.dupe': '顶点互异',
    'pg.legal': '合法多边形。你在 N = %n 上胜过 <b style="color:var(--ref)">4 个配置中的 %b 个</b>。',
    'pg.illegal': '<b style="color:var(--pred)">非法多边形——合法性轴计零。</b>填充区域轴仍读作 %v；基准会分别报告这两条轴。',
    'pg.v90': '几乎完全吻合——不过答案本来就摆在你眼前。',
    'pg.v70': '描得不错。模型看到的只有一张图和一句话。',
    'pg.v0': '比看上去难——而这还是这项任务里较容易的一半。',
    'pg.you': '你',
    'pg.image.hint': '自定义图片没有参考轮廓——但合法性检查与输出的坐标行依然精确。把图片拖到画布上即可更换。',
    'pg.image.empty': '选择“自定义图片”后，把任意图片拖到画布上',

    /* explorer */
    'ex.eyebrow': '完整结果 · 每张表都可切片',
    'ex.t1.title': '填充区域结果',
    'ex.t1.chart': '固定分母 vs 仅可解析，按预算',
    'ex.t1.dek': '完整的表 1。每个单元格都读作 <strong>固定 / 仅可解析</strong> 的 IoU²——实心条是固定分母分数，其后的淡色条是仅可解析分数，两者之差就是解析失败的代价。<em>IoUp</em> 以未化简的源部件重新评分；<em>IoUn</em> 把 IoUp 除以构造保真度 C<sub>N</sub>，是一个描述性比值，不是有界概率。',
    'ex.t1.note': '粗体为该预算区块内最佳，下划线为次佳。C<sub>N</sub> 在 N = 8 / 16 / 24 / 32 / 64 上分别为 88.6 / 96.2 / 98.3 / 99.0 / 99.4。',
    'ex.t1b.title': '每个配置在哪里拐弯',
    'ex.t1b.dek': '同一批数字画成曲线。左边看某一指标随预算的走势，右边看汇总后的阈值剖面——两边都可以切换。',
    'ex.thresh': '汇总阈值剖面',
    'ex.t23.title': '受控干预',
    'ex.t23.dek': '§06 背后的完整网格——每个条件在每个预算上的值，以及概览图表没有展示的仅可解析行。每个预算 1,500 个 UID，其中无图像、半分辨率与灰度条件使用配对的 500-UID 子集。固定分母 IoU ×100。',
    'ex.t2.hd': '表 2 · 提示与图像证据', 'ex.t3.hd': '表 3 · 思考、解码与可重复性',
    'ex.t23.callout': '错误的空间提示相对原始提示基线损失 <span class="big">24.1</span> 分，错误颜色提示损失 <span class="big">9.2</span> 分。两类真实提示都没有可靠增益——这种不对称诊断的是对冲突语言的易感性，而不是“空间强于颜色”。',
    'ex.t4.title': '选择 vs 描摹',
    'ex.diag.title': '诊断切片',
    'ex.t4.dek': 'Best-effort 视角。只有当与目标的重叠超过每一个同类干扰物时，<em>Sel</em> 才记为一次偏好事件——没有绝对阈值、没有置信度排序、没有跨类别匹配。<em>Con</em> 是该事件条件下的轮廓 IoU。',
    'ex.t4.callout': '目标偏好一直撑到 N = 32，随后失守：平均 Sel 从 <span class="big">80.8</span> 跌到 N = 64 的 <span class="big">53.7</span>，而平均 Con 只动了 2.0 分。关闭思考的 Qwen 崩到 <span class="big">3.8</span>——它根本不再产出可解析的答案。',
    'ex.t5.title': '题库切片',
    'ex.t5.dek': '按复合难度、其组成维度与语义组给出的汇总固定分母 IoU。难度、D、Q、RS 使用 IoU²，语义组使用 best-effort。',
    'ex.t5.c1.k': '难度', 'ex.t5.c1.h': '从易到难一致下滑',
    'ex.t5.c1.b': '所有配置从易到难都损失 13–16 分，且仅可解析视角下的配对损失同样存在，说明问题出在条件几何而非格式覆盖。',
    'ex.t5.c2.k': '复杂度 Q', 'ex.t5.c2.h': '轮廓复杂度影响最大',
    'ex.t5.c2.b': 'Q = ℓ²/(4πA)。Q1→Q3 的落差（均值 −10.2）是表中最陡的单维效应，比干扰物数量更强。',
    'ex.t5.c3.k': '尺度 RS', 'ex.t5.c3.h': '小目标才是难例',
    'ex.t5.c3.b': 'RS 是目标框面积占图像面积之比。与其他所有维度相反，分数从 RS1 到 RS3 是<em>上升</em>的：小指代对象平均要多付 8.6 分。',
    'ex.read.title': '怎么读这些数字',
    'ex.read.c1.k': '固定分母', 'ex.read.c1.h': '每一道计划题目都算数',
    'ex.read.c1.b': '无法解析的回复计零，并且仍留在分母里。以成功输出为条件会让覆盖率低的配置显得几何更强——Gemini 在 N = 64 正是如此（固定 37.7，仅可解析 63.4）。',
    'ex.read.c2.k': '恢复历史', 'ex.read.c2.h': 'IoU⁰ / IoU¹ / IoU²',
    'ex.read.c2.b': 'IoU⁰ 是单次调用视角，IoU¹ 增加一次由解析失败触发的无状态重试，IoU² 最多两次。所有主表分数统一使用 IoU²，best-effort 只用于标注过的诊断。',
    'ex.read.c3.k': '适用范围', 'ex.read.c3.h': '这是一次快照，不是架构排名',
    'ex.read.c3.b': '2026 年 7 月 10–17 日采集的有目的托管系统快照，不是概率抽样。每个结果都归属于完整标注的配置，含端点与推理设置。',
    'ex.back': '← 返回项目页', 'ex.try': '自己描一遍 →'
  };

  const EN = {}; // filled from the DOM on first apply
  const dicts = { en: EN, zh: ZH };
  let lang = 'en';

  function captureEN() {
    document.querySelectorAll('[data-t]').forEach(el => { if (!(el.dataset.t in EN)) EN[el.dataset.t] = el.textContent; });
    document.querySelectorAll('[data-th]').forEach(el => { if (!(el.dataset.th in EN)) EN[el.dataset.th] = el.innerHTML; });
    document.querySelectorAll('[data-tp]').forEach(el => { if (!(el.dataset.tp in EN)) EN[el.dataset.tp] = el.placeholder; });
  }

  // JS-side strings: EN defaults here, ZH from the table above.
  const EN_JS = {
    'ui.copy': 'Copy', 'ui.copied': 'Copied', 'ui.referent': 'Referent', 'ui.budget': 'Budget',
    'ui.target': 'Target', 'ui.sliceby': 'Slice by', 'ui.denom': 'Denominator', 'ui.metric': 'Metric',
    'ui.pooled': 'Pooled', 'ui.mean': 'Mean', 'ui.both': 'Fixed / parse', 'ui.fixed': 'Fixed',
    'ui.parse': 'Parseable', 'ui.bybudget': 'By budget', 'ui.byconfig': 'By config',
    'ui.view': 'Layout', 'ui.condition': 'Condition', 'ui.configuration': 'Configuration',
    'ui.legend.fixed': 'Fixed denominator', 'ui.legend.parse': 'Parseable-only', 'ui.sortby': 'Sort by', 'ui.focus': 'Focus',
    'ui.baseline': 'Baseline', 'ui.truecue': 'Truthful cue', 'ui.falsecue': 'False cue', 'ui.imgev': 'Image evidence',
    'ui.think': 'Thinking depth', 'ui.decode': 'Decoding & repeatability', 'ui.parseonly': 'parseable-only',
    'shape.zebra': 'Zebra', 'shape.bus': 'Bus', 'shape.cat': 'Cat', 'shape.person': 'Person', 'shape.image': 'Your image',
    'ft.try': 'Playground', 'ft.expl': 'Explorer', 'ft.home': 'Project', 'ft.paper': 'Paper', 'ft.code': 'GitHub', 'ft.data': 'Dataset', 'ft.note': '1,500 questions × 5 vertex budgets',
    'shape.giraffe': 'Giraffe', 'shape.plane': 'Airplane', 'shape.umbrella': 'Umbrella',
    'expr.giraffe': '“the giraffe bending down to drink”', 'expr.plane': '“the airplane parked furthest right”',
    'expr.umbrella': '“the umbrella that is open”',
    'expr.zebra': '“the zebra behind the fence”', 'expr.bus': '“the bus on the left”',
    'expr.cat': '“the cat sitting on the windowsill”', 'expr.person': '“the person in the red jacket”',
    'expr.image': '“the referent in your own image”',
    'algo.ready': 'ready', 'algo.ff': 'fast-forwarded to N + 18', 'algo.insert': 'insert midpoint of longest edge',
    'algo.remove': 'remove minimum-area vertex', 'algo.done': 'done · |C| = N', 'algo.source': 'Source contour',
    'gap.box': 'Box vs region', 'gap.poly': 'Exact-N vs region',
    'sel.g1': 'Sel — target preference', 'sel.g2': 'Con — tracing | Sel', 'sel.g3': 'IoU — fixed denominator',
    'cue.base': 'Baseline prompt', 'cue.S': 'True spatial', 'cue.C': 'True colour', 'cue.SC': 'Both true',
    'cue.WC': 'Wrong colour', 'cue.WS': 'Wrong spatial', 'cue.WSC': 'Both wrong',
    'cue.grey': 'Greyscale', 'cue.half': 'Half resolution', 'cue.noimg': 'No image',
    'rt.max': 'Max thinking', 'rt.med': 'Medium thinking', 'rt.off': 'Thinking off',
    'rt.t0': 'Temperature 0', 'rt.t05': 'Temperature 0.5', 'rt.t10': 'Temperature 1.0', 'rt.rep': 'Independent repeat',
    'ab.maxthink': 'Max thinking', 'ab.base': 'Baseline prompt',
    'slice.diff': 'Difficulty', 'slice.D': 'Distractors', 'slice.Q': 'Complexity', 'slice.RS': 'Scale', 'slice.group': 'Semantic',
    'slice.q': ' q',
    'col.Easy': 'Easy', 'col.Medium': 'Medium', 'col.Hard': 'Hard',
    'col.Animal': 'Animal', 'col.Food': 'Food', 'col.Indoor': 'Indoor', 'col.Outdoor': 'Outdoor',
    'col.Person': 'Person', 'col.Vehicle': 'Vehicle',
    'pg.new': 'New referent', 'pg.undo': 'Undo', 'pg.clear': 'Clear',
    'pg.reveal': 'Show target', 'pg.hide': 'Hide target',
    'pg.idle': 'Place all N vertices to score. Start point and direction are free — filled-mask IoU is invariant to cyclic shift and reversal.',
    'pg.left1': '%n vertices remaining', 'pg.left0': 'polygon closed · %n vertices',
    'pg.float': '%n points left', 'pg.float.undo': 'right-click to undo · click outside to cancel',
    'pg.hint.place': 'click to place', 'pg.hint.restart': 'click to restart',
    'pg.legal': 'Legal polygon. You beat <b style="color:var(--ref)">%b of 4</b> hosted configurations at N = %n.',
    'pg.illegal': '<b style="color:var(--pred)">Illegal polygon — scores zero on the legality axis.</b> The filled-region axis still reads %v; the benchmark reports both, separately.',
    'pg.v90': 'Near-exact — and you were shown the answer.',
    'pg.v70': 'Solid tracing. The models see only an image and a phrase.',
    'pg.v0': 'Harder than it looks — and this is the easy half of the task.',
    'pg.you': 'You',
    'pg.image.empty': 'Pick “Your image”, then drop any picture onto the canvas',
    'pg.image.hint': 'No reference contour for your own image — the legality axis and the emitted coordinate line are still exact. Drag a picture onto the canvas to change it.',
    'ex.thresh': 'Pooled threshold profile', 'ex.diag.title': 'Diagnostic slices',
    'ex.t4.title': 'Selection vs tracing', 'ex.t5.title': 'Cohort slices'
  };
  Object.assign(EN, EN_JS);

  function T(key, fallback) {
    const d = dicts[lang];
    if (d && d[key] != null) return d[key];
    if (EN[key] != null) return EN[key];
    return fallback != null ? fallback : key;
  }

  function apply(next) {
    lang = next;
    const d = dicts[lang] || EN;
    document.querySelectorAll('[data-t]').forEach(el => { const v = d[el.dataset.t] != null ? d[el.dataset.t] : EN[el.dataset.t]; if (v != null) el.textContent = v; });
    document.querySelectorAll('[data-th]').forEach(el => { const v = d[el.dataset.th] != null ? d[el.dataset.th] : EN[el.dataset.th]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll('[data-tp]').forEach(el => { const v = d[el.dataset.tp] != null ? d[el.dataset.tp] : EN[el.dataset.tp]; if (v != null) el.placeholder = v; });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.body.classList.toggle('zh', lang === 'zh');
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
    try { localStorage.setItem('gb_lang', lang); } catch (e) {}
    window.dispatchEvent(new CustomEvent('gb:lang', { detail: lang }));
  }

  function init() {
    captureEN();
    let saved = 'en';
    try { saved = localStorage.getItem('gb_lang') || 'en'; } catch (e) {}
    document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => apply(b.dataset.lang)));
    apply(saved);
  }

  window.T = T;
  window.gbLang = () => lang;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
