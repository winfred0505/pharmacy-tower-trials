/**
 * 藥王之塔 - 核心冒險任務遊戲引擎 (Game Engine)
 */
class PharmacyTowerEngine {
    constructor() {
        this.currentChapterIdx = 0;
        this.inventory = [];
        this.completedPuzzles = new Set();
        this.defeatedBosses = new Set();
        this.puzzleManager = new PuzzleManager(this);
        this.startTime = Date.now();
        this.dialogueQueue = [];
        this.dialogueIdx = 0;
        this.isTyping = false;
        this.typewriterTimer = null;
        this.lastDialogueAdvanceTime = 0;
        this.showingGoalHint = false;
    }

    init() {
        this.loadSaveData();
        this.bindGlobalEvents();
        this.updateAudioButtons();
        this.loadChapter(this.currentChapterIdx);
        this.renderInventory();
    }

    bindGlobalEvents() {
        // 背景音樂開關 (BGM)
        const btnBgm = document.getElementById("btn-toggle-bgm");
        if (btnBgm) {
            btnBgm.onclick = () => {
                window.soundEngine.toggleBGM();
                this.updateAudioButtons();
            };
        }

        // 操作音效開關 (SFX)
        const btnSfx = document.getElementById("btn-toggle-sfx");
        if (btnSfx) {
            btnSfx.onclick = () => {
                window.soundEngine.toggleSFX();
                this.updateAudioButtons();
            };
        }

        // 重新開始按鈕
        const btnRestart = document.getElementById("btn-restart");
        if (btnRestart) {
            btnRestart.onclick = () => {
                if (confirm("確定要重置所有進度與冒險行囊，重新開始藥王之塔的冒險嗎？")) {
                    this.restart();
                }
            };
        }

        // 藥王聖典仿單手冊
        const btnLore = document.getElementById("btn-open-lore");
        if (btnLore) {
            btnLore.onclick = () => this.openLoreModal();
        }

        // 提示按鈕
        const btnHint = document.getElementById("btn-hint");
        if (btnHint) {
            btnHint.onclick = () => this.showHint();
        }

        // 任何首次手勢互動時自動喚醒背景音樂（解除瀏覽器 Autoplay 限制）
        const unlockAudio = () => {
            window.soundEngine.resumeIfBlocked();
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
        };
        document.addEventListener("click", unlockAudio);
        document.addEventListener("keydown", unlockAudio);
        document.addEventListener("touchstart", unlockAudio);

        // 點擊或觸控對話框推進對話 (無延遲即時響應)
        const handleDialogueClick = (e) => {
            if (e) {
                e.stopPropagation();
            }
            this.advanceDialogue();
        };

        const dialogBox = document.getElementById("npc-guide-box");
        if (dialogBox) {
            dialogBox.addEventListener("click", handleDialogueClick);
        }

        const hintBtn = document.getElementById("guide-hint-btn");
        if (hintBtn) {
            hintBtn.addEventListener("click", handleDialogueClick);
        }

        // 文件層級委派監聽：若點擊事件未被攔截且位於對話框內，確保仍能觸發推進
        document.addEventListener("click", (e) => {
            if (e.target && e.target.closest && e.target.closest("#npc-guide-box")) {
                handleDialogueClick(e);
            }
        });

        // 全域鍵盤快捷鍵
        document.addEventListener("keydown", (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // 若彈窗開啟中，不觸發部分快捷鍵
            const hasActiveModal = document.querySelector(".modal-overlay.active");

            if (e.code === "Space" || e.key === "Enter") {
                if (!hasActiveModal) {
                    e.preventDefault();
                    handleDialogueClick(e);
                }
            } else if (e.key === "b" || e.key === "B" || e.key === "l" || e.key === "L") {
                if (!hasActiveModal) {
                    this.openLoreModal();
                } else if (document.getElementById("lore-modal") && document.getElementById("lore-modal").classList.contains("active")) {
                    this.closeLoreModal();
                }
            } else if (e.key === "m" || e.key === "M") {
                const btnBgm = document.getElementById("btn-toggle-bgm");
                if (btnBgm) btnBgm.click();
            } else if (e.key === "n" || e.key === "N" || e.key === "s" || e.key === "S") {
                const btnSfx = document.getElementById("btn-toggle-sfx");
                if (btnSfx) btnSfx.click();
            } else if (e.key === "h" || e.key === "H") {
                if (!hasActiveModal) {
                    this.showHint();
                }
            } else if (e.key === "r" || e.key === "R") {
                const btnRestart = document.getElementById("btn-restart");
                if (btnRestart) btnRestart.click();
            } else if (e.key === "Escape") {
                if (hasActiveModal) {
                    this.puzzleManager.closePuzzle();
                    this.closeLoreModal();
                }
            }
        });
    }

    updateAudioButtons() {
        const btnBgm = document.getElementById("btn-toggle-bgm");
        if (btnBgm) {
            const isMuted = window.soundEngine.isBgmMuted;
            btnBgm.innerHTML = isMuted ? "🔇 音樂: 關" : "🎼 音樂: 開";
            btnBgm.classList.toggle("btn-muted", isMuted);
            btnBgm.title = isMuted ? "開啟背景音樂 (快捷鍵: M)" : "關閉背景音樂 (快捷鍵: M)";
        }
        const btnSfx = document.getElementById("btn-toggle-sfx");
        if (btnSfx) {
            const isMuted = window.soundEngine.isSfxMuted;
            btnSfx.innerHTML = isMuted ? "🔕 音效: 關" : "🔔 音效: 開";
            btnSfx.classList.toggle("btn-muted", isMuted);
            btnSfx.title = isMuted ? "開啟操作音效 (快捷鍵: N)" : "關閉操作音效 (快捷鍵: N)";
        }
    }

    loadChapter(idx) {
        if (idx < 0 || idx >= GAME_DATA.chapters.length) return;
        this.currentChapterIdx = idx;
        const chapter = GAME_DATA.chapters[idx];

        // 更新頂部資訊
        document.getElementById("chapter-title").textContent = chapter.title;
        document.getElementById("chapter-badge").textContent = chapter.badge;

        // 更新背景圖片
        const viewport = document.getElementById("room-viewport");
        viewport.style.backgroundImage = `url("${encodeURI(chapter.bgImage)}")`;

        // 播放壯闊冒險交響樂
        window.soundEngine.playBGM('adventure');

        // 設定 NPC 對話
        const npc = GAME_DATA.characters[chapter.guideNpc];
        const avatarEl = document.getElementById("guide-avatar");
        avatarEl.style.backgroundImage = `url('${encodeURI(npc.avatar)}')`;
        avatarEl.style.backgroundRepeat = "no-repeat";

        // 角色圖像以頭部特寫為主呈現 (Head-focused portrait styling)
        if (chapter.guideNpc === "king") {
            avatarEl.style.backgroundSize = "320%";
            avatarEl.style.backgroundPosition = "48% 18%";
        } else if (chapter.guideNpc === "princess") {
            avatarEl.style.backgroundSize = "320%";
            avatarEl.style.backgroundPosition = "48% 18%";
        } else if (chapter.guideNpc === "weaponsmith") {
            avatarEl.style.backgroundSize = "300%";
            avatarEl.style.backgroundPosition = "50% 18%";
        } else if (chapter.guideNpc === "merchant") {
            avatarEl.style.backgroundSize = "300%";
            avatarEl.style.backgroundPosition = "48% 22%";
        } else if (chapter.guideNpc === "innkeeper") {
            avatarEl.style.backgroundSize = "300%";
            avatarEl.style.backgroundPosition = "45% 18%";
        } else {
            avatarEl.style.backgroundSize = "300%";
            avatarEl.style.backgroundPosition = "50% 20%";
        }

        document.getElementById("guide-name").textContent = `${npc.name} (${npc.title})`;
        this.startDialogue(chapter.introDialog);

        // 渲染熱點
        this.renderHotspots(chapter.hotspots);

        this.saveData();
    }

    renderHotspots(hotspots) {
        const container = document.getElementById("hotspots-container");
        container.innerHTML = "";

        hotspots.forEach(hs => {
            const isCompleted = this.completedPuzzles.has(hs.puzzleId) || this.defeatedBosses.has(hs.bossId);
            const isLooted = hs.type === 'loot' && this.inventory.includes(hs.itemKey);

            const el = document.createElement("div");
            el.className = `hotspot ${isCompleted || isLooted ? 'completed' : ''}`;
            el.style.left = hs.x;
            el.style.top = hs.y;
            el.innerHTML = `
                <div class="hotspot-pulse"></div>
                <div class="hotspot-icon">${hs.icon}</div>
                <div class="hotspot-tooltip">${hs.name}</div>
            `;

            el.onclick = (e) => {
                e.stopPropagation();
                this.handleHotspotClick(hs);
            };

            container.appendChild(el);
        });
    }

    handleHotspotClick(hs) {
        window.soundEngine.playClick();

        if (hs.type === "loot") {
            if (this.inventory.includes(hs.itemKey)) {
                this.showGuideMessage("此處的物品已收取納入行囊中！");
                return;
            }
            this.addItem(hs.itemKey);
            if (hs.secondItemKey) {
                this.addItem(hs.secondItemKey);
            }
            window.soundEngine.playSuccess();
            this.showGuideMessage(hs.message);
            this.renderHotspots(GAME_DATA.chapters[this.currentChapterIdx].hotspots);
            return;
        }

        if (hs.type === "puzzle") {
            if (this.completedPuzzles.has(hs.puzzleId)) {
                this.showGuideMessage("這道試煉機關已經被你完全解開！");
                return;
            }
            this.puzzleManager.openPuzzle(hs.puzzleId, () => {
                this.completedPuzzles.add(hs.puzzleId);
                this.saveData();
                this.renderHotspots(GAME_DATA.chapters[this.currentChapterIdx].hotspots);
            });
            return;
        }

        if (hs.type === "boss") {
            if (this.defeatedBosses.has(hs.bossId)) {
                this.showGuideMessage("此層的首領已經被你以聖劑之力完全淨化！");
                return;
            }

            // 檢查前置解謎
            if (hs.requiresPuzzle) {
                const missing = hs.requiresPuzzle.filter(pid => !this.completedPuzzles.has(pid));
                if (missing.length > 0) {
                    window.soundEngine.playError();
                    this.showGuideMessage(hs.reqHint || "請先解開場景中其他試煉機關，再來挑戰首領！");
                    return;
                }
            }

            this.puzzleManager.startBossBattle(hs.bossId, () => {
                this.defeatedBosses.add(hs.bossId);
                this.saveData();
                this.renderHotspots(GAME_DATA.chapters[this.currentChapterIdx].hotspots);

                // 首領擊破後引導進入下一章
                setTimeout(() => {
                    if (this.currentChapterIdx + 1 < GAME_DATA.chapters.length) {
                        this.loadChapter(this.currentChapterIdx + 1);
                    }
                }, 1000);
            });
            return;
        }

        if (hs.type === "transition") {
            if (hs.requires) {
                const missing = hs.requires.filter(itemKey => !this.inventory.includes(itemKey));
                if (missing.length > 0) {
                    window.soundEngine.playError();
                    this.showGuideMessage(hs.reqHint || "你尚未滿足開啟此門禁的要求！");
                    return;
                }
            }
            window.soundEngine.playMagic();
            this.loadChapter(hs.nextChapter);
        }
    }

    // 對話系統
    startDialogue(dialogList) {
        if (!dialogList || dialogList.length === 0) return;
        this.dialogueQueue = [...dialogList];
        this.dialogueIdx = 0;
        this.showingGoalHint = false;
        this.displayNextDialogue();
    }

    displayNextDialogue() {
        if (!this.dialogueQueue || this.dialogueIdx >= this.dialogueQueue.length) return;
        const text = this.dialogueQueue[this.dialogueIdx];
        this.typewriterEffect(text);
    }

    advanceDialogue() {
        // 1. 視覺點擊動畫反饋 (金色邊框發光脈衝與按壓效果)
        const box = document.getElementById("npc-guide-box");
        if (box) {
            box.classList.remove("clicked");
            void box.offsetWidth; // 強制重繪觸發動畫
            box.classList.add("clicked");
        }

        // 2. 播放操作音效（嚴格加入安全保護，防止 AudioContext 拋出例外中斷推進）
        try {
            if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
                window.soundEngine.playClick();
            }
        } catch (err) {
            console.warn("SoundEngine playClick caught error:", err);
        }

        // 3. 若打字機特效輸出中，立即完成打字顯示全句
        if (this.isTyping) {
            clearInterval(this.typewriterTimer);
            this.isTyping = false;
            const text = (this.dialogueQueue && this.dialogueQueue[this.dialogueIdx]) || "";
            const dialogEl = document.getElementById("guide-dialog");
            if (dialogEl && text) {
                dialogEl.textContent = text;
            }
            this.updateGuideHint();
            return;
        }

        // 4. 若對話佇列中還有下一句，推進下一句
        if (this.dialogueQueue && this.dialogueIdx + 1 < this.dialogueQueue.length) {
            this.dialogueIdx++;
            this.showingGoalHint = false;
            this.displayNextDialogue();
            return;
        }

        // 5. 若已抵達對話末尾：
        // 第一次點擊顯示本章核心目標提示；再次點擊可循環重新播放開場對話
        if (!this.showingGoalHint) {
            this.showCurrentGoalHint();
        } else {
            // 重播本章 NPC 引導對話
            const ch = GAME_DATA.chapters[this.currentChapterIdx];
            if (ch && ch.introDialog) {
                this.showingGoalHint = false;
                this.startDialogue(ch.introDialog);
            }
        }
    }

    advanceDialog() {
        this.advanceDialogue();
    }

    showCurrentGoalHint() {
        this.showingGoalHint = true;
        const ch = GAME_DATA.chapters[this.currentChapterIdx];
        let goalMsg = "請點擊場景中的光圈熱點，展開探索或解鎖試煉！";
        if (ch) {
            if (ch.id === 0) {
                goalMsg = "📜【當前目標】請拾取石台上的《藥王寶典》，並至軍械架領取裝備，做好準備後開啟塔門！";
            } else if (ch.id === 1) {
                goalMsg = "❄️【當前目標】請解鎖冷鏈保溫櫃、掌握 KwikPen 機械排氣與禁忌症核方，迎戰糖魔領主！";
            } else if (ch.id === 2) {
                goalMsg = "⚖️【當前目標】請至肥胖共病案台診斷、調平五階晨曦天秤並調製健胃藥劑，迎戰脂縛巨獸！";
            } else if (ch.id === 3) {
                goalMsg = "🧬【當前目標】請完成 GalNAc-siRNA 靶向拼圖、設定超長效時程與降脂水晶，迎戰血煞妖皇！";
            } else if (ch.id === 4) {
                goalMsg = "👑【當前目標】請點擊中央太極代謝神壇，進行三大聖劑綜合考核，受封藥王宗師！";
            }
        }
        this.dialogueQueue = [goalMsg];
        this.dialogueIdx = 0;
        this.typewriterEffect(goalMsg);
    }

    updateGuideHint() {
        const hintEl = document.getElementById("guide-hint-btn") || document.querySelector(".guide-hint-click");
        if (!hintEl) return;

        if (this.isTyping) {
            hintEl.innerHTML = `⏩ 快速完成 (Space)`;
        } else if (this.dialogueQueue && this.dialogueIdx + 1 < this.dialogueQueue.length) {
            const remaining = this.dialogueQueue.length - 1 - this.dialogueIdx;
            hintEl.innerHTML = `點擊繼續 (剩 ${remaining} 句) ▶`;
        } else if (this.showingGoalHint) {
            hintEl.innerHTML = `🔄 重聽本章引導 ▶`;
        } else {
            hintEl.innerHTML = `💡 查看任務目標 ▶`;
        }
    }

    typewriterEffect(text) {
        this.isTyping = true;
        this.updateGuideHint();
        let charIdx = 0;
        const dialogEl = document.getElementById("guide-dialog");
        if (!dialogEl) return;
        dialogEl.textContent = "";

        if (this.typewriterTimer) clearInterval(this.typewriterTimer);

        this.typewriterTimer = setInterval(() => {
            if (charIdx < text.length) {
                dialogEl.textContent += text[charIdx];
                charIdx++;
            } else {
                clearInterval(this.typewriterTimer);
                this.isTyping = false;
                this.updateGuideHint();
            }
        }, 22);
    }

    showGuideMessage(msg) {
        if (!msg) return;
        this.dialogueQueue = [msg];
        this.dialogueIdx = 0;
        this.showingGoalHint = false;
        if (this.typewriterTimer) clearInterval(this.typewriterTimer);
        this.typewriterEffect(msg);
    }

    // 道具背包系統
    addItem(itemKey) {
        if (!this.inventory.includes(itemKey)) {
            this.inventory.push(itemKey);
            this.renderInventory();
            this.saveData();
        }
    }

    renderInventory() {
        const slotsContainer = document.getElementById("inventory-slots");
        slotsContainer.innerHTML = "";

        // 擴充冒險行囊至 16 格
        const totalSlots = Math.max(16, this.inventory.length + 2);
        for (let i = 0; i < totalSlots; i++) {
            const slotEl = document.createElement("div");
            slotEl.className = "inventory-slot";

            if (i < this.inventory.length) {
                const itemKey = this.inventory[i];
                const item = GAME_DATA.items[itemKey];
                if (item) {
                    slotEl.classList.add("has-item");
                    const iconUrl = encodeURI(item.icon);
                    slotEl.innerHTML = `
                        <img src="${iconUrl}" alt="${item.name}" class="slot-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span class="slot-fallback-icon" style="display:none; font-size:24px;">💊</span>
                        <span class="slot-name">${item.name}</span>
                    `;
                    slotEl.onclick = () => this.inspectItem(item);
                }
            } else {
                slotEl.innerHTML = `<span class="slot-empty">${i + 1}</span>`;
            }

            slotsContainer.appendChild(slotEl);
        }
    }

    inspectItem(item) {
        window.soundEngine.playClick();
        const modal = document.getElementById("puzzle-modal");
        const iconUrl = encodeURI(item.icon);
        modal.innerHTML = `
            <div class="puzzle-box item-inspect-box">
                <div class="puzzle-header">
                    <h3>🔍 行囊珍品檢視：${item.name}</h3>
                    <button class="btn-close" onclick="engine.puzzleManager.closePuzzle()">✖</button>
                </div>
                <div class="puzzle-body" style="text-align:center;">
                    <img src="${iconUrl}" alt="${item.name}" class="inspect-large-img" onerror="this.src='./images/items/item_keystone_iron_will.jpg';">
                    <div class="item-cat-badge">${item.category}</div>
                    <p class="inspect-desc">${item.desc}</p>
                </div>
            </div>
        `;
        modal.classList.add("active");
    }

    // 神諭仿單手冊
    openLoreModal() {
        window.soundEngine.playClick();
        const modal = document.getElementById("lore-modal");
        const content = document.getElementById("lore-content");

        let html = "";
        GAME_DATA.grimoireData.forEach(book => {
            html += `<div class="lore-chapter">`;
            html += `<h3 class="lore-chapter-title">${book.title}</h3>`;
            book.sections.forEach(sec => {
                html += `
                    <div class="lore-section">
                        <h4>${sec.heading}</h4>
                        <p>${sec.content}</p>
                    </div>
                `;
            });
            html += `</div>`;
        });

        content.innerHTML = html;
        modal.classList.add("active");
    }

    closeLoreModal() {
        document.getElementById("lore-modal").classList.remove("active");
    }

    showHint() {
        window.soundEngine.playClick();
        const ch = GAME_DATA.chapters[this.currentChapterIdx];
        if (ch.id === 0) {
            this.showGuideMessage("💡 提示：先點擊桌上的《藥王寶典》與兵器架，取得出發的必要神器！");
        } else if (ch.id === 1) {
            this.showGuideMessage("💡 提示：猛健樂要求 2~8°C 冷藏，30°C 室溫可放 30 天；排氣轉兩聲見水滴！");
        } else if (ch.id === 2) {
            this.showGuideMessage("💡 提示：週纖達起始適應 BMI≥30 或 27+共病；五階滴定為 0.25→0.5→1.0→1.7→2.4mg！");
        } else if (ch.id === 3) {
            this.showGuideMessage("💡 提示：健妥適 siRNA 靶向 ASGPR 降解 PCSK9 mRNA；時程為 Day 1, Month 3, 每 6 個月一次！");
        } else if (ch.id === 4) {
            this.showGuideMessage("💡 提示：點擊中央的【太極代謝神壇】，回答綜合臨床難題，完成宗師受封！");
        }
    }

    // 存檔與讀檔
    saveData() {
        const payload = {
            chapterIdx: this.currentChapterIdx,
            inventory: this.inventory,
            completedPuzzles: Array.from(this.completedPuzzles),
            defeatedBosses: Array.from(this.defeatedBosses)
        };
        localStorage.setItem("pharmacy_tower_save", JSON.stringify(payload));
    }

    loadSaveData() {
        const saved = localStorage.getItem("pharmacy_tower_save");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentChapterIdx = data.chapterIdx || 0;
                this.inventory = data.inventory || [];
                this.completedPuzzles = new Set(data.completedPuzzles || []);
                this.defeatedBosses = new Set(data.defeatedBosses || []);
            } catch (e) {
                console.error("載入存檔失敗:", e);
            }
        }
    }

    restart() {
        window.soundEngine.playClick();
        localStorage.removeItem("pharmacy_tower_save");
        this.currentChapterIdx = 0;
        this.inventory = [];
        this.completedPuzzles = new Set();
        this.defeatedBosses = new Set();
        this.dialogueQueue = [];
        this.dialogueIdx = 0;
        this.isTyping = false;
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
        }

        // 關閉所有可能開啟的彈窗
        const victoryModal = document.getElementById("victory-modal");
        if (victoryModal) victoryModal.classList.remove("active");

        const loreModal = document.getElementById("lore-modal");
        if (loreModal) loreModal.classList.remove("active");

        if (this.puzzleManager) {
            this.puzzleManager.closePuzzle();
        }

        // 重新載入第 0 章與初始背包
        this.loadChapter(0);
        this.renderInventory();
        this.saveData();

        window.soundEngine.playMagic();
        console.log("🔄 藥王之塔已成功重置並重新開始！");
    }
}

window.PharmacyTowerEngine = PharmacyTowerEngine;
