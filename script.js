{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // \uc0\u33410 \u27668 \u25968 \u25454  (\u31616 \u21270 \u28436 \u31034 )\
const solarTerms = [\
    "Lichun", "Yushui", "Jingzhe", "Chunfen", "Qingming", "Guyu",\
    "Lixia", "Xiaoman", "Mangzhong", "Xiazhi", "Xiaoshu", "Dashu",\
    "Liqiu", "Chushu", "Bailu", "Qiufen", "Hanlu", "Shuangjiang",\
    "Lidong", "Xiaoxue", "Daxue", "Dongzhi", "Xiaohan", "Dahan"\
];\
const lunarMonths = ["\uc0\u31471 \u26376 ", "\u26447 \u26376 ", "\u26691 \u26376 ", "\u27088 \u26376 ", "\u27060 \u26376 ", "\u33655 \u26376 ", "\u20848 \u26376 ", "\u26690 \u26376 ", "\u33738 \u26376 ", "\u38451 \u26376 ", "\u33901 \u26376 ", "\u33098 \u26376 "];\
\
// \uc0\u23395 \u33410 \u35799 \u35789 \
const poems = \{\
    spring: \{ cn: "\uc0\u39118 \u20256 \u33457 \u20449 \u65292 \u38632 \u28655 \u26149 \u23576 \u12290 ", en: "The wind carries word of blossoms; spring rain washes the world anew." \},\
    summer: \{ cn: "\uc0\u30887 \u28023 \u29983 \u20809 \u65292 \u38271 \u39118 \u24230 \u22799 \u12290 ", en: "Light glimmers on the sea; the long wind carries the summer through." \},\
    autumn: \{ cn: "\uc0\u26286 \u33394 \u21547 \u37329 \u65292 \u26408 \u21494 \u23558 \u36766 \u12290 ", en: "Dusk gilds the world in gold; the leaves prepare to leave." \},\
    winter: \{ cn: "\uc0\u19968 \u22812 \u38634 \u28145 \u65292 \u19975 \u29289 \u24402 \u34255 \u12290 ", en: "The night deepens with snow; all things return to stillness." \}\
\};\
\
// \uc0\u32972 \u26223 \u22270 \u21344 \u20301  (\u20320 \u21487 \u20197 \u26367 \u25442 \u25104  assets/ \u37324 \u30340 \u26412 \u22320 \u22270 \u29255 )\
const backgrounds = \{\
    spring: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",\
    summer: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",\
    autumn: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",\
    winter: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"\
\};\
\
// ----- \uc0\u20840 \u23616  DOM \u20803 \u32032  -----\
const modal = document.getElementById('season-selector');\
const sundial = document.getElementById('sundial-icon');\
const overlay = document.getElementById('entrance-overlay');\
const mainContent = document.getElementById('main-content');\
\
// ----- \uc0\u27169 \u24577 \u26694 \u25511 \u21046 \u65288 \u20840 \u23616 \u20989 \u25968 \u65292 \u20379 \u25353 \u38062 \u35843 \u29992 \u65289 -----\
function toggleModal() \{\
    if (modal) modal.classList.toggle('hidden');\
\}\
\
// ----- \uc0\u23395 \u33410 \u20999 \u25442 \u26680 \u24515 \u36923 \u36753  -----\
function setSeason(season) \{\
    document.body.className = `season-$\{season\}`;\
    \
    // \uc0\u26356 \u26032 \u32972 \u26223 \u22270 \
    const bgImg = document.querySelector('.bg-img');\
    if (backgrounds[season]) bgImg.src = backgrounds[season];\
    \
    // \uc0\u26356 \u26032 \u35799 \u35789 \
    const poemCn = document.getElementById('season-poem-cn');\
    const poemEn = document.getElementById('season-poem-en');\
    poemCn.textContent = poems[season].cn;\
    poemEn.textContent = poems[season].en;\
    \
    // \uc0\u20851 \u38381 \u27169 \u24577 \u26694 \
    toggleModal();\
\}\
\
// ----- \uc0\u26102 \u38388 \u19982 \u33410 \u27668 \u65288 \u31616 \u21270 \u28436 \u31034 \u65289 -----\
function initTime() \{\
    const now = new Date();\
    const year = now.getFullYear();\
    const month = now.getMonth() + 1;\
    const day = now.getDate();\
    \
    document.getElementById('solar-date').textContent = `$\{year\}.$\{String(month).padStart(2,'0')\}.$\{String(day).padStart(2,'0')\}`;\
    document.getElementById('current-lunar-month').textContent = lunarMonths[month - 1];\
    document.getElementById('solar-term').textContent = solarTerms[Math.floor((day / 30) * 24)] || "Chunfen";\
    \
    // \uc0\u33258 \u21160 \u21305 \u37197 \u23395 \u33410 \
    let autoSeason = "spring";\
    if (month >= 3 && month <= 5) autoSeason = "spring";\
    else if (month >= 6 && month <= 8) autoSeason = "summer";\
    else if (month >= 9 && month <= 11) autoSeason = "autumn";\
    else autoSeason = "winter";\
    \
    document.getElementById('current-season-text').textContent = \
        \{ spring:"\uc0\u20210 \u26149 ", summer:"\u20210 \u22799 ", autumn:"\u20210 \u31179 ", winter:"\u20210 \u20908 " \}[autoSeason];\
    \
    document.body.className = `season-$\{autoSeason\}`;\
    // \uc0\u21516 \u27493 \u35799 \u35789 \u21644 \u32972 \u26223 \
    setSeason(autoSeason);  // \uc0\u36991 \u20813 \u37325 \u22797 \u35843 \u29992 toggleModal\u65292 \u20294 \u27492 \u26102 modal\u36824 \u26410 \u26174 \u31034 \u65292 \u27809 \u20851 \u31995 \
\}\
\
// ----- \uc0\u20837 \u21475 \u21160 \u30011  -----\
function setupEntrance() \{\
    const btn = document.getElementById('unfold-btn');\
    btn.addEventListener('click', () => \{\
        overlay.style.opacity = '0';\
        setTimeout(() => \{\
            overlay.style.display = 'none';\
            mainContent.classList.add('main-visible');\
        \}, 1500);\
    \});\
\}\
\
// ----- \uc0\u26085 \u26231 \u25353 \u38062 \u30417 \u21548  -----\
function setupSundial() \{\
    if (sundial) \{\
        sundial.addEventListener('click', toggleModal);\
    \}\
    // \uc0\u20851 \u38381 \u25353 \u38062 \u22914 \u26524 \u23384 \u22312 \u20869 \u32852 onclick\u20250 \u35843 \u29992 \u20840 \u23616 toggleModal\u65292 \u26080 \u38656 \u39069 \u22806 \u22788 \u29702 \
\}\
\
// ----- \uc0\u21551 \u21160 \u19968 \u20999  -----\
document.addEventListener("DOMContentLoaded", () => \{\
    initTime();\
    setupEntrance();\
    setupSundial();\
\});}