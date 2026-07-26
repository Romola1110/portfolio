#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Heytea × 《给阿嬷的情书》 commercial proposal (commercial-landing v4)."""

from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor

OUT = Path("/workspace/商业策划案_心中念你_喜茶×给阿嬷的情书.docx")
MOCKUP_DIR = Path("/workspace/proposal-mockups")


def set_run_font(run, size=11, bold=False, color=None, name="宋体"):
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = name
    r_pr = run._element.get_or_add_rPr()
    r_fonts = r_pr.get_or_add_rFonts()
    r_fonts.set(qn("w:eastAsia"), name)
    if color:
        run.font.color.rgb = RGBColor(*color)


def add_title(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    set_run_font(r, 18, True, (26, 26, 26), "黑体")
    p.paragraph_format.space_after = Pt(4)


def add_subtitle(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    set_run_font(r, 11, False, (90, 90, 90))
    p.paragraph_format.space_after = Pt(10)


def h1(doc, text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    set_run_font(r, 14, True, (26, 26, 26), "黑体")
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)


def h2(doc, text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    set_run_font(r, 12, True, (40, 40, 40), "黑体")
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)


def body(doc, text, first_indent=True):
    p = doc.add_paragraph()
    r = p.add_run(text)
    set_run_font(r, 11)
    pf = p.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    pf.space_after = Pt(4)
    if first_indent:
        pf.first_line_indent = Cm(0.74)
    return p


def bullet(doc, text, level=0):
    p = doc.add_paragraph(style="List Bullet")
    p.clear()
    r = p.add_run(text)
    set_run_font(r, 11)
    p.paragraph_format.left_indent = Cm(0.5 + level * 0.5)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE


def quote(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    set_run_font(r, 12, True, (70, 70, 70), "楷体")
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)


def note(doc, text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    set_run_font(r, 9, False, (110, 110, 110))
    p.paragraph_format.space_after = Pt(6)


def table(doc, headers, rows):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.style = "Table Grid"
    for i, h in enumerate(headers):
        cell = t.rows[0].cells[i]
        cell.text = ""
        p = cell.paragraphs[0]
        r = p.add_run(h)
        set_run_font(r, 10, True, name="黑体")
    for ri, row in enumerate(rows):
        for ci, val in enumerate(row):
            cell = t.rows[ri + 1].cells[ci]
            cell.text = ""
            p = cell.paragraphs[0]
            r = p.add_run(val)
            set_run_font(r, 10)
    doc.add_paragraph()


def try_add_image(doc, path: Path, width_inches=5.8, caption=None):
    if not path.exists():
        note(doc, f"（附图缺失：{path.name}，请运行 mockup 生成后再打包）")
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(str(path), width=Inches(width_inches))
    p.paragraph_format.space_after = Pt(4)
    if caption:
        c = doc.add_paragraph()
        c.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = c.add_run(caption)
        set_run_font(r, 9, False, (110, 110, 110))


def build():
    doc = Document()
    for s in doc.sections:
        s.top_margin = Cm(2.2)
        s.bottom_margin = Cm(2.2)
        s.left_margin = Cm(2.4)
        s.right_margin = Cm(2.4)

    # Cover
    add_title(doc, "喜茶 × 《给阿嬷的情书》")
    add_title(doc, "联名商业策划案")
    add_subtitle(doc, "Campaign：《心中念你》")
    add_subtitle(
        doc,
        "版本：商业落地增强版 v4｜面试作业｜仅供内部讨论｜" + date.today().isoformat(),
    )
    quote(doc, "心中念你，便不觉远。")
    body(
        doc,
        "项目定位：从电影中的「侨批文化」，转化为年轻消费者日常表达思念的消费场景。",
        False,
    )
    body(doc, "关键词链路：文化资产 → 产品体验 → 用户表达 → 内容传播 → 用户资产", False)
    note(
        doc,
        "说明：本方案为面试作业，非已签约合作；价格与指标为商业模型示意，非内部真实数据；票房与先例请上线前复核公开信息。",
    )

    # 00 / 01 战略判断
    h1(doc, "01｜项目判断：为什么值得做")
    h2(doc, "为什么《给阿嬷的情书》值得成为喜茶的一次情绪资产投资？")
    body(doc, "1）联名市场正在从「流量联名」进入「资产联名」。")
    bullet(doc, "过去：IP知名度 → 短期销量。")
    bullet(doc, "现在：文化符号 → 品牌记忆 → 长期资产。")
    body(doc, "2）喜茶需要补充「东方情绪表达」的品牌资产。")
    bullet(doc, "喜茶已有：年轻化、创新茶饮、东方美学。")
    bullet(doc, "用户情绪认知更多停留在：好喝、好看、年轻。")
    bullet(doc, "本片可补齐：有温度、有牵挂、有人情味。")
    body(doc, "3）这个项目不是卖一杯奶茶，而是建立：喜茶 = 年轻人表达情感的入口。")
    body(
        doc,
        "决策结论：值得投入的不是「一部电影的热度」，而是一套可复用的情绪表达方法论——文化如何转化为可购买、可参与、可沉淀的商业资产。",
    )

    # 02
    h1(doc, "02｜市场机会：情绪消费趋势")
    body(doc, "年轻消费者购买联名产品，不只是为了功能，而是为了：")
    bullet(doc, "情绪价值：买的是被安放的心情。")
    bullet(doc, "身份表达：买的是「我是会念人的人」。")
    bullet(doc, "社交分享：买的是可被看见的表达仪式。")
    body(
        doc,
        "公开信息显示，《给阿嬷的情书》（导演蓝鸿春，2026-04-30上映）上映后仍保持较强话题与票房热度（如36氪转引猫眼：截至2026-06-27票房破19亿元）；且已出现阿嬷手作、一杯潮茶等真实联名先例。喜茶尚未与该片官联，存在差异化窗口。",
    )
    note(doc, "来源需复核：36氪/猫眼；阿嬷手作公众号；一杯潮茶抖音。")
    body(
        doc,
        "机会判断：联名竞争关键不是谁更热闹，而是谁能提供更轻、更真、更能被日常复用的表达入口。",
    )

    # 03
    h1(doc, "03｜IP资产拆解：电影能给喜茶什么")
    body(doc, "不只罗列「电影有什么」，而把IP拆成可转化的资产模型：")
    table(
        doc,
        ["IP资产", "情绪价值", "商业转化（给喜茶什么）"],
        [
            ["侨批", "跨越距离的思念", "包装、杯套、信件互动、电子侨批"],
            ["家书", "未表达的情感", "UGC、用户参与、短笺书写仪式"],
            ["潮汕茶文化", "东方生活方式", "产品研发叙事、区域试点记忆点"],
            ["等待与归来", "代际关系与报平安", "品牌内容、节点战役、专题资产"],
        ],
    )
    body(
        doc,
        "授权金句池（正式授权后使用）：「江海万里，心中念你，便不觉遥远。」「暹罗虽远，心有所寄，身若比邻。」「纸短情长，伏惟珍重。」「切要平安，即为团圆。」「江海有岸，团圆可盼。」「展信安康。」",
    )
    body(doc, "禁用边界：不消费丧亲创伤；不夸大真实侨批史；不把「阿嬷」做成低俗怀旧梗。")

    # 04
    h1(doc, "04｜喜茶品牌机会与联名策略判断")
    h2(doc, "喜茶联名策略机会：强识别IP vs 文化IP")
    table(
        doc,
        ["类型", "代表", "优势", "本案差异"],
        [
            ["强IP识别", "Chiikawa、星星人等", "快速吸引年轻用户，制造「喜欢」", "偏萌系陪伴与即时热度"],
            ["文化IP", "《给阿嬷的情书》", "建立品牌情绪资产，制造「想念」", "补齐有温度的东方表达"],
        ],
    )
    body(
        doc,
        "本案不是重复萌系路线，而是补齐另一条品牌资产：有温度的东方茶饮表达。目标不是制造短暂「喜欢」，而是制造可持续复用的「想念」。",
    )
    h2(doc, "品牌机会一句话")
    body(
        doc,
        "帮助喜茶从「好喝好看年轻」，延伸到「会念你、有温度」——把东方文化 × 年轻表达落成可消费入口。",
    )

    # 05
    h1(doc, "05｜合作价值")
    h2(doc, "对喜茶")
    table(
        doc,
        ["价值层", "具体收益"],
        [
            ["用户价值", "触达情感需求：思念、惦记、报平安。"],
            ["产品价值", "借侨批/潮汕文化丰富茶饮故事，增强单品记忆点。"],
            ["内容价值", "沉淀短笺金句、用户投稿、专题长图等可复用素材。"],
            ["用户资产", "电子纪念卡/电子侨批回流会员体系，形成二次触达。"],
            ["销售价值", "联名期到店转化、套餐/礼赠提高客单、试点可评估再扩。"],
        ],
    )
    h2(doc, "对电影IP")
    table(
        doc,
        ["价值层", "具体收益"],
        [
            ["生命周期", "从影院消费延长到日常茶饮场景。"],
            ["年轻触达", "通过喜茶门店进入非影迷年轻群体。"],
            ["文化符号", "让侨批从电影元素变成大众可参与的文化记忆。"],
            ["商业验证", "在头部茶饮渠道完成情绪联名样本。"],
        ],
    )
    body(
        doc,
        "合作关系：喜茶为执行与渠道主体，电影官方提供IP授权与物料审核；不引入第三方中介角色。",
    )

    # 06
    h1(doc, "06｜Campaign核心概念：《心中念你》")
    quote(doc, "心中念你，便不觉远。")
    body(
        doc,
        "通过产品、门店、内容三端联动，将电影IP的情绪价值转化为喜茶长期可复用的品牌资产。",
    )
    body(
        doc,
        "Campaign只做一件事：让「念你」成为年轻人买得起、说得出口、愿意分享的日常表达。",
    )
    table(
        doc,
        ["触点", "动作", "用户获得"],
        [
            ["产品", "喝一杯「念你」", "情绪承载物"],
            ["门店", "写短笺 / 投「念你信箱」", "表达仪式"],
            ["内容", "寄一杯茶 / 「许多句念你」", "被看见与被记录"],
        ],
    )
    body(doc, "门店话术（一句）：喝杯茶，念一念家里的人。")

    # 07
    h1(doc, "07｜用户洞察")
    body(doc, "核心人群：一二线城市年轻消费者（学生/新白领），有表达欲，但日常少机会认真说「我想你」。")
    table(
        doc,
        ["洞察", "表现", "策略对应"],
        [
            ["想表达，怕沉重", "不愿公开煽情，但愿意轻声惦记", "短笺、电子侨批、轻提示句"],
            ["要理由才买联名", "先看口味与性价比，再被故事打动", "口味吸引 → 故事理解 → 情绪表达"],
            ["分享要好看也要真", "愿意发社交，但拒绝尴尬任务", "电子纪念卡/电子侨批一键分享"],
            ["节点才想起送礼", "母亲节、中秋、春节、异地回家前", "礼赠套餐 + 季节限定"],
        ],
    )
    body(doc, "一句话人设：不是「最会表白的人」，而是「会念人的人」。")

    # 08
    h1(doc, "08｜产品策略：为什么买这杯茶")
    h2(doc, "产品目标")
    body(
        doc,
        "不是创造一个爆款新品，而是创造「一杯具有购买理由的情绪产品」。产品名：「念你」。定位：一杯承载思念情绪的东方牛乳茶。",
    )
    h2(doc, "消费者购买路径（三层桥）")
    table(
        doc,
        ["层级", "消费者获得", "产品对应"],
        [
            ["第一层：口味吸引", "想喝、好喝、回甘", "焙香红茶牛乳：熟悉、安心、回甘"],
            ["第二层：故事理解", "懂这杯茶为什么存在", "侨批需要载体；茶亦是连接媒介"],
            ["第三层：情绪表达", "可以送人、可以说出口", "送给想念的人；报一声平安"],
        ],
    )
    body(
        doc,
        "桥的关键：包装与杯套完成「口味→故事」；短笺/电子侨批完成「故事→表达」。不强调复杂原料创新，优先供应链可量产、可快速上架。",
    )

    # 09
    h1(doc, "09｜产品矩阵与销售场景")
    h2(doc, "产品矩阵")
    table(
        doc,
        ["组合", "产品", "商业目的", "示意价格带*"],
        [
            ["单杯", "「念你」", "降低购买门槛，承担销量", "常规中杯价位带（区域定价）"],
            ["双杯套餐", "「两个人的念你」", "情侣/朋友/亲子到店", "略低于两杯单买，提高连带"],
            ["季节限定", "「念你安康」", "节点传播与复购理由", "限定溢价或同价换装"],
            ["礼赠组合", "「一封念你礼」", "提高客单（券+家书卡+明信片）", "礼盒/券包价位，明显高于单杯"],
        ],
    )
    note(
        doc,
        "*价格为商业模型示意，非喜茶内部价；正式报价以研发成本、城市价位带与竞品对标后确定。",
    )
    body(doc, "商业逻辑：核心款负责销量；限定款负责传播；礼盒负责提高客单。")
    h2(doc, "消费场景（扩大商业空间）")
    table(
        doc,
        ["场景", "用户动机", "对应产品/动作"],
        [
            ["日常", "突然想起家人", "单杯「念你」+ 短笺"],
            ["节日", "母亲节/中秋/春节", "「念你安康」+「一封念你礼」"],
            ["旅行/异地", "远方报平安", "电子侨批寄一杯茶"],
            ["送礼", "给父母/长辈", "礼赠组合到店核销或自提"],
        ],
    )
    bullet(doc, "票根核销：先在试点城市验证核销率与门店操作成本，再决定是否扩面。")

    # 10
    h1(doc, "10｜门店体验设计：念你信箱 = 门店增长工具")
    body(doc, "「念你信箱」不是打卡装置，而是门店增长工具。商业目标有三：")
    bullet(doc, "提升停留时间：进店后增加轻互动，而非只是取餐离开。")
    bullet(doc, "提升分享率：电子纪念卡形成自然UGC。")
    bullet(doc, "提升复购理由：纪念卡/电子侨批形成二次触达。")
    h2(doc, "参与流程")
    body(
        doc,
        "购买联名饮品 → 获得短笺 → 写下一句话 → 投入信箱 → 扫码生成电子纪念卡 → 加入/登录喜茶会员 → 分享社交平台。",
        False,
    )
    body(doc, "路径：购买行为 → 情绪参与 → 会员沉淀 → 社交传播。")
    h2(doc, "落地细则")
    bullet(doc, "短笺提供空白句与轻提示句（如：今天最想报一声平安的人是____）。")
    bullet(doc, "员工话术不超过一句；不做复杂打卡任务。")
    bullet(doc, "陈列：主视觉、侨批信封杯套、信箱点位。")

    # 11
    h1(doc, "11｜用户运营闭环")
    h2(doc, "核心传播事件：「给想念的人寄一杯茶」")
    body(doc, "机制：用户填写「想送给谁」→ 生成电子侨批 → 线上分享 → 线下兑换。")
    body(
        doc,
        "示例文案：致妈妈——今天喝了一杯茶，突然想起你。",
        False,
    )
    body(
        doc,
        "价值：把电影情绪 + 产品购买 + 社交传播锁进同一动作；电子侨批回流会员，形成用户资产而非一次性流量。",
    )
    h2(doc, "闭环指标")
    table(
        doc,
        ["环节", "动作", "指标"],
        [
            ["购买", "点单/套餐/礼赠", "联名销量、套餐占比、客单价"],
            ["参与", "信箱/电子侨批", "参与率、生成量、停留相关观察"],
            ["沉淀", "会员登录/绑定", "新会员、活跃回流、二次触达打开率"],
            ["传播", "分享与投稿", "分享率、UGC量、话题互动"],
        ],
    )

    # 12
    h1(doc, "12｜内容传播策略")
    h2(doc, "主话题与大创意")
    bullet(doc, "主话题：#心中念你")
    bullet(doc, "辅助：#喝杯茶念一念家里的人")
    bullet(doc, "大创意事件：「给想念的人寄一杯茶」（电子侨批）")
    h2(doc, "内容资产项目：「许多句念你」")
    body(
        doc,
        "用户投稿「想对某个人说的一句话」，精选100句/1000句，形成线上长图、品牌纪录、公众号专题。Campaign结束后留下长期内容资产。",
    )
    h2(doc, "传播节奏")
    table(
        doc,
        ["阶段", "内容重点"],
        [
            ["预热", "侨批/家书文化短内容 + Campaign预告"],
            ["爆发", "产品上市 + 寄一杯茶教程 + KOL轻表达"],
            ["长尾", "「许多句念你」精选 + 用户故事专题"],
        ],
    )
    body(doc, "UGC激励以「被看见」为主，避免过度金钱刺激稀释情绪真实性。")

    # 13
    h1(doc, "13｜商业模型、资源配置与指标")
    h2(doc, "项目资源需求 → 对应产出")
    table(
        doc,
        ["资源投入", "具体内容", "对应产出"],
        [
            ["产品资源", "研发、供应链、包装/杯套", "可售SKU、销售与毛利"],
            ["渠道资源", "门店陈列、员工一句培训、信箱点位", "到店转化、停留与核销"],
            ["内容资源", "KV、品牌短内容、社媒运营、电子侨批页", "曝光、UGC、品牌记忆"],
            ["IP资源", "授权、金句与物料审核", "合规使用与信任背书"],
            ["数字资源", "电子卡/会员埋点", "用户资产沉淀与二次触达"],
        ],
    )
    h2(doc, "试点商业模型（示意，非内部真实数据）")
    table(
        doc,
        ["模块", "模型假设（示意）", "看什么"],
        [
            ["试点范围", "华南 + 1个媒体城，选店抽样", "文化接近 + 内容扩散"],
            ["销量", "联名期核心款占茶饮销量一定比例", "产品接受度"],
            ["套餐/礼赠", "套餐与礼赠贡献更高客单", "客单结构"],
            ["参与", "购联名者中一定比例生成电子卡/侨批", "体验转化"],
            ["会员", "参与动作中可归因的新会员/回流", "用户资产"],
            ["传播", "UGC与话题互动达到内容阶段门槛", "是否进入Phase 2扩面"],
        ],
    )
    note(
        doc,
        "面试说明：此处刻意不虚构精确销售额/ROI数字；正式立项应用门店POS、研发成本与媒介报价回填。",
    )
    h2(doc, "成功标准（决策用）")
    bullet(doc, "销售：联名饮品销量、套餐占比、礼赠客单。")
    bullet(doc, "传播：UGC量、电子侨批分享率、话题互动。")
    bullet(doc, "资产：会员沉淀量、精选「念你」句子库、可复用专题页。")

    # 14
    h1(doc, "14｜执行计划（分阶段）")
    h2(doc, "Phase 1｜试点验证")
    bullet(doc, "目标：验证产品接受度与门店可操作性。")
    bullet(doc, "动作：核心款上架、信箱最小闭环、票根小范围测试、会员链路打通。")
    bullet(doc, "指标：销量、核销率、参与率、店员反馈。")
    h2(doc, "Phase 2｜内容扩散")
    bullet(doc, "目标：扩大IP影响与社交可见度。")
    bullet(doc, "动作：「寄一杯茶」主推、KOL轻表达、「许多句念你」开启。")
    bullet(doc, "指标：UGC数量、传播量、电子侨批分享率。")
    h2(doc, "Phase 3｜资产沉淀")
    bullet(doc, "目标：形成喜茶情绪联名案例与节点可复用资产。")
    bullet(doc, "动作：精选发布、公众号专题、复盘方法论；评估扩城与节日二波。")
    bullet(doc, "指标：用户故事沉淀、专题完整度、是否具备节点复用条件。")
    body(
        doc,
        "排期原则：以授权与供应链为准；若需借势，中秋/重阳/春节/母亲节可作为第二波，而非唯一窗口。预算按区域试点框架编制，全国推广预算单列。",
    )

    # 15
    h1(doc, "15｜风险与授权")
    h2(doc, "情绪 / 执行 / 合规风险")
    table(
        doc,
        ["风险", "对策"],
        [
            ["情绪表达变沉重", "坚持轻声惦记；提示句；不做煽情比赛"],
            ["供应链难支撑复杂创新", "风味逻辑简单可量产；备胎风味"],
            ["门店执行过重", "短笺+信箱+一句口播；电子卡减负"],
            ["票根核销混乱", "先试点后扩面"],
            ["版权与金句误用", "授权清单+法务审核；未授权不宣称官联"],
            ["被理解为消费苦难", "聚焦念你/报平安，不消费创伤情节"],
        ],
    )
    h2(doc, "商业风险")
    table(
        doc,
        ["风险", "对策"],
        [
            ["IP热度下降", "不依赖单一档期；把「念你」沉淀为节点资产（节假日可复用）"],
            ["产品购买动力不足", "强化口味价值 + 礼赠/异地场景 + 双杯套餐"],
            ["活动参与成本高", "轻互动设计；电子化优先；店员零长流程"],
            ["只赚曝光不沉淀用户", "电子卡/侨批强制轻会员路径，纳入复盘指标"],
        ],
    )
    h2(doc, "授权与物料清单")
    bullet(doc, "影片名称、主视觉、角色形象、指定金句的使用范围与期限。")
    bullet(doc, "包装/杯套/短笺/电子纪念卡/电子侨批页/线上专题的审核流程。")
    bullet(doc, "联名表述规范：官联/授权合作；禁止未授权「官方」话术。")
    bullet(doc, "数据复核：票房与第三方联名先例上线前再核。")

    # Visual appendix
    h1(doc, "附录A｜商业Mockup（决策看图）")
    body(
        doc,
        "不做「漂亮海报」，做三张品牌面试真正看的商业示意：概念能成立、产品能卖、门店能执行。",
        False,
    )
    h2(doc, "A1｜KV海报：概念")
    try_add_image(
        doc,
        MOCKUP_DIR / "01-kv-poster.png",
        caption="KV：心中念你，便不觉远。— 茶与家书同一画面。",
    )
    h2(doc, "A2｜产品包装：能卖")
    try_add_image(
        doc,
        MOCKUP_DIR / "02-product-packaging.png",
        caption="产品：「念你」杯身/杯套 — 侨批信封语汇，证明货架识别。",
    )
    h2(doc, "A3｜门店体验：能执行")
    try_add_image(
        doc,
        MOCKUP_DIR / "03-store-experience.png",
        caption="门店：念你信箱点位 + 短笺书写 — 轻互动可落地。",
    )

    h1(doc, "附录B｜15页汇报目录")
    table(
        doc,
        ["页码", "标题", "一句话"],
        [
            ["01", "项目判断", "为什么值得做情绪资产投资"],
            ["02", "市场机会", "情绪消费趋势与窗口"],
            ["03", "IP资产拆解", "电影能给喜茶什么"],
            ["04", "喜茶品牌机会", "喜欢 vs 想念"],
            ["05", "合作价值", "双方各拿什么"],
            ["06", "Campaign概念", "《心中念你》"],
            ["07", "用户洞察", "会念人的人"],
            ["08", "产品策略", "三层购买路径"],
            ["09", "矩阵与场景", "单杯/双杯/礼赠×场景"],
            ["10", "门店体验", "信箱=增长工具"],
            ["11", "用户运营闭环", "寄一杯茶→会员资产"],
            ["12", "内容传播", "大创意+许多句念你"],
            ["13", "商业模型与资源", "投入产出与指标"],
            ["14", "执行计划", "三阶段目标"],
            ["15", "风险与授权", "含商业风险"],
        ],
    )

    h1(doc, "结语")
    quote(doc, "心中念你，便不觉远。")
    body(
        doc,
        "不换主题、不堆新情绪词。本案补齐三层：为什么值得投入、怎么形成销售与客单、怎么沉淀用户资产。让文化转化可见、可买、可复用。",
    )
    body(doc, "——完——", False)

    doc.save(str(OUT))
    print("saved", OUT)


if __name__ == "__main__":
    build()
