/**
 * 藥王之塔 - 啟動程式 (Main Bootstrap)
 */
document.addEventListener("DOMContentLoaded", () => {
    window.engine = new PharmacyTowerEngine();
    window.engine.init();

    console.log("🏛️ 藥王之塔與三重聖劑的藥學試煉・遊戲引擎就緒！");
});
