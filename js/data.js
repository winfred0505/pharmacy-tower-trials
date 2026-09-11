/**
 * 藥王之塔與三重聖劑的藥學試煉 - 全域資料庫與劇本
 */
const GAME_DATA = {
    // 角色設定
    characters: {
        king: {
            name: "藥王國王・奧勒留",
            title: "艾斯庫拉庇俄斯之守護者",
            avatar: "./images/characters/npc_king.jpg"
        },
        princess: {
            name: "聖藥司祭・艾麗莎公主",
            title: "王立臨床藥學首席導師",
            avatar: "./images/characters/npc_princess.jpg"
        },
        weaponsmith: {
            name: "機關鍛造大師・伏爾坎",
            title: "冷鏈溫控與給藥裝置宗師",
            avatar: "./images/characters/npc_weaponsmith.jpg"
        },
        merchant: {
            name: "草藥調配商・莫瑟",
            title: "王立藥典審核顧問",
            avatar: "./images/characters/npc_villager_merchant.jpg"
        },
        innkeeper: {
            name: "急診驛站長・巴倫",
            title: "臨床處方與衛教顧問",
            avatar: "./images/characters/npc_innkeeper.jpg"
        },
        // 首領 (三大魔神)
        boss_diabetes: {
            id: "diabetes",
            name: "糖魔領主・格魯科斯",
            title: "高血糖與胰島衰竭之化身",
            avatar: "./images/characters/糖尿病 (Diabetes).jpg",
            maxHp: 100,
            weakness: "雙重腸泌素促效 (GIP/GLP-1 RA)",
            lore: "操縱難以馴服的高血糖烈焰，以胰島素阻抗為盾，令周邊微血管與大血管陷入糖化終產物（AGEs）沉積之苦。"
        },
        boss_obesity: {
            id: "obesity",
            name: "脂縛巨獸・阿迪波斯",
            title: "內臟脂肪與慢性發炎魔獸",
            avatar: "./images/characters/肥胖 (Obesity).jpg",
            maxHp: 120,
            weakness: "高劑量胜肽燃脂 (GLP-1 RA 2.4mg)",
            lore: "由數百年堆疊的過剩熱量與內臟脂肪凝聚而成，能施放飽足感麻痺毒霧，使宿主陷入動脈硬化與心血管衰竭危機。"
        },
        boss_lipid: {
            id: "hyperlipidemia",
            name: "凝血妖皇・動脈血煞",
            title: "致動脈硬化 LDL-C 斑塊之禍端",
            avatar: "./images/characters/高血脂 (Hyperlipidemia).jpg",
            maxHp: 150,
            weakness: "小干擾核糖核酸 (GalNAc-siRNA)",
            lore: "以循環血液中的低密度脂蛋白（LDL-C）為食，催生大量 PCSK9 吞噬並摧毀肝臟清除受體，令全身管壁狹窄鈣化。"
        }
    },

    // 道具與聖劑圖鑑
    items: {
        grimoire: {
            id: "grimoire",
            name: "《藥王寶典》",
            category: "神器",
            icon: "./images/items/藥典 (Pharmacopoeia Medical Grimoire).jpg",
            desc: "記載王國數千年藥學仿單、機轉圖解與臨床試驗指引的聖典。點擊右上角隨時查閱解謎線索。"
        },
        mounjaro: {
            id: "mounjaro",
            name: "猛健樂® (MOUNJARO®)",
            category: "第一重聖劑",
            icon: "./images/items/猛健樂® (MOUNJARO®) - 雙效融合注射筆.jpg",
            desc: "雙重腸泌素受體促效劑 (Tirzepatide)。同時激動 GIP 與 GLP-1 受體，強效降糖、促胰島素分泌並延遲胃排空。"
        },
        wegovy: {
            id: "wegovy",
            name: "週纖達® (Wegovy®)",
            category: "第二重聖劑",
            icon: "./images/items/週纖達® (Wegovy®) - 輕盈塑型筆.jpg",
            desc: "高劑量類升糖素胜肽-1受體促效劑 (Semaglutide 2.4mg)。抑制下視丘食慾中樞，榮獲 SELECT 試驗證實降 20% MACE。"
        },
        leqvio: {
            id: "leqvio",
            name: "健妥適® (Leqvio®)",
            category: "第三重聖劑",
            icon: "./images/items/樂脂益® (Leqvio®) - 降脂破甲針.jpg",
            desc: "首創 GalNAc 共軛雙鏈 siRNA (Inclisiran)。專一靶向肝細胞 ASGPR，降解 PCSK9 mRNA，長效半年給藥一次。"
        },
        sword_starfall: {
            id: "sword_starfall",
            name: "星隕之劍",
            category: "武器",
            icon: "./images/weapons/weapon_sword_starfall.jpg",
            desc: "以星辰秘銀鍛造，能將正確的藥學推論化為神聖劍氣斬擊魔神。"
        },
        shield_primeval: {
            id: "shield_primeval",
            name: "原始之盾",
            category: "防具",
            icon: "./images/weapons/weapon_shield_primeval.jpg",
            desc: "以天然草藥精華浸潤的古木盾牌，阻擋禁忌症與致命處方警報。"
        },
        frost_lotus: {
            id: "frost_lotus",
            name: "冰霜雪蓮",
            category: "靈草",
            icon: "./images/herbs/herb_frost_lotus.jpg",
            desc: "生長於永凍冰峰，散發穩定 2°C ~ 8°C 的極致低溫，為冷鏈保存的核心藥引。"
        },
        golden_lotus: {
            id: "golden_lotus",
            name: "金線蓮",
            category: "靈草",
            icon: "./images/herbs/herb_golden_thread_lotus.jpg",
            desc: "王國秘傳的清熱解毒甘露，常用於舒緩腸胃道不適與代謝失衡。"
        },
        herb_blood_dragon_ginseng: {
            id: "herb_blood_dragon_ginseng",
            name: "血龍參",
            category: "靈草",
            icon: "./images/herbs/herb_blood_dragon_ginseng.jpg",
            desc: "吸納大地精華的珍稀靈草，能貫通血脈經絡，輔助強化降血脂療效。"
        }
    },

    // 仿單神諭手冊（點擊「藥王聖典」可查閱）
    grimoireData: [
        {
            title: "【聖劑一】猛健樂® (Tirzepatide KwikPen)",
            sections: [
                {
                    heading: "❄️ 冷鏈溫層與極限規範",
                    content: "• 未開封時必須避光冷藏於 2°C 至 8°C，絕不可冷凍！若曾結冰，必須立即報廢。<br>• 攜帶出門或使用中，最高可在 30°C 的室溫下存放長達 30 天（口訣：30度30天）。"
                },
                {
                    heading: "💉 注射筆規格與排氣步驟",
                    content: "• 每支 KwikPen 含有 4 劑固定劑量，每劑固定注射容積為 0.6 mL。<br>• 首次使用新筆必須進行排氣檢查（灌注）：旋轉旋鈕聽見 2 聲喀響（劑量視窗呈現長線條），壓到底需看見針尖滲出藥液水滴。<br>• 推注到底時劑量視窗必須歸「0」，默數 5 秒後拔針；注射後嚴禁將針頭留在筆上，應立即卸下丟棄於防穿刺收集盒。"
                },
                {
                    heading: "⚠️ 黑框警語與絕對禁忌症",
                    content: "• 黑框警語：在齧齒類動物試驗中具有甲狀腺 C 細胞腫瘤（包括 MTC）風險。<br>• 絕對禁用於：個人或家族有甲狀腺髓質癌（MTC）病史，或第二型多發性內分泌腫瘤綜合症（MEN 2）患者。"
                },
                {
                    heading: "📈 劑量階梯與用藥衛教",
                    content: "• 起始劑量為每週一次 2.5 mg（持續 4 週），不可作為長期維持劑量！後續每 4 週以 2.5 mg 為單位調升，每週上限為 15 mg。<br>• 漏藥：在 4 天（96 小時）內儘快補打；若超過 4 天則跳過該劑。改期兩劑間至少間隔 3 天（72 小時）。<br>• 口服避孕藥患者：因本品具延遲胃排空作用，起始使用或每次加量時，應加用屏障避孕（如保險套）4 週。<br>• 與胰島素併用：嚴禁混於同一針筒，可注射於同一部位（如腹部），但注射點絕不可緊鄰。"
                }
            ]
        },
        {
            title: "【聖劑二】週纖達® (Semaglutide 2.4mg Wegovy)",
            sections: [
                {
                    heading: "🎯 適應症與 BMI 門檻",
                    content: "• 成人慢性體重控制：初始 BMI ≥ 30 kg/m²（肥胖），或 BMI ≥ 27 至 < 30 kg/m²（過重）且伴隨至少一項體重相關共病（如高血壓、第2型糖尿病、血脂異常、阻塞性睡眠呼吸中止或心血管疾病）。<br>• 心血管效益（SELECT 試驗）：在已有心血管疾病的過重/肥胖成人中，證實降低 20% 的重大心血管不良事件（MACE）風險。"
                },
                {
                    heading: "🪜 5 階梯劑量滴定時程",
                    content: "• 第 1～4 週：0.25 mg/週<br>• 第 5～8 週：0.5 mg/週<br>• 第 9～12 週：1.0 mg/週<br>• 第 13～16 週：1.7 mg/週<br>• 第 17 週起：2.4 mg/週（維持維持劑量）<br>• 若患者在調升劑量時遭遇嚴重腸胃道反應（噁心、嘔吐），可考慮暫緩調升，維持原劑量 2～4 週。"
                },
                {
                    heading: "⚠️ 安全警告與臨床衛教",
                    content: "• 警惕急性胰臟炎：若出現劇烈、持續並放射至背部之上腹痛應立即停藥。<br>• 快速減重可能伴隨膽囊疾病（膽結石/膽囊炎），提醒病患補充水分、避免暴飲暴食及高油飲食。"
                }
            ]
        },
        {
            title: "【聖劑三】健妥適® (Inclisiran Leqvio)",
            sections: [
                {
                    heading: "🧬 首創 GalNAc-siRNA 機轉",
                    content: "• 結構共軛三觸角 N-乙醯半乳糖胺（GalNAc），特異性結合肝細胞表面之去唾液酸糖蛋白受體（ASGPR），精準內吞入肝。<br>• 進入細胞質結合 RISC，專一性切割降解 PCSK9 mRNA，阻斷 PCSK9 蛋白生成。<br>• 肝表面 LDLR 避免被分解，循環回收清除循環血液中 LDL-C，降幅達 ~50%。"
                },
                {
                    heading: "🗓️ 超長效給藥時程與保存",
                    content: "• 醫事人員皮下注射（預充填 284 mg/1.5 mL）：第 1 天給予首劑，第 3 個月（第 90 天）給予第二劑，其後每 6 個月注射一次（維持期每年僅需兩針！）。<br>• 獨特儲存優勢：存放於 25°C 以下常溫即可，不需冷藏，嚴禁冷凍！"
                },
                {
                    heading: "📊 臨床定位（ORION 研究計畫）",
                    content: "• 於 ORION-9（HeFH）、ORION-10 與 ORION-11（ASCVD）研究中，證實能在高強度 Statin 與 Ezetimibe 基礎上，持續穩定降低 LDL-C 約 50%。"
                }
            ]
        }
    ],

    // 五大章節劇情與關卡
    chapters: [
        {
            id: 0,
            code: "PROLOGUE",
            title: "序章：冒險啟程・王立藥學契約",
            badge: "序章 / 4",
            bgImage: "./images/scenes/village.jpg",
            guideNpc: "king",
            introDialog: [
                "年輕的藥學勇者啊，歡迎來到王立藥學院前哨！",
                "遠方的古代『藥王之塔』封印正劇烈震顫，三大代謝魔神——糖尿病、肥胖症、高血脂正在世間蔓延災厄！",
                "唯有能精通『三重聖劑』之冷鏈、裝置、劑量階梯與 RNAi 機轉的藥師，才能登上塔頂，淨化代謝魔神！",
                "接下這本《藥王寶典》與冒險裝備，點擊場景中的物件展開你的藥學試煉吧！"
            ],
            hotspots: [
                {
                    id: "hs_grimoire",
                    name: "《藥王寶典》石台",
                    x: "28%",
                    y: "48%",
                    icon: "📖",
                    type: "loot",
                    itemKey: "grimoire",
                    message: "你拾取了《藥王寶典》！隨時可點選右上角『📖 藥王聖典』查閱各藥品仿單與機轉細節。"
                },
                {
                    id: "hs_equipment",
                    name: "王國軍械架",
                    x: "72%",
                    y: "46%",
                    icon: "⚔️",
                    type: "loot",
                    itemKey: "sword_starfall",
                    secondItemKey: "shield_primeval",
                    message: "你裝備了【星隕之劍】與【原始之盾】！攻擊力與守護力大幅提升！"
                },
                {
                    id: "hs_tower_gate",
                    name: "發條藥王之塔大門",
                    x: "50%",
                    y: "28%",
                    icon: "🚪",
                    type: "transition",
                    requires: ["grimoire", "sword_starfall"],
                    reqHint: "請先拾取《藥王寶典》與《星隕之劍》，做好充足準備再來開啟塔門！",
                    nextChapter: 1
                }
            ]
        },
        {
            id: 1,
            code: "CHAPTER_1",
            title: "第壹章：雙重腸泌之鑰・降糖試煉",
            badge: "第 1 / 4 章",
            bgImage: "./images/scenes/abyss_labyrinth.jpg",
            guideNpc: "weaponsmith",
            introDialog: [
                "這裡是藥王之塔第一層——深淵糖魔地宮！",
                "我是機關鍛造大師伏爾坎。守護此層的『糖魔領主』掌握高血糖魔炎，必須以第一重聖劑【猛健樂® (Tirzepatide)】將其擊潰！",
                "但在此之前，你必須先解開冷鏈冰窖的極限密碼，並掌握 KwikPen 機械排氣與禁忌症核方！"
            ],
            hotspots: [
                {
                    id: "hs_cold_storage",
                    name: "極寒冷鏈保溫櫃",
                    x: "24%",
                    y: "48%",
                    icon: "❄️",
                    type: "puzzle",
                    puzzleId: "cold_chain_puzzle",
                    desc: "閃爍著藍光的冷鏈密碼鎖，鎖定著猛健樂的低溫庫存。"
                },
                {
                    id: "hs_kwikpen_mechanic",
                    name: "KwikPen 注射器校正台",
                    x: "75%",
                    y: "48%",
                    icon: "💉",
                    type: "puzzle",
                    puzzleId: "kwikpen_puzzle",
                    desc: "散落著針頭、劑量旋鈕與排氣水滴的機械儀表。"
                },
                {
                    id: "hs_boss_diabetes",
                    name: "糖魔領主之封印祭壇",
                    x: "50%",
                    y: "28%",
                    icon: "👹",
                    type: "boss",
                    bossId: "boss_diabetes",
                    requiresPuzzle: ["cold_chain_puzzle", "kwikpen_puzzle"],
                    reqHint: "必須先解開【冷鏈保溫櫃】與【KwikPen 校正台】的謎題，才能激活第一重聖劑挑戰糖魔！"
                }
            ]
        },
        {
            id: 2,
            code: "CHAPTER_2",
            title: "第貳章：晨曦淨化之風・燃脂試煉",
            badge: "第 2 / 4 章",
            bgImage: "./images/scenes/dark_forest.jpg",
            guideNpc: "merchant",
            introDialog: [
                "恭喜踏入第二層——暗影迷霧之森！",
                "我是草藥調配商莫瑟。此地盤踞著以暴食與內臟脂肪為食的『脂縛巨獸』！",
                "能克制巨獸的唯有第二重聖劑【週纖達® (Wegovy®)】的高劑量 GLP-1 燃脂颶風！",
                "請先在林中勘查肥胖共病檢驗單，並排定嚴謹的 5 階梯劑量滴定路徑，防範腸胃道反撲！"
            ],
            hotspots: [
                {
                    id: "hs_bmi_criteria",
                    name: "肥胖共病診斷案台",
                    x: "24%",
                    y: "48%",
                    icon: "📋",
                    type: "puzzle",
                    puzzleId: "bmi_criteria_puzzle",
                    desc: "記錄著 BMI 數據與心血管共病（高血壓、血脂異常、OSA）的病歷卷軸。"
                },
                {
                    id: "hs_titration_ladder",
                    name: "五階晨曦劑量天秤",
                    x: "76%",
                    y: "48%",
                    icon: "⚖️",
                    type: "puzzle",
                    puzzleId: "titration_ladder_puzzle",
                    desc: "需要按週數精準依序擺放 0.25mg 至 2.4mg 劑量水晶的神奇天秤。"
                },
                {
                    id: "hs_boss_obesity",
                    name: "脂縛巨獸巢穴",
                    x: "50%",
                    y: "28%",
                    icon: "🐗",
                    type: "boss",
                    bossId: "boss_obesity",
                    requiresPuzzle: ["bmi_criteria_puzzle", "titration_ladder_puzzle"],
                    reqHint: "必須先完成【肥胖共病診斷】與【五階劑量天秤】的試煉，方能喚醒週纖達全力戰鬥！"
                }
            ]
        },
        {
            id: 3,
            code: "CHAPTER_3",
            title: "第叁章：寂靜基因之矢・降脂試煉",
            badge: "第 3 / 4 章",
            bgImage: "./images/scenes/volcano.jpg",
            guideNpc: "innkeeper",
            introDialog: [
                "勇者，你已來到第三層——熔岩赤核與調劑聖所！",
                "我是急診驛站長巴倫。守關的『凝血妖皇』利用體內大量 PCSK9 摧毀 LDL 受體，令動脈如熔岩般凝結硬化斑塊！",
                "對付它，我們需要第三重聖劑——以小干擾核糖核酸為矛的【健妥適® (Leqvio®)】！",
                "請梳理 GalNAc 靶向進入肝細胞的沉默路徑，並牢記一年僅需兩針的長效守護時程！"
            ],
            hotspots: [
                {
                    id: "hs_rnai_mechanism",
                    name: "siRNA 基因沉默儀式盤",
                    x: "25%",
                    y: "48%",
                    icon: "🔬",
                    type: "puzzle",
                    puzzleId: "rnai_mechanism_puzzle",
                    desc: "雕刻著 GalNAc、ASGPR 受體、RISC 複合物與 PCSK9 mRNA 降解步驟的古代符文盤。"
                },
                {
                    id: "hs_leqvio_schedule",
                    name: "半載給藥日晷與溫控石",
                    x: "75%",
                    y: "48%",
                    icon: "⏳",
                    type: "puzzle",
                    puzzleId: "leqvio_schedule_puzzle",
                    desc: "指示著第 1 天、第 3 個月與每 6 個月一次時程，以及 25°C 常溫儲存的日晷。"
                },
                {
                    id: "hs_boss_lipid",
                    name: "凝血妖皇之核心火山口",
                    x: "50%",
                    y: "28%",
                    icon: "🔥",
                    type: "boss",
                    bossId: "boss_lipid",
                    requiresPuzzle: ["rnai_mechanism_puzzle", "leqvio_schedule_puzzle"],
                    reqHint: "必須先參透【siRNA 沉默符文】與【半載給藥日晷】，方能解鎖健妥適貫穿妖皇！"
                }
            ]
        },
        {
            id: 4,
            code: "FINALE",
            title: "終章：藥王神殿登頂・太極代謝神劑",
            badge: "第 4 / 4 章 (終章)",
            bgImage: "./images/scenes/castle_interior.jpg",
            guideNpc: "princess",
            introDialog: [
                "難以置信！三大魔神全數被你以卓越的藥學智慧淨化！",
                "國王與我在此為你開啟最終的『太極代謝神壇』！",
                "請將猛健樂、週纖達與健妥適三重聖劑注入神聖鼎爐，完成綜合臨床處方考核，領取特級藥王宗師證書！"
            ],
            hotspots: [
                {
                    id: "hs_final_synthesis",
                    name: "太極代謝神壇（終極考核）",
                    x: "50%",
                    y: "38%",
                    icon: "👑",
                    type: "puzzle",
                    puzzleId: "final_comprehensive_puzzle",
                    desc: "散發著七彩光輝的煉金神壇，等待融合三重聖劑完成大圓滿。"
                }
            ]
        }
    ],

    // 各關卡謎題與考核題目庫
    puzzles: {
        cold_chain_puzzle: {
            title: "❄️ 試煉 1-1：極寒冰窖的冷鏈密碼",
            desc: "請根據猛健樂（MOUNJARO）仿單的溫層規範，撥動三個機關轉輪，選出正確的保存組合：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 未拆封的猛健樂注射筆，標準冷藏溫度應維持於攝氏幾度？",
                    options: [
                        { text: "A. -20°C 至 -10°C (冷凍庫)", correct: false },
                        { text: "B. 2°C 至 8°C (冷藏庫)", correct: true },
                        { text: "C. 15°C 至 25°C (陰涼處)", correct: false }
                    ],
                    rationale: "胜肽藥物必須冷藏於 2°C 至 8°C，絕不可冷凍！"
                },
                {
                    q: "2. 攜帶出門或使用中的注射筆，最高可在幾度室溫下保存長達幾天？",
                    options: [
                        { text: "A. 最高 25°C，保存 14 天", correct: false },
                        { text: "B. 最高 30°C，保存 30 天", correct: true },
                        { text: "C. 最高 35°C，保存 60 天", correct: false }
                    ],
                    rationale: "猛健樂口訣『30度30天』：室溫最高 30°C，最長保存 30 天。"
                },
                {
                    q: "3. 若冰箱異常導致筆內藥液結冰，退冰解凍後是否可以繼續施打？",
                    options: [
                        { text: "A. 絕對不可使用，必須立即丟棄報廢", correct: true },
                        { text: "B. 只要充分搖勻且無沉澱即可正常使用", correct: false },
                        { text: "C. 需加熱至體溫後才可使用", correct: false }
                    ],
                    rationale: "結冰會破壞胜肽的高級立體蛋白結構，解凍後絕不可使用！"
                }
            ],
            reward: {
                itemKey: "frost_lotus",
                exp: 100,
                hint: "成功取得【冰霜雪蓮】！冷鏈安全屏障已建立！"
            }
        },

        kwikpen_puzzle: {
            title: "💉 試煉 1-2：KwikPen 神聖注模排氣",
            desc: "機關台要求校對 KwikPen 多劑型注射筆的機械規格與首次排氣步驟：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 每一支猛健樂 KwikPen 預充填注射筆內含幾劑？每劑固定注射體積為多少？",
                    options: [
                        { text: "A. 1 劑單次用，體積 1.0 mL", correct: false },
                        { text: "B. 4 劑固定劑量，每劑固定 0.6 mL", correct: true },
                        { text: "C. 30 劑微調型，每劑自由調整", correct: false }
                    ],
                    rationale: "KwikPen 為 4 劑固定劑量筆，每劑容積皆為 0.6 mL。"
                },
                {
                    q: "2. 首次使用新筆進行排氣（灌注）時，旋轉劑量旋鈕會聽見幾聲喀響？視窗顯示什麼？推到底見到什麼才算排氣成功？",
                    options: [
                        { text: "A. 聽見 2 聲喀響，視窗顯示『長線條』，推到底針尖有水滴", correct: true },
                        { text: "B. 聽見 5 聲喀響，視窗顯示數字 0，推到底無任何液體", correct: false },
                        { text: "C. 無需旋轉，直接按下按鈕即可", correct: false }
                    ],
                    rationale: "初次排氣轉 2 聲喀響（見長線條），壓到底需看見針尖滲出藥液水滴以排除氣泡。"
                },
                {
                    q: "3. 注射完畢拔針時，劑量視窗必須呈現什麼數字？拔針後的針頭處置何者正確？",
                    options: [
                        { text: "A. 視窗顯示『0』，針頭卸下丟棄於耐穿刺收集盒，嚴禁留在筆上", correct: true },
                        { text: "B. 視窗顯示『1』，針頭留在筆上放回冰箱", correct: false },
                        { text: "C. 視窗顯示『4』，針頭丟入一般家庭垃圾桶", correct: false }
                    ],
                    rationale: "全量注入後劑量視窗會歸『0』，按住按鈕默數 5 秒後拔針；針頭留筆會引致漏液與細菌汙染，必須卸下丟棄於防穿刺收集盒。"
                }
            ],
            reward: {
                itemKey: "mounjaro",
                exp: 150,
                hint: "成功喚醒第一重聖劑【猛健樂®】神力！已可前往挑戰糖魔領主！"
            }
        },

        bmi_criteria_puzzle: {
            title: "📋 試煉 2-1：體重控制門檻與 SELECT 里程碑",
            desc: "草藥商人正在審核肥胖患者的臨床處方箋，請完成以下判定：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 週纖達（Wegovy 2.4mg）用於成人慢性體重控制時，合規的初始身體質量指數（BMI）門檻為何？",
                    options: [
                        { text: "A. BMI ≥ 24 kg/m²（正常體位）即可自由使用", correct: false },
                        { text: "B. BMI ≥ 30 kg/m²（肥胖），或 BMI ≥ 27 至 <30 kg/m² 且伴隨至少 1 項體重相關共病", correct: true },
                        { text: "C. 僅限 BMI ≥ 40 kg/m² 重度肥胖患者", correct: false }
                    ],
                    rationale: "標準為 BMI≥30 或 BMI 27~30 伴隨高血壓、第2型糖尿病、高血脂、OSA等共病。"
                },
                {
                    q: "2. 在里程碑式的 SELECT 臨床試驗中，Semaglutide 2.4mg 對於已有心血管疾病的肥胖患者，能降低多少主要不良心血管事件（MACE）風險？",
                    options: [
                        { text: "A. 降低 5%", correct: false },
                        { text: "B. 降低 20% (HR=0.80, P<0.001)", correct: true },
                        { text: "C. 僅降血糖，無心血管獲益", correct: false }
                    ],
                    rationale: "SELECT 試驗震撼醫界，證實高劑量 Semaglutide 顯著降低 20% MACE 風險！"
                }
            ],
            reward: {
                itemKey: "golden_lotus",
                exp: 100,
                hint: "獲得【金線蓮】！解鎖肥胖與心血管保護核心知識！"
            }
        },

        titration_ladder_puzzle: {
            title: "⚖️ 試煉 2-2：五階晨曦劑量階梯天秤",
            desc: "為了有效預防腸胃道不良反應（噁心、嘔吐），週纖達必須依序漸進調量。請選出正確的 5 階時程：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 週纖達仿單規範之 5 階段劑量調升順序為何（每階段維持 4 週）？",
                    options: [
                        { text: "A. 直接以 2.4 mg 開始施打，不需漸進", correct: false },
                        { text: "B. 0.25 mg → 0.5 mg → 1.0 mg → 1.7 mg → 2.4 mg (維持劑量)", correct: true },
                        { text: "C. 0.5 mg → 1.0 mg → 1.5 mg → 2.0 mg → 3.0 mg", correct: false }
                    ],
                    rationale: "週纖達規範：0.25 -> 0.5 -> 1.0 -> 1.7 -> 2.4 mg，各維持至少 4 週！"
                },
                {
                    q: "2. 若患者在調升劑量時出現嚴重劇烈、放射至背部的上腹疼痛並伴隨嘔吐，藥師應高度警覺何種重症？",
                    options: [
                        { text: "A. 急性胰臟炎（Acute Pancreatitis），必須立即停藥並就醫", correct: true },
                        { text: "B. 輕微消化不良，喝溫水即可繼續按時打針", correct: false },
                        { text: "C. 正常的藥效反應，應立即加倍劑量", correct: false }
                    ],
                    rationale: "持續性放射至背部的腹痛為急性胰臟炎典型徵兆，為 GLP-1 RA 重要警語。"
                }
            ],
            reward: {
                itemKey: "wegovy",
                exp: 150,
                hint: "成功喚醒第二重聖劑【週纖達®】！已具備討伐脂縛巨獸的強大力量！"
            }
        },

        rnai_mechanism_puzzle: {
            title: "🧬 試煉 3-1：siRNA 寂靜機轉符文盤",
            desc: "請在符文盤上理清 Inclisiran（健妥適）精準靶向肝臟並降解 PCSK9 的生化傳遞鏈：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 健妥適分子末端共軛結合了何種結構，能專一性結合肝細胞表面的 ASGPR 受體以實現精準靶向？",
                    options: [
                        { text: "A. 單株抗體 Fc 片段", correct: false },
                        { text: "B. 三觸角 N-乙醯半乳糖胺 (Triantennary GalNAc)", correct: true },
                        { text: "C. 脂質奈米微粒 (LNP)", correct: false }
                    ],
                    rationale: "GalNAc 特異性結合肝臟 ASGPR，使健妥適精準內吞入肝細胞而不干擾全身其他組織！"
                },
                {
                    q: "2. Inclisiran 進入肝細胞質後，與 RISC 結合並發揮何種效應？對血中 LDL-C 有何影響？",
                    options: [
                        { text: "A. 直接在血液中中和膽固醇，不進入細胞", correct: false },
                        { text: "B. 催化切割 PCSK9 mRNA，阻斷 PCSK9 生成，使 LDLR 回收增加，LDL-C 顯著下降約 50%", correct: true },
                        { text: "C. 刺激小腸吸收更多膽固醇", correct: false }
                    ],
                    rationale: "RNA 干擾機轉降解 PCSK9 mRNA，解除 LDLR 被分解的命運，持續高效清除血中 LDL-C。"
                }
            ],
            reward: {
                itemKey: "herb_blood_dragon_ginseng",
                exp: 100,
                hint: "獲得【血龍參】！掌握頂尖 RNAi 基因沉默奧秘！"
            }
        },

        leqvio_schedule_puzzle: {
            title: "⏳ 試煉 3-2：健妥適半載給藥日晷與溫層",
            desc: "驛站長正在登記健妥適的給藥預約表與庫房保存條例：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 健妥適（預充填 284 mg / 1.5 mL）由醫事人員皮下注射的標準長期時程為何？",
                    options: [
                        { text: "A. 每日注射一次，維持一年", correct: false },
                        { text: "B. 第 1 天（首劑） → 第 3 個月（第 90 天追加劑） → 其後每 6 個月一次", correct: true },
                        { text: "C. 每週固定注射一次，連續 52 週", correct: false }
                    ],
                    rationale: "健妥適時程：Day 1 -> Month 3 -> 其後每 6 個月一次，維持期每年僅需施打兩次！"
                },
                {
                    q: "2. 相較於胰島素與許多生化胜肽筆，健妥適在未開封儲存條件上有何極大優勢？",
                    options: [
                        { text: "A. 必須儲存於 -80°C 超低溫冰櫃", correct: false },
                        { text: "B. 存放於 25°C 以下常溫即可，不需冷藏，嚴禁冷凍", correct: true },
                        { text: "C. 必須每天置於陽光下曝曬活化", correct: false }
                    ],
                    rationale: "健妥適常溫 25°C 以下保存即可，不需冷藏，提供患者與醫療體系極大便利！"
                }
            ],
            reward: {
                itemKey: "leqvio",
                exp: 150,
                hint: "成功喚醒第三重聖劑【健妥適®】！已具備決戰凝血妖皇的神聖實力！"
            }
        },

        final_comprehensive_puzzle: {
            title: "👑 終極試煉：太極代謝神壇・三重聖劑融匯",
            desc: "面對心血管代謝三聯徵複合病患，請展示你身為藥王宗師的卓越處方整合能力：",
            type: "choice_set",
            questions: [
                {
                    q: "1. 若病患同時合併肥胖與第二型糖尿病，醫師考慮處方猛健樂，但在過去病史中發現患者母親曾罹患「甲狀腺髓質癌 (MTC)」，此時藥師應如何處置？",
                    options: [
                        { text: "A. 屬黑框警語絕對禁忌症，必須堅決攔截處方並建議更換非此機轉藥物", correct: true },
                        { text: "B. 減半劑量至 1.25mg 即可安全使用", correct: false },
                        { text: "C. 只要定期抽血即可照常施打", correct: false }
                    ],
                    rationale: "個人或家族具有 MTC 或 MEN 2 病史為猛健樂/週纖達之絕對禁忌症，必須嚴格攔截！"
                },
                {
                    q: "2. 一位極高心血管風險的冠心病合併頑固型高血脂患者，已服用最大耐受劑量 Rosuvastatin 20mg + Ezetimibe 10mg，但 LDL-C 仍高達 130 mg/dL（目標值 < 55 mg/dL），此時最理想的長效加成治療為何？",
                    options: [
                        { text: "A. 立即停用所有藥物，僅靠生酮飲食", correct: false },
                        { text: "B. 加用健妥適 (Inclisiran 284mg)，半年施打一次，進一步降低約 50% LDL-C", correct: true },
                        { text: "C. 改用阿斯匹靈替代降血脂藥物", correct: false }
                    ],
                    rationale: "根據 ORION 研究與最新指南，在 Statin+Ezetimibe 基礎上加用 Inclisiran 可強效安全達標。"
                },
                {
                    q: "3. 一位女性糖尿病患者剛開始使用猛健樂，同時規律服用口服低劑量事前避孕藥，藥師給予的最佳衛教為何？",
                    options: [
                        { text: "A. 兩藥完全無交互作用，不需任何處置", correct: false },
                        { text: "B. 因猛健樂延遲胃排空可能降低口服避孕藥吸收，建議開始治療及每次增量後加用屏障避孕（保險套）4 週", correct: true },
                        { text: "C. 應立即停止猛健樂，終身不可併用", correct: false }
                    ],
                    rationale: "延遲胃排空會使口服避孕藥吸收減緩與峰值下降，仿單建議加用屏障避孕 4 週。"
                }
            ],
            reward: {
                titleConfer: "特級代謝藥王宗師",
                exp: 500,
                hint: "完美通關！三大魔神完全淨化，太極代謝神劑大功告成！"
            }
        }
    },

    // 戰鬥關卡題目池（Boss 決戰）
    bossBattles: {
        boss_diabetes: {
            title: "⚔️ 決戰糖魔領主・格魯科斯",
            bossName: "糖魔領主・格魯科斯",
            avatar: "./images/characters/糖尿病 (Diabetes).jpg",
            holyAgent: "猛健樂® (Tirzepatide GIP/GLP-1 RA)",
            questions: [
                {
                    prompt: "糖魔施展【糖化狂暴屏障】！請打出猛健樂的核心雙重受體機轉破壞其屏障！",
                    skillName: "💥 雙重腸泌雙刃斬 (GIP + GLP-1 RA)",
                    options: [
                        { text: "同時活化 GIP 與 GLP-1 受體，促進血糖依賴性胰島素分泌並抑止昇糖素", correct: true, damage: 40 },
                        { text: "單純阻斷腎臟 SGLT2 蛋白排糖", correct: false, damage: 0 },
                        { text: "直接破壞肝臟肝糖合成酶", correct: false, damage: 0 }
                    ],
                    feedback: "正確！雙重腸泌素受體促效擊穿高血糖護盾，造成 40 點神聖藥理傷害！"
                },
                {
                    prompt: "糖魔發動【漏藥混亂詛咒】企圖瓦解你的施打規律！藥師該如何化解？",
                    skillName: "🛡️ 四日漏打應變術 (96 小時補給防禦)",
                    options: [
                        { text: "在漏打後 4 天（96小時）內儘快補打；若超時則跳過該劑，回歸預定日", correct: true, damage: 35 },
                        { text: "不管忘記幾天，立刻一次補打兩倍劑量", correct: false, damage: 0 },
                        { text: "必須重頭從第 1 週開始重新打起", correct: false, damage: 0 }
                    ],
                    feedback: "完美處置！化解糖魔混亂詛咒，反彈 35 點傷害！"
                },
                {
                    prompt: "糖魔垂死召喚【胰島素併用烈焰】！指出正確的併用規範以給予終極一擊！",
                    skillName: "⚡ 分針異位聖擊 (分開給藥・切勿混裝)",
                    options: [
                        { text: "兩藥可打在同一部位（如腹部）但注射點不可緊鄰，且嚴禁混抽於同一針筒", correct: true, damage: 35 },
                        { text: "兩藥必須抽入同一支針筒內充分混合施打", correct: false, damage: 0 },
                        { text: "猛健樂禁止與任何外源性胰島素併用", correct: false, damage: 0 }
                    ],
                    feedback: "致命一擊！糖魔領主被淨化為純淨生命糖元！"
                }
            ]
        },

        boss_obesity: {
            title: "⚔️ 決戰脂縛巨獸・阿迪波斯",
            bossName: "脂縛巨獸・阿迪波斯",
            avatar: "./images/characters/肥胖 (Obesity).jpg",
            holyAgent: "週纖達® (Semaglutide 2.4mg)",
            questions: [
                {
                    prompt: "脂縛巨獸釋放【暴食飢餓毒霧】！召喚週纖達的中樞抑制光環！",
                    skillName: "🌪️ 晨曦中樞飽足風暴 (下視丘食慾抑制)",
                    options: [
                        { text: "作用於大腦下視丘食慾中樞，增強飽足感、減少能量攝入與延緩胃排空", correct: true, damage: 45 },
                        { text: "在腸道物理性吸附所有油脂排泄出體外", correct: false, damage: 0 },
                        { text: "透過興奮甲狀腺素加速心跳燃脂", correct: false, damage: 0 }
                    ],
                    feedback: "毒霧消散！強效中樞食慾調控造成 45 點巨額打擊！"
                },
                {
                    prompt: "巨獸凝結【高阻力脂肪厚甲】！打出 SELECT 心血管試驗實證金光破甲！",
                    skillName: "🛡️ SELECT 聖耀破甲光 (20% MACE 降低)",
                    options: [
                        { text: "引用 SELECT 試驗證實的 20% 重大心血管不良事件 (MACE) 風險下降", correct: true, damage: 40 },
                        { text: "引用降血壓試驗效果", correct: false, damage: 0 },
                        { text: "宣告減重藥物不具心血管保護效果", correct: false, damage: 0 }
                    ],
                    feedback: "厚甲粉碎！臨床實證重創脂縛巨獸 40 點傷害！"
                },
                {
                    prompt: "巨獸狂暴引發【腸胃逆流震盪】！釋出 5 階梯劑量調適結界！",
                    skillName: "✨ 漸進耐受平靜術 (4週階梯滴定防吐)",
                    options: [
                        { text: "嚴格遵循每 4 週逐步調量，遇嚴重噁心時暫緩調升並調整低脂飲食", correct: true, damage: 40 },
                        { text: "立即灌入止吐藥並加倍 Semaglutide 劑量壓制", correct: false, damage: 0 },
                        { text: "立刻完全停水停食三天", correct: false, damage: 0 }
                    ],
                    feedback: "巨獸悲鳴倒下！化為輕盈的晨曦微風！"
                }
            ]
        },

        boss_lipid: {
            title: "⚔️ 決戰凝血妖皇・動脈血煞",
            bossName: "凝血妖皇・動脈血煞",
            avatar: "./images/characters/高血脂 (Hyperlipidemia).jpg",
            holyAgent: "健妥適® (Inclisiran GalNAc-siRNA)",
            questions: [
                {
                    prompt: "凝血妖皇召喚【PCSK9 噬體黑洞】，瘋狂吞噬肝臟 LDL 受體！藥師如何反制？",
                    skillName: "🏹 寂靜基因長矛 (RISC 降解 PCSK9 mRNA)",
                    options: [
                        { text: "釋放 siRNA 結合 RISC，專一降解 PCSK9 mRNA，阻斷蛋白質生成，解救 LDLR", correct: true, damage: 55 },
                        { text: "注射高劑量維他命 C 進行酸鹼中和", correct: false, damage: 0 },
                        { text: "利用磁場將膽固醇吸出體外", correct: false, damage: 0 }
                    ],
                    feedback: "直擊基因源頭！PCSK9 合成被完全封鎖，造成 55 點毀滅打擊！"
                },
                {
                    prompt: "妖皇凝集【動脈粥狀鈣化硬壁】！以 GalNAc 精準靶向雷霆直貫核心！",
                    skillName: "⚡ ASGPR 肝臟專一導航雷霆",
                    options: [
                        { text: "利用 GalNAc 三聚體精準結合肝細胞 ASGPR，使藥物 100% 聚焦肝臟高效作用", correct: true, damage: 50 },
                        { text: "讓藥物在全身所有細胞均勻擴散", correct: false, damage: 0 },
                        { text: "透過肺部吸入發揮作用", correct: false, damage: 0 }
                    ],
                    feedback: "精準命中！動脈硬化硬壁土崩瓦解，妖皇重傷 50 點！"
                },
                {
                    prompt: "妖皇瀕死作困獸之鬥！以【一年兩針・半年長效結界】永久封印之！",
                    skillName: "🌌 半載永恆清血封印 (Day1, Month3, Q6M)",
                    options: [
                        { text: "落實 Day 1、Month 3、其後每 6 個月一次時程，維持 LDL-C 持續減半", correct: true, damage: 50 },
                        { text: "改為每小時靜脈點滴輸注一次", correct: false, damage: 0 },
                        { text: "停藥等待妖皇自行離開", correct: false, damage: 0 }
                    ],
                    feedback: "封印完成！血管長河沉積全數洗滌淨化，凝血妖皇消散！"
                }
            ]
        }
    }
};

window.GAME_DATA = GAME_DATA;
