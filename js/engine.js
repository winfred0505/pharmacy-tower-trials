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
    }

    init() {
        this.loadSaveData();
        this.bindGlobalEvents();
        this.loadChapter(this.currentChapterIdx);
        this.renderInventory();
    }

    bindGlobalEvents() {
        // 音效開關
        const btnAudio = document.getElementById("btn-toggle-audio");
        if (btnAudio) {
            btnAudio.onclick = () => {
                const muted = window.soundEngine.toggleMute();
                btnAudio.innerHTML = muted ? "🔇 音效: 關" : "🎵 音效: 開";
                btnAudio.classList.toggle("active", !muted);
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

        // 點擊對話框推進對話
        const dialogBox = document.getElementById("npc-guide-box");
        if (dialogBox) {
            dialogBox.onclick = () => this.advanceDialogue();
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

        // 播放環境音樂
        if (idx === 0) {
            window.soundEngine.playBGM('village');
        } else if (idx === 4) {
            window.soundEngine.playBGM('village');
        } else {
            window.soundEngine.playBGM('mystery');
        }

        // 設定 NPC 對話
        const npc = GAME_DATA.characters[chapter.guideNpc];
        const avatarEl = document.getElementById("guide-avatar");
        avatarEl.src = npc.avatar;

        // 角色圖像以頭部為主呈現 (Head-focused portrait styling)
        if (chapter.guideNpc === "king") {
            avatarEl.style.transform = "scale(2.1)";
            avatarEl.style.transformOrigin = "48% 18%";
        } else if (chapter.guideNpc === "princess") {
            avatarEl.style.transform = "scale(2.1)";
            avatarEl.style.transformOrigin = "48% 16%";
        } else if (chapter.guideNpc === "weaponsmith") {
            avatarEl.style.transform = "scale(2.0)";
            avatarEl.style.transformOrigin = "50% 18%";
        } else if (chapter.guideNpc === "merchant") {
            avatarEl.style.transform = "scale(2.0)";
            avatarEl.style.transformOrigin = "48% 22%";
        } else if (chapter.guideNpc === "innkeeper") {
            avatarEl.style.transform = "scale(2.0)";
            avatarEl.style.transformOrigin = "45% 18%";
        } else {
            avatarEl.style.transform = "scale(2.0)";
            avatarEl.style.transformOrigin = "50% 20%";
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
        this.displayNextDialogue();
    }

    displayNextDialogue() {
        if (this.dialogueIdx >= this.dialogueQueue.length) return;
        const text = this.dialogueQueue[this.dialogueIdx];
        this.typewriterEffect(text);
    }

    advanceDialogue() {
        if (this.isTyping) {
            // 立即顯示全文
            clearInterval(this.typewriterTimer);
            const text = this.dialogueQueue[this.dialogueIdx];
            document.getElementById("guide-dialog").textContent = text;
            this.isTyping = false;
            return;
        }

        if (this.dialogueIdx + 1 < this.dialogueQueue.length) {
            this.dialogueIdx++;
            this.displayNextDialogue();
        } else {
            // 對話結束提示
            document.getElementById("guide-dialog").textContent = "請點擊場景中的光圈熱點，展開探索或解鎖試煉！";
        }
    }

    typewriterEffect(text) {
        this.isTyping = true;
        let charIdx = 0;
        const dialogEl = document.getElementById("guide-dialog");
        dialogEl.textContent = "";

        if (this.typewriterTimer) clearInterval(this.typewriterTimer);

        this.typewriterTimer = setInterval(() => {
            if (charIdx < text.length) {
                dialogEl.textContent += text[charIdx];
                charIdx++;
            } else {
                clearInterval(this.typewriterTimer);
                this.isTyping = false;
            }
        }, 25);
    }

    showGuideMessage(msg) {
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
