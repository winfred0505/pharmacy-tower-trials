function safeCssUrl(url) {
    if (!url) return '';
    return encodeURI(url).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/'/g, '%27');
}

/**
 * 藥王之塔 - 試煉解謎與 Boss 戰鬥系統
 */
class PuzzleManager {
    constructor(engine) {
        this.engine = engine;
        this.activePuzzle = null;
        this.activeBattle = null;
    }

    openPuzzle(puzzleId, onComplete) {
        const pData = GAME_DATA.puzzles[puzzleId];
        if (!pData) return;

        window.soundEngine.playClick();
        this.activePuzzle = {
            id: puzzleId,
            data: pData,
            currentQuestionIdx: 0,
            answers: [],
            onComplete: onComplete
        };

        const modal = document.getElementById("puzzle-modal");
        modal.innerHTML = `
            <div class="puzzle-box">
                <div class="puzzle-header">
                    <h3 id="puzzle-title">${pData.title}</h3>
                    <button class="btn-close" id="btn-close-puzzle">✖</button>
                </div>
                <div class="puzzle-body">
                    <p class="puzzle-desc">${pData.desc}</p>
                    <div id="puzzle-step-container"></div>
                    <div id="puzzle-feedback" class="puzzle-feedback hidden"></div>
                </div>
                <div class="puzzle-footer">
                    <span id="puzzle-progress-text">問題 1 / ${pData.questions.length}</span>
                    <button id="btn-submit-answer" class="btn-ancient btn-gold">確認送出藥理判定</button>
                </div>
            </div>
        `;

        document.getElementById("btn-close-puzzle").onclick = () => this.closePuzzle();
        document.getElementById("btn-submit-answer").onclick = () => this.submitAnswer();

        modal.classList.add("active");
        this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
        const { data, currentQuestionIdx } = this.activePuzzle;
        const q = data.questions[currentQuestionIdx];
        const container = document.getElementById("puzzle-step-container");
        const feedback = document.getElementById("puzzle-feedback");
        feedback.className = "puzzle-feedback hidden";
        feedback.innerHTML = "";

        let html = `
            <div class="question-card">
                <div class="question-title">${q.q}</div>
                <div class="options-list">
        `;

        q.options.forEach((opt, idx) => {
            html += `
                <label class="option-item">
                    <input type="radio" name="puzzle-opt" value="${idx}">
                    <span class="option-text">${opt.text}</span>
                </label>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        document.getElementById("puzzle-progress-text").textContent = 
            `問題 ${currentQuestionIdx + 1} / ${data.questions.length}`;

        // 綁定選項點選音效
        container.querySelectorAll(".option-item").forEach(item => {
            item.addEventListener("click", () => window.soundEngine.playClick());
        });
    }

    submitAnswer() {
        const selected = document.querySelector('input[name="puzzle-opt"]:checked');
        const feedback = document.getElementById("puzzle-feedback");

        if (!selected) {
            feedback.className = "puzzle-feedback error";
            feedback.innerHTML = "⚠️ 請先選擇一個藥理判定選項！";
            window.soundEngine.playError();
            return;
        }

        const selIdx = parseInt(selected.value, 10);
        const { data, currentQuestionIdx } = this.activePuzzle;
        const currentQ = data.questions[currentQuestionIdx];
        const isCorrect = currentQ.options[selIdx].correct;

        if (isCorrect) {
            window.soundEngine.playSuccess();
            feedback.className = "puzzle-feedback success";
            feedback.innerHTML = `<strong>✨ 判定完全正確！</strong><br>${currentQ.rationale}`;
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const submitBtn = document.getElementById("btn-submit-answer");
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.disabled = false;
                if (currentQuestionIdx + 1 < data.questions.length) {
                    this.activePuzzle.currentQuestionIdx++;
                    this.renderCurrentQuestion();
                } else {
                    this.finishPuzzle();
                }
            }, 1400);
        } else {
            window.soundEngine.playError();
            feedback.className = "puzzle-feedback error";
            feedback.innerHTML = `<strong>❌ 藥理判斷有誤！</strong><br>臨床警示：請再次仔細審閱仿單規範與臨床指標！<br><span style="font-size:13px; color:#94a3b8;">提示：${currentQ.rationale}</span>`;
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    finishPuzzle() {
        window.soundEngine.playFanfare();
        const { data, onComplete } = this.activePuzzle;
        const modal = document.getElementById("puzzle-modal");

        let rewardHtml = "";
        if (data.reward && data.reward.itemKey) {
            const item = GAME_DATA.items[data.reward.itemKey];
            rewardHtml = `
                <div class="reward-box">
                    <img src="${encodeURI(item.icon)}" alt="${item.name}" class="reward-icon">
                    <div class="reward-info">
                        <h4>🎉 獲得物品：${item.name}</h4>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `;
            this.engine.addItem(data.reward.itemKey);
        }

        if (data.reward && data.reward.titleConfer) {
            rewardHtml += `
                <div class="title-confer-box">
                    <h3>👑 榮獲封號：【${data.reward.titleConfer}】</h3>
                    <p>你已通曉代謝三聯徵之全方位藥學治療機轉！</p>
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="puzzle-box">
                <div class="puzzle-header">
                    <h3>🏆 試煉圓滿通關！</h3>
                </div>
                <div class="puzzle-body" style="text-align:center;">
                    <div class="victory-star">🌟🌟🌟</div>
                    <p style="font-size:16px; margin: 15px 0;">${data.reward ? data.reward.hint : '你展現了無懈可擊的藥事專業！'}</p>
                    ${rewardHtml}
                </div>
                <div class="puzzle-footer" style="justify-content:center;">
                    <button class="btn-ancient btn-gold" id="btn-finish-puzzle">領取榮耀並繼續冒險</button>
                </div>
            </div>
        `;

        document.getElementById("btn-finish-puzzle").onclick = () => {
            const isFinale = this.activePuzzle && this.activePuzzle.id === "final_comprehensive_puzzle";
            this.closePuzzle();
            if (onComplete) onComplete();
            if (isFinale) {
                const victoryModal = document.getElementById("victory-modal");
                if (victoryModal) {
                    victoryModal.classList.add("active");
                    window.soundEngine.playFanfare();
                }
            }
        };
    }

    closePuzzle() {
        const modal = document.getElementById("puzzle-modal");
        modal.classList.remove("active");
        modal.innerHTML = "";
        this.activePuzzle = null;
    }

    // ==========================================
    // BOSS 戰鬥系統
    // ==========================================
    startBossBattle(bossId, onVictory) {
        const bData = GAME_DATA.bossBattles[bossId];
        const bossChar = GAME_DATA.characters[bossId];
        if (!bData || !bossChar) return;

        window.soundEngine.playBGM('battle');
        this.activeBattle = {
            id: bossId,
            data: bData,
            bossChar: bossChar,
            bossMaxHp: 100,
            bossHp: 100,
            playerMaxHp: 100,
            playerHp: 100,
            turn: 0,
            onVictory: onVictory
        };

        let bossBgSize = "400%";
        let bossBgPos = "50% 25%";
        if (bossId === "boss_obesity") {
            bossBgSize = "360%";
            bossBgPos = "36% 21%";
        } else if (bossId === "boss_lipid") {
            bossBgSize = "400%";
            bossBgPos = "51% 25%";
        } else if (bossId === "boss_diabetes") {
            bossBgSize = "400%";
            bossBgPos = "50% 25%";
        }
        this.currentBossBgSize = bossBgSize;
        this.currentBossBgPos = bossBgPos;

        const modal = document.getElementById("puzzle-modal");
        modal.innerHTML = `
            <div class="puzzle-box battle-arena-box">
                <div class="battle-header">
                    <span class="battle-title">${bData.title}</span>
                    <button class="btn-close" id="btn-flee-battle" title="戰略撤退">🏳️ 撤退</button>
                </div>

                <div class="battle-content-scroll">
                    <div class="battle-stage">
                        <!-- 玩家勇者區域 (我方在左) -->
                        <div class="combatant-card hero-card">
                            <div class="avatar-wrapper">
                                <div class="battle-avatar-frame hero-avatar-frame" style="background-image: url('./images/characters/npc_princess.jpg'); background-size: 320%; background-position: 48% 18%;"></div>
                                <span class="combatant-badge">我方・藥學使者</span>
                            </div>
                            <div class="combatant-meta">
                                <div class="combatant-name">臨床藥學使者</div>
                                <div class="combatant-title">持有聖劑：${bData.holyAgent}</div>
                                <div class="hp-bar-outer">
                                    <div id="player-hp-bar" class="hp-bar-inner player-hp" style="width: 100%;"></div>
                                </div>
                                <div class="hp-text"><span id="player-hp-val">100</span> / 100 HP</div>
                            </div>
                        </div>

                        <!-- VS 標記 -->
                        <div class="vs-badge">VS</div>

                        <!-- 敵方 Boss 區域 (敵方在右) -->
                        <div class="combatant-card boss-card">
                            <div class="avatar-wrapper">
                                <div class="battle-avatar-frame boss-avatar-frame" style="background-image: url('${safeCssUrl(bossChar.avatar)}'); background-size: ${bossBgSize}; background-position: ${bossBgPos};"></div>
                                <span class="combatant-badge">敵方・魔神首領</span>
                            </div>
                            <div class="combatant-meta">
                                <div class="combatant-name">${bossChar.name}</div>
                                <div class="combatant-title">${bossChar.title}</div>
                                <div class="hp-bar-outer">
                                    <div id="boss-hp-bar" class="hp-bar-inner boss-hp" style="width: 100%;"></div>
                                </div>
                                <div class="hp-text"><span id="boss-hp-val">100</span> / 100 HP</div>
                            </div>
                        </div>
                    </div>

                    <div class="battle-controls">
                        <div class="battle-prompt" id="battle-turn-prompt"></div>
                        <div class="battle-actions" id="battle-actions-grid"></div>
                        <div class="battle-log" id="battle-log-text">魔神咆哮！請選擇正確的聖劑藥理技能迎戰！</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("btn-flee-battle").onclick = () => {
            window.soundEngine.playBGM('adventure');
            this.closePuzzle();
        };

        modal.classList.add("active");
        this.renderBattleTurn();
    }

    renderBattleTurn() {
        const { data, turn } = this.activeBattle;
        if (turn >= data.questions.length) {
            this.victoryBossBattle();
            return;
        }

        const q = data.questions[turn];
        document.getElementById("battle-turn-prompt").innerHTML = `
            <strong>【第 ${turn + 1} 回合攻防】</strong> ${q.prompt}
        `;

        const actionsGrid = document.getElementById("battle-actions-grid");
        let html = "";
        q.options.forEach((opt, idx) => {
            html += `
                <button class="btn-battle-skill" data-opt="${idx}">
                    <span class="skill-name">${q.skillName}</span>
                    <span class="skill-desc">${opt.text}</span>
                </button>
            `;
        });
        actionsGrid.innerHTML = html;

        actionsGrid.querySelectorAll(".btn-battle-skill").forEach(btn => {
            btn.onclick = () => {
                const optIdx = parseInt(btn.getAttribute("data-opt"), 10);
                this.executeBattleSkill(optIdx);
            };
        });
    }

    executeBattleSkill(optIdx) {
        const { data, turn } = this.activeBattle;
        const q = data.questions[turn];
        const selected = q.options[optIdx];
        const log = document.getElementById("battle-log-text");

        if (selected.correct) {
            window.soundEngine.playAttack();
            window.soundEngine.playMagic();

            this.activeBattle.bossHp = Math.max(0, this.activeBattle.bossHp - selected.damage);
            document.getElementById("boss-hp-bar").style.width = `${this.activeBattle.bossHp}%`;
            document.getElementById("boss-hp-val").textContent = this.activeBattle.bossHp;

            log.className = "battle-log log-success";
            log.innerHTML = `✨ <strong>【聖劑擊中！】</strong> ${selected.feedback}`;

            // 禁用按鈕防止連點
            document.getElementById("battle-actions-grid").innerHTML = "";

            setTimeout(() => {
                if (this.activeBattle.bossHp <= 0 || turn + 1 >= data.questions.length) {
                    this.victoryBossBattle();
                } else {
                    this.activeBattle.turn++;
                    this.renderBattleTurn();
                }
            }, 1600);
        } else {
            window.soundEngine.playError();
            this.activeBattle.playerHp = Math.max(20, this.activeBattle.playerHp - 25);
            document.getElementById("player-hp-bar").style.width = `${this.activeBattle.playerHp}%`;
            document.getElementById("player-hp-val").textContent = this.activeBattle.playerHp;

            log.className = "battle-log log-error";
            log.innerHTML = `💥 <strong>【藥理判斷偏差！】</strong> 魔神反撲造成 25 點侵蝕傷害！請保持冷靜重整態勢！`;
        }
    }

    victoryBossBattle() {
        window.soundEngine.playFanfare();
        window.soundEngine.playBGM('adventure');
        const { bossChar, onVictory } = this.activeBattle;
        const modal = document.getElementById("puzzle-modal");

        modal.innerHTML = `
            <div class="puzzle-box battle-victory-box">
                <div class="puzzle-header" style="justify-content:center;">
                    <h3>🎉 首領淨化成功・神聖破曉！</h3>
                </div>
                <div class="puzzle-body" style="text-align:center;">
                    <div class="purified-boss-frame" style="background-image: url('${safeCssUrl(bossChar.avatar)}'); background-size: ${this.currentBossBgSize || '400%'}; background-position: ${this.currentBossBgPos || '50% 25%'};"></div>
                    <h3 style="color:#f59e0b; margin-top:10px;">${bossChar.name} 已被徹底淨化！</h3>
                    <p style="color:#94a3b8; font-size:14px; margin: 10px 0 20px;">
                        你以卓越的臨床藥學推論擊潰了代謝魔神的肆虐，古代封印再度恢復平靜！
                    </p>
                    <div class="reward-pill">✨ 獲得通關功勳：【代謝淨化者勳章】</div>
                </div>
                <div class="puzzle-footer" style="justify-content:center;">
                    <button class="btn-ancient btn-gold" id="btn-close-victory">開啟前往下一層的傳送門</button>
                </div>
            </div>
        `;

        document.getElementById("btn-close-victory").onclick = () => {
            this.closePuzzle();
            if (onVictory) onVictory();
        };
    }
}

window.PuzzleManager = PuzzleManager;
