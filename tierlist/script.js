"use strict";


/* =========================================
   KIT DATA
========================================= */

const kits = [
    {
        id: "overall",
        name: "overall",
        image: "../assets/tierlist/overall.png"
    },
    {
        id: "sword",
        name: "Sword",
        image: "../assets/tierlist/sword.png"
    },
    {
        id: "axe",
        name: "Axe",
        image: "../assets/tierlist/axe.png"
    },
    {
        id: "uhc",
        name: "UHC",
        image: "../assets/tierlist/uhc.png"
    },
    {
        id: "pot",
        name: "Pot",
        image: "../assets/tierlist/pot.png"
    },
    {
        id: "mace",
        name: "Mace",
        image: "../assets/tierlist/mace.png"
    },
    {
        id: "endgame",
        name: "EndGame",
        image: "../assets/tierlist/endgame.png"
    },
    {
        id: "smp",
        name: "SMP",
        image: "../assets/tierlist/smp.png"
    },
    {
        id: "nethpot",
        name: "NethPot",
        image: "../assets/tierlist/nethpot.png"
    }
];


const tierOrder = [
    "HT1",
    "HT2",
    "HT3",
    "HT4",
    "HT5",
    "LT1",
    "LT2",
    "LT3",
    "LT4",
    "LT5"
];


const tierPoints = {
    HT1: 100,
    HT2: 90,
    HT3: 80,
    HT4: 70,
    HT5: 60,
    LT1: 50,
    LT2: 40,
    LT3: 30,
    LT4: 20,
    LT5: 10
};


/* =========================================
   PLAYER DATA
========================================= */

const players = [
    {
        name: "SEIYA5620",

        tiers: {
            sword: "-",
            axe: "-",
            uhc: "-",
            pot: "-",
            mace: "-",
            endgame: "LT4",
            smp: "-",
            nethpot: "-"
        }
    },

    {
        name: "herokinokino",

        tiers: {
            sword: "HT5",
            axe: "-",
            uhc: "-",
            pot: "-",
            mace: "-",
            endgame: "-",
            smp: "-",
            nethpot: "-"
        }
    }
];


/* =========================================
   TRANSLATIONS
========================================= */

const translations = {
    ja: {
        "nav.home": "ホーム",
        "nav.discord": "Discord",
        "nav.support": "サポート",
        "tier.description": "PVPBattles プレイヤーランキング",
        "search": "検索...",
        "players": "プレイヤー",
        "points": "ポイント",
        "player": "プレイヤー"
    },

    en: {
        "nav.home": "Home",
        "nav.discord": "Discord",
        "nav.support": "Support",
        "tier.description": "PVPBattles player rankings",
        "search": "Search...",
        "players": "Players",
        "points": "Points",
        "player": "Player"
    },

    ko: {
        "nav.home": "홈",
        "nav.discord": "Discord",
        "nav.support": "지원",
        "tier.description": "PVPBattles 플레이어 랭킹",
        "search": "검색...",
        "players": "플레이어",
        "points": "포인트",
        "player": "플레이어"
    },

    zh: {
        "nav.home": "首页",
        "nav.discord": "Discord",
        "nav.support": "支持",
        "tier.description": "PVPBattles 玩家排名",
        "search": "搜索...",
        "players": "玩家",
        "points": "积分",
        "player": "玩家"
    },

    es: {
        "nav.home": "Inicio",
        "nav.discord": "Discord",
        "nav.support": "Soporte",
        "tier.description": "Clasificación de jugadores de PVPBattles",
        "search": "Buscar...",
        "players": "Jugadores",
        "points": "Puntos",
        "player": "Jugador"
    },

    fr: {
        "nav.home": "Accueil",
        "nav.discord": "Discord",
        "nav.support": "Support",
        "tier.description": "Classement des joueurs PVPBattles",
        "search": "Rechercher...",
        "players": "Joueurs",
        "points": "Points",
        "player": "Joueur"
    },

    de: {
        "nav.home": "Startseite",
        "nav.discord": "Discord",
        "nav.support": "Support",
        "tier.description": "PVPBattles-Spielerrangliste",
        "search": "Suchen...",
        "players": "Spieler",
        "points": "Punkte",
        "player": "Spieler"
    },

    pt: {
        "nav.home": "Início",
        "nav.discord": "Discord",
        "nav.support": "Suporte",
        "tier.description": "Ranking de jogadores PVPBattles",
        "search": "Pesquisar...",
        "players": "Jogadores",
        "points": "Pontos",
        "player": "Jogador"
    }
};


/* =========================================
   ELEMENTS
========================================= */

const tierTabs = document.getElementById("tierTabs");
const tierTable = document.getElementById("tierTable");
const playerSearch = document.getElementById("playerSearch");
const clearSearch = document.getElementById("clearSearch");
const playerCount = document.getElementById("playerCount");

const menuButton = document.getElementById("menuButton");
const navbar = document.getElementById("navbar");
const languageSelect = document.getElementById("languageSelect");


let currentKit = "overall";


/* =========================================
   HELPERS
========================================= */

function getTierClass(tier) {
    if (!tier || tier === "-") {
        return "tier-none";
    }

    return `tier-${tier.toLowerCase()}`;
}


function getTierPoints(tier) {
    return tierPoints[tier] ?? null;
}


function getOverallPoints(player) {
    const values = Object.values(player.tiers);

    if (values.some((tier) => !tier || tier === "-")) {
        return null;
    }

    return values.reduce((total, tier) => {
        return total + (getTierPoints(tier) || 0);
    }, 0);
}


function getAvatar(name) {
    return `https://mc-heads.net/avatar/${encodeURIComponent(name)}/48`;
}


function getCurrentTranslation(key) {
    const language = localStorage.getItem("pvpbattles-language") || "ja";

    return (
        translations[language]?.[key] ||
        translations.ja[key] ||
        key
    );
}


/* =========================================
   TABS
========================================= */

function renderTabs() {

    tierTabs.innerHTML = "";

    kits.forEach((kit) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className =
            "tier-tab" +
            (kit.id === currentKit ? " active" : "");

        if (kit.id === "overall") {
            button.classList.add("tier-tab-overall");
        }

        if (kit.image) {

            const image = document.createElement("img");

            image.src = kit.image;
            image.alt = "";

            image.onerror = () => {
                image.style.display = "none";
            };

            button.appendChild(image);
        }

        const text = document.createElement("span");

        text.textContent = kit.name;

        button.appendChild(text);

        button.addEventListener("click", () => {

            currentKit = kit.id;

            renderTabs();
            renderTable();

        });

        tierTabs.appendChild(button);
    });
}


/* =========================================
   OVERALL TABLE
========================================= */

function renderOverall(filteredPlayers) {

    const kitColumns = kits.filter(
        (kit) => kit.id !== "overall"
    );

    let html = `
        <div class="tier-table">

            <div class="table-head"
                style="
                    grid-template-columns:
                    60px
                    minmax(210px, 1fr)
                    minmax(570px, 2fr)
                    110px;
                "
            >

                <div>#</div>

                <div>
                    ${getCurrentTranslation("player")}
                </div>

                <div>
                    TIERS
                </div>

                <div style="text-align:right">
                    ${getCurrentTranslation("points")}
                </div>

            </div>
    `;


    filteredPlayers.forEach((player, index) => {

        const overallPoints = getOverallPoints(player);

        html += `
            <div class="player-row"
                style="
                    grid-template-columns:
                    60px
                    minmax(210px, 1fr)
                    minmax(570px, 2fr)
                    110px;
                "
            >

                <div class="rank ${index === 0 ? "gold" : ""}">
                    ${index + 1}
                </div>


                <div class="player">

                    <img
                        class="avatar"
                        src="${getAvatar(player.name)}"
                        alt="${player.name}"
                        loading="lazy"
                    >

                    <div class="player-info">

                        <a
                            class="player-name"
                            href="#"
                            onclick="return false;"
                        >
                            ${escapeHtml(player.name)}
                        </a>

                    </div>

                </div>


                <div class="overall-tiers">
        `;


        kitColumns.forEach((kit) => {

            const tier =
                player.tiers[kit.id] || "-";

            html += `
                <div class="tier-cell ${getTierClass(tier)}">

                    <div class="tier-cell-content">

                        <span class="kit-label">
                            ${kit.name}
                        </span>

                        ${tier}

                    </div>

                </div>
            `;
        });


        html += `
                </div>


                <div class="points">

                    ${
                        overallPoints === null
                            ? "-"
                            : overallPoints
                    }

                    <span>
                        ${getCurrentTranslation("points")}
                    </span>

                </div>

            </div>
        `;
    });


    html += `</div>`;

    tierTable.innerHTML =
        filteredPlayers.length
            ? html
            : `<div class="empty">No players found.</div>`;
}


/* =========================================
   NORMAL KIT TABLE
========================================= */

function renderKit(filteredPlayers) {

    const kit = kits.find(
        (item) => item.id === currentKit
    );

    if (!kit) {
        return;
    }


    let html = `
        <div class="tier-table">

            <div class="table-head">

                <div>#</div>

                <div>
                    ${getCurrentTranslation("player")}
                </div>

                <div>
                    TIER
                </div>

                <div style="text-align:right">
                    ${getCurrentTranslation("points")}
                </div>

            </div>
    `;


    filteredPlayers.forEach((player, index) => {

        const tier =
            player.tiers[currentKit] || "-";

        const points =
            getTierPoints(tier);


        html += `
            <div class="player-row">

                <div class="rank ${index === 0 ? "gold" : ""}">
                    ${index + 1}
                </div>


                <div class="player">

                    <img
                        class="avatar"
                        src="${getAvatar(player.name)}"
                        alt="${player.name}"
                        loading="lazy"
                    >

                    <div class="player-info">

                        <a
                            class="player-name"
                            href="#"
                            onclick="return false;"
                        >
                            ${escapeHtml(player.name)}
                        </a>

                    </div>

                </div>


                <div class="normal-tier">

                    <div class="tier-cell ${getTierClass(tier)}">
                        ${tier}
                    </div>

                </div>


                <div class="points">

                    ${
                        points === null
                            ? "-"
                            : points
                    }

                    <span>
                        ${getCurrentTranslation("points")}
                    </span>

                </div>

            </div>
        `;
    });


    html += `</div>`;


    tierTable.innerHTML =
        filteredPlayers.length
            ? html
            : `<div class="empty">No players found.</div>`;
}


/* =========================================
   TABLE RENDER
========================================= */

function renderTable() {

    const query =
        playerSearch.value
            .trim()
            .toLowerCase();


    const filteredPlayers =
        players.filter((player) =>
            player.name
                .toLowerCase()
                .includes(query)
        );


    playerCount.textContent =
        `${filteredPlayers.length} ${getCurrentTranslation("players")}`;


    if (currentKit === "overall") {
        renderOverall(filteredPlayers);
    } else {
        renderKit(filteredPlayers);
    }


    clearSearch.classList.toggle(
        "visible",
        playerSearch.value.length > 0
    );
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   LANGUAGE
========================================= */

function applyLanguage(language) {

    if (!translations[language]) {
        language = "ja";
    }


    localStorage.setItem(
        "pvpbattles-language",
        language
    );


    document.documentElement.lang =
        language;


    document
        .querySelectorAll("[data-i18n]")
        .forEach((element) => {

            const key =
                element.dataset.i18n;

            const value =
                translations[language]?.[key];

            if (value) {
                element.textContent = value;
            }
        });


    playerSearch.placeholder =
        translations[language]?.search ||
        "Search...";


    languageSelect.value =
        language;


    renderTable();
}


/* =========================================
   LANGUAGE AUTO DETECTION
========================================= */

function detectLanguage() {

    const saved =
        localStorage.getItem(
            "pvpbattles-language"
        );

    if (saved && translations[saved]) {
        return saved;
    }


    const browser =
        navigator.language
            .toLowerCase();


    if (browser.startsWith("ja")) {
        return "ja";
    }

    if (browser.startsWith("ko")) {
        return "ko";
    }

    if (browser.startsWith("zh")) {
        return "zh";
    }

    if (browser.startsWith("es")) {
        return "es";
    }

    if (browser.startsWith("fr")) {
        return "fr";
    }

    if (browser.startsWith("de")) {
        return "de";
    }

    if (
        browser.startsWith("pt") ||
        browser.startsWith("pt-br")
    ) {
        return "pt";
    }

    return "en";
}


/* =========================================
   EVENTS
========================================= */

playerSearch.addEventListener(
    "input",
    renderTable
);


clearSearch.addEventListener(
    "click",
    () => {

        playerSearch.value = "";

        renderTable();

        playerSearch.focus();
    }
);


languageSelect.addEventListener(
    "change",
    () => {

        applyLanguage(
            languageSelect.value
        );
    }
);


menuButton.addEventListener(
    "click",
    () => {

        navbar.classList.toggle(
            "open"
        );
    }
);


navbar
    .querySelectorAll("a")
    .forEach((link) => {

        link.addEventListener(
            "click",
            () => {
                navbar.classList.remove("open");
            }
        );
    });


/* =========================================
   START
========================================= */

renderTabs();

applyLanguage(
    detectLanguage()
);
