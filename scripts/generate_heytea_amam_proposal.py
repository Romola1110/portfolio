#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Heytea × 《给阿嬷的情书》 commercial proposal (brand-decision v3)."""

from datetime import date

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = "/workspace/商业策划案_心中念你_喜茶×给阿嬷的情书.docx"


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
        doc, "版本：品牌决策增强版｜面试作业｜仅供内部讨论｜" + date.today().isoformat()
    )
    quote(doc, "心中念你，便不觉远。")
    body(
        doc,
        "项目定位：从电影中的「侨批文化」，转化为年轻消费者日常表达思念的消费场景。",
        False,
    )
    body(doc, "关键词链路：文化资产 → 产品体验 → 用户表达 → 内容传播", False)
    note(
        doc,
        "说明：本方案为面试作业，非已签约合作；票房与先例均标注公开信息来源，请上线前复核。",
    )

    # 01
    h1(doc, "01｜执行摘要")
    body(doc, "把电影里「心中念你，便不觉远」落成一杯茶、一张短笺、一次轻声惦记。")
    body(
        doc,
        "通过产品、门店、内容三端联动，将电影IP的情绪价值转化为喜茶长期可复用的品牌资产。",
    )
    body(
        doc,
        "本项目不是简单借电影热度，而是帮助喜茶建立「有温度的东方茶饮」品牌资产：以「念你」产品承担销售，以「念你信箱」门店体验完成情绪参与，以「许多句念你」内容项目沉淀长期传播资产。",
    )
    h2(doc, "一句话决策建议")
    bullet(
        doc,
        "值得投入：电影提供可复用的文化符号（侨批/家书/报平安），与喜茶「情绪消费+东方表达」方向契合。",
    )
    bullet(
        doc, "投入方式：区域试点优先（华南+一媒体城），验证销量与内容后再扩城。"
    )
    bullet(
        doc,
        "成功标准：联名饮品销量与核销、UGC数量、可复用内容资产（精选「念你」句子库）。",
    )

    # 02
    h1(doc, "02｜市场机会：为什么现在值得合作")
    h2(doc, "2.1 消费趋势：从产品消费进入情绪消费")
    body(doc, "年轻消费者购买联名产品，不只是为了功能，而是为了：")
    bullet(doc, "情绪价值：买的是被安放的心情。")
    bullet(doc, "身份表达：买的是「我是会念人的人」。")
    bullet(doc, "社交分享：买的是可被看见的表达仪式。")
    body(
        doc,
        "因此，联名竞争的关键不是谁更热闹，而是谁能提供更轻、更真、更能被日常复用的表达入口。",
    )

    h2(doc, "2.2 IP机会：《给阿嬷的情书》的核心资产")
    body(
        doc,
        "《给阿嬷的情书》（导演蓝鸿春，2026年4月30日上映）以潮汕侨批为叙事线索。对本案而言，核心资产不是「老人」，而是三组可产品化的文化符号：",
    )
    table(
        doc,
        ["文化资产", "代表含义", "可转化为"],
        [
            ["侨批文化", "跨越距离的牵挂", "信封杯套、短笺、报平安模板"],
            ["家书关系", "人与人之间未被说出口的情感", "「念你」书写仪式、电子纪念卡"],
            ["潮汕文化", "地域文化的年轻化表达", "风味叙事、区域试点记忆点"],
        ],
    )
    body(
        doc,
        "公开信息显示，影片上映后仍保持较强话题与票房热度（如36氪转引猫眼数据：截至2026-06-27票房破19亿元）。更重要的是，市场已出现真实联名先例——阿嬷手作、一杯潮茶等——说明该IP具备商业转化能力；而喜茶尚未与该片官联，存在差异化窗口。",
    )
    note(doc, "来源需复核：36氪/猫眼；阿嬷手作公众号；一杯潮茶抖音。")

    h2(doc, "2.3 品牌机会：喜茶需要持续强化「东方文化 × 年轻表达」")
    body(
        doc,
        "喜茶已有年轻消费基础，并持续通过情绪型IP（如Chiikawa、星星人）验证「治愈/陪伴」联名路径。本案不是重复萌系路线，而是补齐另一条品牌资产：有温度的东方茶饮表达。",
    )
    body(
        doc,
        "合作判断：不是「借一部电影做一波销量」，而是「借一组文化符号，沉淀一套可复用的情绪联名方法论」。",
    )

    # 03
    h1(doc, "03｜IP价值拆解（决策用）")
    body(doc, "品牌方决策只需抓住三句话：")
    bullet(doc, "侨批 = 跨越距离的牵挂（产品与包装的视觉母题）")
    bullet(doc, "家书 = 轻声惦记的表达仪式（门店与内容的互动母题）")
    bullet(doc, "潮汕 = 地域文化年轻化（风味叙事与区域试点的记忆点）")
    body(
        doc,
        "电影金句授权池（建议正式授权后使用）：「江海万里，心中念你，便不觉遥远。」「暹罗虽远，心有所寄，身若比邻。」「纸短情长，伏惟珍重。」「切要平安，即为团圆。」「江海有岸，团圆可盼。」「展信安康。」",
    )
    body(
        doc,
        "禁用边界：不消费丧亲创伤；不夸大真实侨批史；不把「阿嬷」做成低俗怀旧梗。",
    )

    # 04
    h1(doc, "04｜双方合作价值")
    h2(doc, "对喜茶")
    table(
        doc,
        ["价值层", "具体收益"],
        [
            ["用户价值", "触达年轻消费者的情感需求：思念、惦记、报平安。"],
            ["产品价值", "借潮汕/侨批文化丰富茶饮产品故事，增强「念你」单品记忆点。"],
            ["内容价值", "沉淀可持续传播素材（短笺金句、用户投稿、专题长图）。"],
            ["品牌价值", "强化「会念你、有温度」的东方茶饮资产，形成可复用联名方法论。"],
            ["销售价值", "联名期到店转化、套餐/礼赠提高客单、区域试点可评估再扩。"],
        ],
    )
    h2(doc, "对电影IP")
    table(
        doc,
        ["价值层", "具体收益"],
        [
            ["生命周期", "从影院消费延长到日常茶饮消费场景。"],
            ["年轻触达", "通过喜茶门店进入非影迷的年轻消费群体。"],
            ["文化符号", "让侨批从电影元素变成大众可参与的文化记忆。"],
            ["商业验证", "在头部茶饮渠道完成一次标准化情绪联名样本。"],
        ],
    )
    body(
        doc,
        "合作关系建议：喜茶为执行与渠道主体，电影官方提供IP授权与物料审核；本方案不引入第三方中介角色。",
    )

    # 05
    h1(doc, "05｜核心Campaign：《心中念你》")
    quote(doc, "心中念你，便不觉远。")
    body(
        doc,
        "Campaign只做一件事：让「念你」成为年轻人买得起、说得出口、愿意分享的日常表达。",
    )
    table(
        doc,
        ["触点", "动作", "用户获得"],
        [
            ["产品", "喝一杯「念你」", "情绪承载物"],
            ["门店", "写一张短笺投入「念你信箱」", "表达仪式"],
            ["内容", "参与「许多句念你」", "被看见与被记录"],
        ],
    )
    body(doc, "门店话术（一句）：喝杯茶，念一念家里的人。")

    # 06
    h1(doc, "06｜产品策略：念你系列")
    h2(doc, "6.1 为什么是这杯茶")
    body(doc, "产品名：「念你」。产品定位：一杯承载思念情绪的东方牛乳茶。")
    body(
        doc,
        "产品故事：灵感来自电影中的侨批——跨越江海的信件需要一个载体；茶，同样是一种连接人与人的媒介。消费者买的不是复杂口味创新，而是「我愿意花几分钟，念一念某个人」。",
    )
    body(doc, "风味逻辑（建议方向，最终以研发与供应链为准）：")
    bullet(doc, "焙香红茶：对应传统茶文化，提供「熟悉、回甘」。")
    bullet(doc, "牛乳：对应家庭温度，提供「安心、柔软」。")
    bullet(
        doc,
        "整体体验关键词：熟悉、安心、回甘——不强调复杂原料创新，优先可稳定供应、可快速上架。",
    )
    h2(doc, "6.2 产品矩阵")
    table(
        doc,
        ["层级", "产品", "承担角色", "说明"],
        [
            ["A 核心款", "「念你」", "销售主力", "焙香红茶牛乳系；全国/试点门店主推"],
            ["B 季节限定", "「念你安康」", "节点传播", "节日/节气窗口加推；文案侧重「展信安康」"],
            ["C 礼赠组合", "「一封念你礼」", "提高客单", "联名饮品券 + 家书卡 + 明信片"],
        ],
    )
    body(
        doc,
        "商业逻辑：核心款负责销量；限定款负责传播；礼盒负责提高客单。备选风味仅作供应链备胎（如轻乳茶/清爽茶底），正式上架以可量产为准。",
    )
    h2(doc, "6.3 套餐与票根（试点）")
    bullet(doc, "「一封念你」套餐：联名饮品 + 家书短笺/明信片。")
    bullet(doc, "「两个人的念你」：双杯套餐，适合结伴到店。")
    bullet(
        doc, "票根核销：先在试点城市验证核销率与门店操作成本，再决定是否扩面。"
    )

    # 07
    h1(doc, "07｜门店体验：念你信箱（含转化机制）")
    body(doc, "「念你信箱」要回答的不是「好不好看」，而是「消费者为什么参加」。")
    h2(doc, "参与流程（商业闭环）")
    body(
        doc,
        "购买联名饮品 → 获得短笺 → 写下一句话 → 投入信箱 → 生成电子纪念卡 → 分享社交平台。",
        False,
    )
    body(doc, "形成路径：购买行为 → 情绪参与 → 社交传播。")
    h2(doc, "落地细则")
    bullet(
        doc, "短笺提供「空白句」与「轻提示句」（如：今天最想报一声平安的人是____）。"
    )
    bullet(
        doc,
        "电子纪念卡：扫码生成（可含电影授权金句+用户句子+喜茶品牌落款），降低实物库存压力。",
    )
    bullet(doc, "门店陈列：联名主视觉、信封杯套、信箱点位；员工话术不超过一句。")
    bullet(doc, "不做复杂打卡任务，不增加店员长流程负担。")

    # 08
    h1(doc, "08｜周边设计：只做强IP关联")
    body(doc, "原则：保留与电影直接相关的家书资产；不做弱相关杂货挂件。")
    table(
        doc,
        ["级别", "周边", "作用"],
        [
            ["核心必做", "家书卡/短笺", "表达介质，活动主道具"],
            ["核心必做", "侨批信封杯套", "到店即可见的IP记忆点"],
            ["补充可选", "木棉花书签", "轻周边、低成本、强地域符号"],
            ["不做", "弱相关搪瓷杯/杂货挂件等", "与电影关联弱，分散预算"],
        ],
    )

    # 09
    h1(doc, "09｜内容传播：从话题到资产沉淀")
    h2(doc, "9.1 主话题")
    bullet(doc, "#心中念你")
    bullet(doc, "辅助：#喝杯茶念一念家里的人")
    h2(doc, "9.2 核心内容项目：「许多句念你」")
    body(
        doc,
        "用户投稿：想对某个人说的一句话。品牌精选100句/1000句，形成线上长图、品牌纪录内容、公众号专题。",
    )
    body(
        doc,
        "价值：Campaign结束后留下长期内容资产——这比单纯话题更符合「可复用品牌资产」目标。",
    )
    h2(doc, "9.3 传播节奏")
    table(
        doc,
        ["阶段", "内容重点"],
        [
            ["预热", "侨批/家书文化短内容 + Campaign预告"],
            ["爆发", "产品上市 + 信箱互动教程 + KOL轻表达"],
            ["长尾", "「许多句念你」精选发布 + 用户故事专题"],
        ],
    )
    body(
        doc,
        "UGC激励以「被看见」为主：精选上墙/上专题/电子纪念卡升级，避免过度金钱刺激稀释情绪真实性。",
    )

    # 10
    h1(doc, "10｜商业闭环：购买—参与—传播")
    table(
        doc,
        ["环节", "动作", "指标"],
        [
            ["购买", "点「念你」/套餐/礼赠", "联名饮品销量、套餐占比、客单价"],
            ["参与", "写短笺、投信箱、领电子卡", "参与率、电子卡生成量"],
            ["传播", "分享纪念卡、投稿「许多句念你」", "UGC量、话题阅读/互动、转发率"],
            ["沉淀", "精选句子库与专题页", "可复用内容条数、专题完读/收藏"],
        ],
    )
    body(doc, "试点城市建议：华南（文化接近）+ 一个媒体城市（内容扩散）。先验证，再扩城。")

    # 11
    h1(doc, "11｜执行规划（分阶段目标）")
    h2(doc, "Phase 1｜试点验证")
    bullet(doc, "目标：验证产品接受度与门店可操作性。")
    bullet(doc, "动作：核心款上架、信箱最小闭环、票根小范围测试。")
    bullet(doc, "指标：销量、核销率、店员执行反馈。")
    h2(doc, "Phase 2｜内容扩散")
    bullet(doc, "目标：扩大IP影响与社交可见度。")
    bullet(doc, "动作：主话题推进、KOL轻表达、「许多句念你」投稿开启。")
    bullet(doc, "指标：UGC数量、传播量、电子纪念卡分享率。")
    h2(doc, "Phase 3｜资产沉淀")
    bullet(doc, "目标：形成喜茶情绪联名案例与可复用内容资产。")
    bullet(doc, "动作：精选发布、公众号专题、复盘方法论沉淀。")
    bullet(
        doc, "指标：用户故事沉淀量、专题资产完整度、是否具备扩城/节点复用条件。"
    )
    h2(doc, "排期原则")
    body(
        doc,
        "正式档期以授权与供应链为准，不强行绑定固定公映纪念节点。若需借势，可优先考虑中秋、重阳、春节、母亲节等「念人」节点作为第二波，而非唯一窗口。",
    )
    h2(doc, "预算原则")
    body(
        doc,
        "建议按「区域试点框架」编制：产品研发与包装、门店物料、数字纪念卡与内容制作、小范围媒介；全国推广预算单列，避免未验证前总包承诺。",
    )

    # 12
    h1(doc, "12｜风险控制与授权清单")
    h2(doc, "风险与对策")
    table(
        doc,
        ["风险", "对策"],
        [
            ["情绪表达变沉重", "坚持轻声惦记；提供提示句；不做煽情比赛"],
            ["供应链无法支撑复杂创新", "主推风味逻辑简单、可量产；备胎风味备用"],
            ["门店执行过重", "短笺+信箱+一句口播；电子卡减负"],
            ["票根核销混乱", "先试点后扩面"],
            ["版权与金句误用", "授权清单+法务审核；未授权不对外宣称官联"],
            ["被理解为消费苦难", "传播聚焦「念你/报平安」，不消费创伤情节"],
        ],
    )
    h2(doc, "授权与物料清单（对接用）")
    bullet(doc, "影片名称、主视觉、角色形象、指定金句的使用范围与期限。")
    bullet(doc, "包装/杯套/短笺/电子纪念卡/线上专题的审核流程与修改轮次。")
    bullet(doc, "联名表述规范：官联/授权合作；禁止未授权「官方」话术。")
    bullet(doc, "数据复核：票房与第三方联名先例上线前再核最新公开信息。")

    h1(doc, "附录｜12页PPT结构建议（汇报用）")
    table(
        doc,
        ["页码", "标题", "一句话"],
        [
            ["01", "执行摘要", "一杯茶、一张笺、一次惦记；三端联动沉淀品牌资产"],
            ["02", "市场机会", "情绪消费时代，为什么现在合作"],
            ["03", "IP价值拆解", "侨批/家书/潮汕，不是「老人」"],
            ["04", "双方合作价值", "喜茶×电影，各拿什么"],
            ["05", "核心Campaign", "《心中念你》"],
            ["06", "产品策略", "念你系列矩阵"],
            ["07", "门店体验", "念你信箱转化闭环"],
            ["08", "周边设计", "家书资产，不做弱相关"],
            ["09", "内容传播", "许多句念你"],
            ["10", "商业闭环", "购买—参与—传播—沉淀"],
            ["11", "执行规划", "三阶段目标与指标"],
            ["12", "风险控制", "授权、供应链、门店、舆情"],
        ],
    )

    h1(doc, "结语")
    quote(doc, "心中念你，便不觉远。")
    body(
        doc,
        "不需要再创造新的情绪词。《心中念你》已经足够好。本案要让品牌方看见的是：为什么值得投入资源，以及投入后如何同时产生销售、传播与长期品牌价值。",
    )
    body(doc, "——完——", False)

    doc.save(OUT)
    print("saved", OUT)


if __name__ == "__main__":
    build()
