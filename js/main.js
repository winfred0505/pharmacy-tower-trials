/**
 * 藥王之塔 - 啟動程式 (Main Bootstrap)
 */
document.addEventListener("DOMContentLoaded", () => {
    window.engine = new PharmacyTowerEngine();
    window.engine.init();

    // 鍵盤快捷鍵
    window.addEventListener("keydown", (e) => {
        // 若彈窗開啟中，不觸發部分快捷鍵
        const hasActiveModal = document.querySelector(".modal-overlay.active");

        if (e.key === " " || e.key === "Enter") {
            if (!hasActiveModal) {
                e.preventDefault();
                window.engine.advanceDialogue();
            }
        } else if (e.key === "h" || e.key === "H") {
            if (!hasActiveModal) {
                window.engine.showHint();
            }
        } else if (e.key === "b" || e.key === "B" || e.key === "l" || e.key === "L") {
            if (!hasActiveModal) {
                window.engine.openLoreModal();
            } else if (document.getElementById("lore-modal").classList.contains("active")) {
                window.engine.closeLoreModal();
            }
        } else if (e.key === "m" || e.key === "M") {
            const btnAudio = document.getElementById("btn-toggle-audio");
            if (btnAudio) btnAudio.click();
        } else if (e.key === "r" || e.key === "R") {
            const btnRestart = document.getElementById("btn-restart");
            if (btnRestart) btnRestart.click();
        } else if (e.key === "Escape") {
            if (hasActiveModal) {
                window.engine.puzzleManager.closePuzzle();
                window.engine.closeLoreModal();
            }
        }
    });

    console.log("🏛️ 藥王之塔與三重聖劑的藥學試煉・遊戲引擎就緒！");
});
