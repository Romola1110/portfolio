#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Heytea × film commercial proposal Word doc."""

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = "/workspace/商业策划案_心中念你_喜茶×给阿嬷的情书.docx"


def set_run(run, size=12, bold=False, name="宋体", color=None):
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    if color:
        run.font.color.rgb = color


def P(doc, parts, *, first=False, center=False, after=6, before=0):
    """parts: list of (text, bold) or str"""
    p = doc.add_paragraph()
    if center:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    if first:
        p.paragraph_format.first_line_indent = Cm(0.74)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.line_spacing = 1.5
    if isinstance(parts, str):
        parts = [(parts, False)]
    for item in parts:
        if isinstance(item, str):
            t, b = item, False
        else:
            t, b = item
        r = p.add_run(t)
        set_run(r, 12, b)
    return p


def H(doc, text, level=1):
    sizes = {1: 16, 2: 14, 3: 12}
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14 if level == 1 else 10)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run(text)
    set_run(r, sizes.get(level, 12), True, "黑体")
    return p


def bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.line_spacing = 1.5
    if bold_prefix:
        r = p.add_run(bold_prefix)
        set_run(r, 12, True)
        r2 = p.add_run(text)
        set_run(r2, 12, False)
    else:
        r = p.add_run(text)
        set_run(r, 12, False)
    return p


def table(doc, headers, rows):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.style = "Table Grid"
    for i, h in enumerate(headers):
        cell = t.rows[0].cells[i]
        cell.text = ""
        r = cell.paragraphs[0].add_run(h)
        set_run(r, 11, True, "黑体")
    for ri, row in enumerate(rows):
        for ci, val in enumerate(row):
            cell = t.rows[ri + 1].cells[ci]
            cell.text = ""
            r = cell.paragraphs[0].add_run(val)
            set_run(r, 10.5, False)
    doc.add_paragraph()


def note(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("【数据说明】" + text)
    set_run(r, 10, False, "楷体", RGBColor(0x66, 0x66, 0x66))


def build():
    doc = Document()
    sec = doc.sections[0]
    sec.top_margin = Cm(2.3)
    sec.bottom_margin = Cm(2.3)
    sec.left_margin = Cm(2.8)
    sec.right_margin = Cm(2.8)
    normal = doc.styles["Normal"]
    normal.font.name = "宋体"
    normal.font.size = Pt(12)
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")

    # Cover
    for _ in range(2):
        doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("商业策划案")
    set_run(r, 14, False, "黑体")

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("《心中念你》")
    set_run(r, 22, True, "黑体")

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("喜茶 × 电影《给阿嬷的情书》联名企划")
    set_run(r, 16, True, "黑体")

    P(doc, "主宣传语：心中念你，便不觉远。", center=True)
    P(doc, "副句轮换：念你安康。｜切要平安。｜纸短情长。", center=True)
    P(doc, "提案用途：商业策划实习面试作业｜供导师审阅", center=True)
    P(doc, "版本说明：文中涉及票房、联名案例等均标注公开来源；未核实处标「待确认」，不作杜撰。", center=True)

    doc.add_page_break()

    # 0 Executive summary
    H(doc, "〇、一页执行摘要", 1)
    P(doc, [
        ("一句话：", True),
        ("把电影里那句「心中念你，便不觉远」落成一杯茶、一张短笺、一次轻声惦记——不教人完成「表达任务」，只给年轻人一个停下来念你的理由。", False),
    ], first=True)

    H(doc, "核心判断", 2)
    bullet(doc, "电影《给阿嬷的情书》以侨批为线索，讲的是山海之间的守望、代写代寄的情义，以及「报平安」式的日常牵挂——不是口号式告白。")
    bullet(doc, "公开报道显示：阿嬷手作、一杯潮茶等已与电影做过轻量联名并出圈；喜茶尚未与该片官联，但2025年联名已走向「少而精、偏治愈」。")
    bullet(doc, "本案不做复杂口味发明，而做：成熟茶底上的情绪命名 + 家书触点 + 观影票根接力 + 轻门店装置。")

    H(doc, "三板斧", 2)
    table(doc, ["板块", "内容"], [
        ["产品", "主推款「念你」：焙香红茶牛乳系；备选轻乳茶一款。供应链尽量复用喜茶现有茶底/奶基底。"],
        ["触点", "信封感杯套、随机短句杯身/杯套内侧、小票一句、重点门店「念你信箱」。"],
        ["联动", "凭电影票根购联名款赠家书卡/贴纸；1–2城轻快闪「收批处」；UGC#心中念你。"],
    ])

    H(doc, "建议成功指标（区间待双方校准，不写死虚假数字）", 2)
    bullet(doc, "销售：联名期联名套餐在重点城市门店的杯量与套餐售罄节奏（对照Chiikawa/星星人级周边热度，作内部对标，不作对外承诺）。")
    bullet(doc, "传播：话题阅读量、UGC投稿量、票根核销率、联名相关笔记/视频条数。")
    bullet(doc, "品牌：联名前后「温暖/思念/家」相关声量占比变化（可用社媒监测工具复盘）。")

    # 1 Background
    H(doc, "一、项目背景与机会", 1)
    H(doc, "1.1 电影侧：一部被侨批托住的黑马", 2)
    P(doc, [
        ("《给阿嬷的情书》", True),
        ("由蓝鸿春执导，2026年4月30日中国大陆上映，片长约118分钟，主要使用潮汕话等对白。影片讲述潮汕阿嬷叶淑柔半生守候，孙子远赴泰国寻亲，却揭开真相：多年来以阿公名义写信寄款的，是素未谋面的女子谢南枝——她在阿公离世后，以代写代寄撑起两头的家。", False),
    ], first=True)
    P(doc, [
        ("公开可核实信息（摘录）：", True),
        ("制作成本公开报道约为", False),
        ("1400万人民币", True),
        ("量级；上映后口碑强劲，豆瓣评分长期维持在", False),
        ("9.0以上", True),
        ("（开分约9.0，后有报道升至约9.1–9.2）；票房持续攀升，", False),
        ("2026年6月27日猫眼专业版口径下，上映59天总票房破19亿元", True),
        ("（36氪快讯）。维基百科词条亦收录总票房约18.52亿元等汇总口径——具体以猫眼/灯塔实时数据为准。", False),
    ], first=True)
    note(doc, "票房数字随时间变化。引用时请以提案当日猫眼/灯塔截图更新；本稿写明来源与时间节点，避免写成永恒定值。")

    P(doc, [
        ("对本案真正重要的，不是「又一部爆款」，而是它提供的可转化情感结构：", False),
    ], first=True)
    bullet(doc, "载体：侨批——信与钱合一，「见字如面」。")
    bullet(doc, "动作：寄出、等待、代寄——情义可以替人完成。")
    bullet(doc, "语气：不吼爱，报平安——「念你安康」「切要平安」「纸短情长」。")
    bullet(doc, "余味：走出影院后，情绪还需要一个轻出口。阿嬷手作「票根→一杯茶→侨批卡」已验证这条路径。")

    H(doc, "1.2 电影已有联名先例（必须写进案，证明非空想）", 2)
    P(doc, "据界面新闻、36氪、SocialBeta等公开报道，电影宣发期出现过一批偏「情义互助」的合作，而非传统高额冠名：", first=True)
    table(doc, ["品牌", "公开可见的合作形态", "可借鉴点"], [
        ["一杯潮茶（汕头本土茶饮）", "发行相关邀约；资源互换（片尾露出↔门店宣传）；联名杯套、冰箱贴；路演送饮；观影相关套餐", "轻包材、互宣、观影场景衔接"],
        ["阿嬷手作", "联名饮品「柑榄与单丛」（橄榄、油柑、单丛等）；侨批/家书信卡周边；凭票根优惠（报道称19.9元档）；母亲节等节点联动", "风物入味+侨批周边+票根机制"],
        ["陈记顺和等本地餐饮", "海报露出、票根福利、路演供餐", "低成本本地情义赞助"],
        ["潮汕文旅", "取景地打卡、「跟着阿嬷游」类线路、侨批馆等参观升温（地方媒体/税务相关报道有提及）", "电影→日常场景转化"],
    ])
    P(doc, [
        ("结论：", True),
        ("「杯套、家书卡、票根福利」已被市场验证。本案不是发明机制，而是把已验证机制放到喜茶的全国门店网络上放大。", False),
    ], first=True)

    H(doc, "1.3 喜茶侧：联名策略与空白点", 2)
    P(doc, [
        ("据深圳新闻网、广告门等2025年末消费观察：喜茶联名从高频转向", False),
        ("「降频提质」", True),
        ("；有报道称2025年联名频率从早年高峰期的较高频次，收敛到全年约", False),
        ("两次IP联名", True),
        ("——公开点名的是", False),
        ("CHIIKAWA（吉伊卡哇）", True),
        ("与", False),
        ("泡泡玛特星星人", True),
        ("，强调治愈、情感与品牌契合，并出现主题店、包材周边、快闪等组合拳；星星人联名还被表述为喜茶", False),
        ("首个全球同步上线", True),
        ("的联名之一。", False),
    ], first=True)
    P(doc, [
        ("与电影关系：", True),
        ("检索公开报道，", False),
        ("未见喜茶与《给阿嬷的情书》的官方联名", True),
        ("；存在因潮汕原料/命名等引发的网友联想与催联名讨论。本案定位为：", False),
        ("填补「全国级茶饮 × 爆款侨批电影」的官方空白", True),
        ("，同时对齐喜茶「少而精、偏温暖」的既有选择逻辑。", False),
    ], first=True)
    note(doc, "「催联名」属舆论现象，不作「已有合作」表述。提案中禁止写「喜茶已官宣合作」。")

    # 2 Goals
    H(doc, "二、合作目标与KPI框架", 1)
    H(doc, "2.1 四方目标（若仅两方合作，可删减）", 2)
    table(doc, ["角色", "目标"], [
        ["喜茶", "强化「会念你、有温度」的品牌感知；获得有质量的情感内容资产；拉动联名期到店与套餐转化。"],
        ["电影/IP方", "长尾期持续触达未观影或已观影人群；把「情书/侨批」从银幕延到日常；合规授权金句与物料。"],
        ["消费者", "获得一次不尴尬的惦记方式；可拍照、可带走、可投递的轻仪式。"],
        ["内容/商业中介（若有）", "可包装成可售卖的内容合作单元：专题、短片、沙龙、品牌内容包。"],
    ])

    H(doc, "2.2 KPI（只写框架与对标逻辑，具体数字由品牌后台校准）", 2)
    table(doc, ["指标类型", "建议监测项", "说明"], [
        ["销售", "联名套餐杯量、套餐售罄时长、客单价变化、票根核销张数", "不对媒体承诺虚高杯量"],
        ["到店", "主题店打卡量、快闪预约到店率、联名期门店排队相关UGC", "对标喜茶过往主题店打卡逻辑"],
        ["传播", "主话题阅读/讨论、二级话题、官方笔记互动、KOL投放ROI", "以平台后台为准"],
        ["品牌", "联名相关评论情感倾向、「念你/阿嬷/家」关键词占比", "可用第三方监测"],
    ])

    # 3 Strategy
    H(doc, "三、核心策略与主题文案", 1)
    H(doc, "3.1 洞察", 2)
    P(doc, "电影打动人的，往往不是一句「我爱你」，而是侨批里那些克制的话：报平安、念安康、纸短情长。今天的年轻人同样难当面说重话，却愿意在一杯茶、一条短句里停一下。", first=True)
    P(doc, [
        ("洞察一句话：", True),
        ("人们缺的不是更大的告白，而是一个被允许的、轻的「念你」。", False),
    ], first=True)

    H(doc, "3.2 主题体系（人话，非口号堆砌）", 2)
    table(doc, ["层级", "文案", "用途"], [
        ["企划名", "《心中念你》", "封面、对内项目名"],
        ["主宣传语", "心中念你，便不觉远。", "主KV（拟授权使用/化用电影金句）"],
        ["产品名", "念你", "菜单主推款"],
        ["副句（轮换）", "念你安康。／切要平安。／纸短情长。", "杯套内侧、小票、海报小字"],
        ["门店一句", "喝杯茶，念一念家里的人。", "店员话术、易拉宝"],
        ["互动说明", "写给阿嬷、奶奶、外婆，或你心里惦记的那个人。", "信箱旁，扩参与、不改主题"],
    ])
    P(doc, [
        ("授权提示：", True),
        ("「心中念你，便不觉远」「切要平安」等若作主视觉，需电影/片方书面授权；未授权前对外可用化用短句「念你。」「先报平安。」并在物料标注联名关系。", False),
    ], first=True)

    H(doc, "3.3 为何不是「写给所有爱人」", 2)
    P(doc, "主锚仍是阿嬷/隔代惦记，与片名、侨批、已有联名心智一致。参与圈用门店说明柔扩，避免变成任何品牌都能做的泛爱营销。", first=True)

    # 4 Product
    H(doc, "四、联名产品设计", 1)
    H(doc, "4.1 设计原则（落地关键句）", 2)
    P(doc, [
        ("产品不强调复杂原料创新，而强调熟悉感与情绪命名。", True),
        ("优先调用喜茶现有成熟茶底、奶基底与小料系统，降低研发与供应链成本，提高上线效率；用命名、杯身与包材放大电影「念你／平安／纸短情长」的价值，使产品本身成为介质。", False),
    ], first=True)
    P(doc, [
        ("与阿嬷手作「柑榄与单丛」的差异：", True),
        ("对方强在地风物（橄榄、油柑、单丛），适合区域情感茶饮；喜茶全国门店更适合", False),
        ("温和、好复购、易标准化", True),
        ("的牛乳茶路径。若双方愿意做「彩蛋款」，可再议一款轻风物向（须供应链评估），不作主推必需。", False),
    ], first=True)

    H(doc, "4.2 产品方案", 2)
    table(doc, ["款式", "命名", "方向", "逻辑"], [
        ["主推", "念你", "焙香红茶 + 牛乳 + 黑糖波波/米麻薯等成熟小料（具体配方由喜茶研发定）", "温暖、熟悉、好描述"],
        ["备选", "念你安康（轻乳）", "桂花乌龙或清爽轻乳路线", "春夏、偏女频传播"],
    ])
    P(doc, "菜单描述示例（人话）：念你——喝起来像一句没说重的惦记。", first=True)

    H(doc, "4.3 定价与机制（原则，非杜撰价）", 2)
    bullet(doc, "定价落入喜茶常规联名套餐带（以品牌现行价格带为准，本稿不编造具体价格）。")
    bullet(doc, "建议保留「票根福利」：凭《给阿嬷的情书》票根购买联名款，赠家书卡或贴纸——机制已有公开先例（阿嬷手作票根优惠报道）。")
    bullet(doc, "周边套餐：低成本明信片/贴纸随套餐；搪瓷杯等作为加价购或限量，控制SKU。")

    # 5 Touchpoints
    H(doc, "五、包材与门店触点", 1)
    P(doc, "电影联名的高潮往往在触点，不在发明口味。", first=True)
    H(doc, "5.1 杯套", 2)
    bullet(doc, "外侧：心中念你，便不觉远。（或「念你」大字）")
    bullet(doc, "内侧短句轮换（示例，需过审）：念你安康。／切要平安。／纸短情长。／展信安康（若授权）。")
    H(doc, "5.2 小票", 2)
    bullet(doc, "底部一行：喝完，给家里报个平安。／念你安康。")
    H(doc, "5.3 重点门店「念你信箱」", 2)
    bullet(doc, "购联名款可领一张短笺：可带走、可贴墙、可投入信箱。")
    bullet(doc, "不强制只写阿嬷：写给阿嬷/长辈/心里惦记的人。")
    bullet(doc, "执行：先10–20家商场大店/旗舰店，不全国硬装改造。")
    H(doc, "5.4 「代写一杯」（贴南枝线，可选）", 2)
    P(doc, "两人同行，可请店员协助在杯套内侧印/贴一句「替他说」。呼应电影里代写代寄的情义，降低「我写不出来」的门槛。", first=True)

    # 6 Offline
    H(doc, "六、线下与观影联动", 1)
    H(doc, "6.1 轻快闪：收批处（1–2城即可）", 2)
    P(doc, "场景：小信箱、木桌、台灯、家书墙——不做沉重「南洋剧情馆」。城市建议上海（媒体）、广州或深圳（饮茶与情感接受度高）。拍照打卡发布主话题可抽官方二创。", first=True)
    H(doc, "6.2 观影票根路径（强烈建议保留）", 2)
    P(doc, "影院完成情感唤起 → 票根作为接力 → 喜茶门店承接余韵。这是阿嬷手作案例里被反复讨论的有效结构，全国连锁更能放大核销面。", first=True)
    H(doc, "6.3 不建议", 2)
    bullet(doc, "全国同步重装「阿嬷家客厅」。")
    bullet(doc, "多城大规模快闪同时铺开（预算与控场风险高）。")

    # 7 Merch
    H(doc, "七、周边", 1)
    table(doc, ["优先级", "物品", "理由"], [
        ["必做", "家书明信片/短笺套组", "低成本、强贴片、易UGC；对标侨批卡逻辑"],
        ["必做", "贴纸包", "低成本赠品"],
        ["可选", "搪瓷杯/玻璃杯（印「念你」）", "收藏向加价购"],
        ["不做", "与电影弱相关的杂货造型挂件", "稀释IP，增加库存风险"],
    ])

    # 8 Comms
    H(doc, "八、传播策略", 1)
    H(doc, "8.1 总原则", 2)
    P(doc, "不追「好喝测评」做唯一主线，而追「我念了谁」的真实句子。短视频镜头：捧杯、写短笺、投信箱、票根与杯并置。", first=True)
    H(doc, "8.2 节奏", 2)
    table(doc, ["阶段", "动作"], [
        ["预热", "喜茶×电影双官号预告；释出海报句「心中念你，便不觉远。」；征集「一句念你」短文案"],
        ["爆发", "门店实拍、写信过程、KOL（情感/生活方式/电影/探店）；主话题#心中念你；副话题#念你安康"],
        ["长尾", "精选用户句子做二创长图/H5「许多句念你」；与电影长尾、重映或衍生节点再借势"],
    ])
    H(doc, "8.3 与三联气质的接合点（若提案面向媒体商业岗）", 2)
    P(doc, "可延展为人物故事向内容：用户短笺精选、侨批文化短讲、主创对谈——偏真实情感与文化记忆，而非纯促销信息流。具体是否由三联承接，待确认提案立场。", first=True)

    # 9 Commercial viability
    H(doc, "九、为什么具备商业落地性", 1)
    bullet(doc, "产品开发轻量：复用成熟茶底与小料，情绪在命名与包材。", "1. ")
    bullet(doc, "门店执行轻量：杯套、小票、海报、信箱卡，非全国硬装。", "2. ")
    bullet(doc, "机制有先例：票根、侨批卡、杯套互宣已在电影联名中出现并出圈（公开报道）。", "3. ")
    bullet(doc, "对齐喜茶策略：情感型、少而精；补「与该电影官联」空白。", "4. ")
    bullet(doc, "短长兼顾：短期套餐与到店；长期沉淀「念你」内容资产，可复用于重阳/母亲节等节点。", "5. ")

    # 10 Timeline risk
    H(doc, "十、排期、预算原则与风险", 1)
    H(doc, "10.1 排期逻辑（待确认档期）", 2)
    P(doc, "电影已于2026年4月30日上映并进入长尾。联名更适合「长尾情感复购」或绑定重映/衍生品/节日（中秋、重阳、春节归乡、翌年母亲节），而非假装仍在点映周。具体窗口需与片方宣发与喜茶档期共同确认。", first=True)
    table(doc, ["周次", "事项"], [
        ["T-4～T-3", "授权谈判、金句与物料过审、配方封样、包材印刷"],
        ["T-2", "预热物料、KOL确认、重点店装置进场"],
        ["T-0～T+2", "上线爆发、票根核销、内容日更"],
        ["T+3～T+6", "长尾二创、库存消化、复盘报告"],
    ])

    H(doc, "10.2 预算原则（不编造总额）", 2)
    bullet(doc, "大头通常在：授权、包材加印、重点店装置、投放与KOL、周边生产。")
    bullet(doc, "可省：全国硬装、重剧情快闪、过多SKU。")
    bullet(doc, "提案阶段用「低/中/高三档」内部估算表，数字由喜茶商业侧填写。")

    H(doc, "10.3 风险与备选", 2)
    table(doc, ["风险", "应对"], [
        ["金句未授权", "主视觉改用「念你。」「先报平安。」联名关系仍清晰"],
        ["口味争议", "主推熟悉牛乳茶；风物彩蛋款小范围测试"],
        ["舆情（代际/地域刻板）", "文案避免消费苦难；强调惦记与平安，不卖惨"],
        ["档期错位", "明确长尾定位；与文旅/重映节点合流"],
        ["与阿嬷手作心智撞车", "差异化：全国标准化「念你」牛乳茶路径，不做区域风物主推"],
    ])

    # 11 Film understanding
    H(doc, "十一、附录：电影理解（供文案与过审对齐）", 1)
    P(doc, "本附录帮助执行团队避免把电影扁平成「对奶奶说爱」。", first=True)
    bullet(doc, "主线情感：隔代与夫妻的守望；更意外的一层是南枝的情义——不是血缘，是十八年的代寄。")
    bullet(doc, "核心器物：侨批（银信）——通信与汇款的合体，是叙事引擎也是情感伦理。")
    bullet(doc, "语言气质：潮汕方言、克制、烟火；金句古雅如「江海万里，心中念你，便不觉远」。")
    bullet(doc, "商业转化友好点：走出影院后的余韵需要「轻出口」——茶、短笺、票根，已被先例验证。")
    bullet(doc, "忌讳：戏说历史苦难、消费「下南洋」猎奇、用杂货怀旧冒充潮汕文化。")

    # 12 Pitch
    H(doc, "十二、面试口述稿（约60秒）", 1)
    P(doc, "我理解题目不是做一杯好看的联名奶茶，而是把《给阿嬷的情书》里「念你、报平安、纸短情长」的语气，接到喜茶能全国落地的产品与门店上。", first=True)
    P(doc, "公开信息里，阿嬷手作、一杯潮茶已经用杯套、侨批卡、票根证明了轻量联名能出圈；喜茶2025年联名也更偏少而精、治愈向，但和这部电影还没有官联——这是机会。", first=True)
    P(doc, "我的主题是《心中念你》。主句用电影里观众记住的那句：「心中念你，便不觉远。」产品叫「念你」，口味走熟悉的红茶牛乳，不硬造供应链。真正发力的是杯套、小票、信箱短笺，还有票根从影院接到门店。参与时可以写给阿嬷，也可以写给心里惦记的人——主题不散，门口却不窄。", first=True)
    P(doc, "这不是教人完成表达，只是请人喝杯茶，轻轻念一念。", first=True)

    # 13 Questions
    H(doc, "十三、待你确认的问题（不确定处，请回复后可改第二版）", 1)
    bullet(doc, "提案立场：以喜茶视角、电影IP视角，还是三联商业/内容中介视角撰写？影响「我们卖什么合作包」。")
    bullet(doc, "上线窗口：按长尾情感（例如中秋/重阳/春节），还是绑定某一宣发节点？")
    bullet(doc, "主宣传语是否争取授权原句「心中念你，便不觉远」？还是只用化用「念你」？")
    bullet(doc, "对外项目名用「阿嬷」（与片名一致）还是你习惯的「阿嫲」？")
    bullet(doc, "是否需要写进预算数字区间？若需要，你期望的量级大致是区域试点还是全国？")
    bullet(doc, "观影票根：是否默认全国核销，还是先一线/华南试点？")
    bullet(doc, "是否要单独一页「三联可提供的内容清单」（专题/沙龙/短视频）？")

    H(doc, "主要公开来源（撰写时参考，答辩可备查）", 2)
    bullet(doc, "电影信息：维基百科词条《给阿嬷的情书》；豆瓣条目；新华网等关于侨批与金句的报道。")
    bullet(doc, "票房：36氪等援引猫眼专业版「破19亿」快讯；维基汇总口径；请以提案日实时数据更新。")
    bullet(doc, "电影联名：界面新闻、36氪关于一杯潮茶/阿嬷手作；SocialBeta等关于柑榄与单丛、票根机制。")
    bullet(doc, "喜茶联名：深圳新闻网、广告门、Brandstar/FoodTalks等关于2025 Chiikawa、星星人及降频提质策略。")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    r = p.add_run("—— 完 ——")
    set_run(r, 12, False)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.save(OUT)
    print("Saved", OUT)


if __name__ == "__main__":
    build()
