"use strict";

/* =========================
   KIT DATA
========================= */

const kits = [
    {
        id: "overall",
        name: "OVERALL",
        image: "../assets/tierlist/Overall.png",
        description: "Overall ranking based on all kits."
    },
    {
        id: "sword",
        name: "Sword",
        image: "../assets/tierlist/sword.png",
        description: "Sword PvP rankings."
    },
    {
        id: "axe",
        name: "Axe",
        image: "../assets/tierlist/axe.png",
        description: "Axe PvP rankings."
    },
    {
        id: "uhc",
        name: "UHC",
        image: "../assets/tierlist/uhc.png",
        description: "UHC PvP rankings."
    },
    {
        id: "pot",
        name: "Pot",
        image: "../assets/tierlist/pot.png",
        description: "Potion PvP rankings."
    },
    {
        id: "mace",
        name: "Mace",
        image: "../assets/tierlist/mace.png",
        description: "Mace PvP rankings."
    },
    {
        id: "endgame",
        name: "EndGame",
        image: "../assets/tierlist/endgame.png",
        description: "EndGame PvP rankings."
    },
    {
        id: "smp",
        name: "SMP",
        image: "../assets/tierlist/smp.png",
        description: "SMP PvP rankings."
    },
    {
        id: "nethpot",
        name: "NethPot",
        image: "../assets/tierlist/nethpot.png",
        description: "Netherite Potion PvP rankings."
    }
];


/* =========================
   TIER POINTS
========================= */

const tierPoints = {
    HT1: 10,
    HT2: 9,
    HT3: 8,
    HT4: 7,
    HT5: 6,

    LT1: 5,
    LT2: 4,
    LT3: 3,
    LT4: 2,
    LT5: 1
};


/* =========================
   PLAYER DATA
========================= */

const players = [
    {
        name: "SEIYA5620",

        tiers: {
            sword: null,
            axe: null,
            uhc: null,
            pot: null,
            mace: null,
            endgame: "LT4",
            smp: null,
            nethpot: null
        }
    },

    {
        name: "herokinokino",

        tiers: {
            sword: "HT5",
            axe: null,
            uhc: null,
            pot: null,
            mace: null,
            endgame: null,
            smp: null,
            nethpot: null
        }
    }
];


/* =========================
   STATE
========================= */

let currentKit = "overall";
let searchText = "";


/* =========================
   ELEMENTS
========================= */

const kitTabs = document.getElementById("kitTabs");
const playerList = document.getElementById("playerList");
const playerSearch = document.getElementById("playerSearch");

const infoIcon = document.getElementById("infoIcon");
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById("infoDescription");

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

const languageSelect = document.getElementById("languageSelect");


/* =========================
   CREATE KIT TABS
========================= */

function renderKitTabs() {
    kitTabs.innerHTML = "";

    kits.forEach((kit) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "kit-button";

        if (kit.id === currentKit) {
            button.classList.add("active");
        }

        const image = document.createElement("img");

        image.src = kit.image;
        image.alt = kit.name;

        image.onerror = () => {
            image.style.display = "none";
        };

        const text = document.createElement("span");
        text.textContent = kit.name;

        button.appendChild(image);
        button.appendChild(text);

        button.addEventListener("click", () => {
            currentKit = kit.id;

            renderKitTabs();
            renderPlayers();
            updateInfo();
        });

        kitTabs.appendChild(button);
    });
}


/* =========================
   GET OVERALL POINTS
========================= */

function getOverallPoints(player) {
    let total = 0;
    let completed = 0;

    Object.values(player.tiers).forEach((tier) => {
        if (!tier || !tierPoints[tier]) {
            return;
        }

        total += tierPoints[tier];
        completed++;
    });

    /*
     * Overall is only calculated when all 8 kits
     * have a tier.
     */
    if (completed !== 8) {
        return null;
    }

    return Math.round((total / 80) * 300);
}


/* =========================
   GET PLAYER POINTS
========================= */

function getPlayerPoints(player, kitId) {
    if (kitId === "overall") {
        return getOverallPoints(player);
    }

    const tier = player.tiers[kitId];

    if (!tier) {
        return null;
    }

    return tierPoints[tier];
}


/* =========================
   GET PLAYER TIER
========================= */

function getPlayerTier(player, kitId) {
    if (kitId === "overall") {
        return "OVERALL";
    }

    return player.tiers[kitId] || "—";
}


/* =========================
   SKIN
========================= */

function getSkinUrl(playerName) {
    return `https://mc-heads.net/avatar/${encodeURIComponent(
        playerName
    )}/48`;
}


/* =========================
   RENDER PLAYERS
========================= */

function renderPlayers() {
    playerList.innerHTML = "";

    const filteredPlayers = players.filter((player) => {
        return player.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });

    /*
     * Sort players.
     * Players with points come first.
     */
    filteredPlayers.sort((a, b) => {
        const aPoints = getPlayerPoints(a, currentKit);
        const bPoints = getPlayerPoints(b, currentKit);

        if (aPoints === null && bPoints === null) {
            return a.name.localeCompare(b.name);
        }

        if (aPoints === null) {
            return 1;
        }

        if (bPoints === null) {
            return -1;
        }

        return bPoints - aPoints;
    });

    if (filteredPlayers.length === 0) {
        const empty = document.createElement("div");

        empty.className = "empty-message";
        empty.textContent = "No players found.";

        playerList.appendChild(empty);
        return;
    }

    filteredPlayers.forEach((player, index) => {
        const row = document.createElement("div");

        row.className = "player-row";

        /* Rank */
        const number = document.createElement("div");

        number.className = "player-number";
        number.textContent = String(index + 1);

        /* Player info */
        const playerInfo = document.createElement("div");

        playerInfo.className = "player-info";

        const skin = document.createElement("img");

        skin.className = "player-skin";
        skin.src = getSkinUrl(player.name);
        skin.alt = player.name;

        const name = document.createElement("div");

        name.className = "player-name";
        name.textContent = player.name;

        const tier = document.createElement("span");

        tier.className = "player-tier";
        tier.textContent = getPlayerTier(player, currentKit);

        name.appendChild(tier);

        playerInfo.appendChild(skin);
        playerInfo.appendChild(name);

        /* Points */
        const points = document.createElement("div");

        points.className = "player-points";

        const playerPoints = getPlayerPoints(player, currentKit);

        if (playerPoints === null) {
            points.textContent = "—";
        } else if (currentKit === "overall") {
            points.textContent = `${playerPoints} Points`;
        } else {
            points.textContent = `${playerPoints} Points`;
        }

        row.appendChild(number);
        row.appendChild(playerInfo);
        row.appendChild(points);

        playerList.appendChild(row);
    });
}


/* =========================
   UPDATE INFO
========================= */

function updateInfo() {
    const kit = kits.find((item) => item.id === currentKit);

    if (!kit) {
        return;
    }

    infoIcon.src = kit.image;
    infoIcon.alt = kit.name;

    infoTitle.textContent = kit.name;
    infoDescription.textContent = kit.description;
}


/* =========================
   SEARCH
========================= */

playerSearch.addEventListener("input", (event) => {
    searchText = event.target.value.trim();

    renderPlayers();
});


/* =========================
   MOBILE MENU
========================= */

menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});


/* =========================
   LANGUAGE
========================= */

const translations = {
    ja: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "プレイヤーを検索...",
        description: "全キットを基準にした総合ランキングです。"
    },

    en: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Search player...",
        description: "Overall ranking based on all kits."
    },

    ko: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "플레이어 검색...",
        description: "모든 키트를 기준으로 한 종합 랭킹입니다."
    },

    zh: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "搜索玩家...",
        description: "基于所有套装的综合排名。"
    },

    es: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Buscar jugador...",
        description: "Clasificación general basada en todos los kits."
    },

    fr: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Rechercher un joueur...",
        description: "Classement général basé sur tous les kits."
    },

    de: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Spieler suchen...",
        description: "Gesamtrangliste basierend auf allen Kits."
    },

    pt: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Pesquisar jogador...",
        description: "Ranking geral baseado em todos os kits."
    }
};


function applyLanguage(language) {
    const translation = translations[language];

    if (!translation) {
        return;
    }

    const navLinks = document.querySelectorAll(".nav-links a");

    if (navLinks.length >= 4) {
        navLinks[0].textContent = translation.home;
        navLinks[1].textContent = translation.discord;
        navLinks[2].textContent = translation.tierlist;
        navLinks[3].textContent = translation.support;
    }

    const mobileLinks = document.querySelectorAll(".mobile-menu a");

    if (mobileLinks.length >= 4) {
        mobileLinks[0].textContent = translation.home;
        mobileLinks[1].textContent = translation.discord;
        mobileLinks[2].textContent = translation.tierlist;
        mobileLinks[3].textContent = translation.support;
    }

    playerSearch.placeholder = translation.search;

    if (currentKit === "overall") {
        infoDescription.textContent = translation.description;
    }

    localStorage.setItem("pvpbattles-language", language);
}


languageSelect.addEventListener("change", () => {
    applyLanguage(languageSelect.value);
});


/* =========================
   AUTO LANGUAGE
========================= */

function initializeLanguage() {
    const savedLanguage =
        localStorage.getItem("pvpbattles-language");

    if (savedLanguage && translations[savedLanguage]) {
        languageSelect.value = savedLanguage;
        applyLanguage(savedLanguage);
        return;
    }

    const browserLanguage =
        navigator.language.toLowerCase();

    let detected = "ja";

    if (browserLanguage.startsWith("en")) {
        detected = "en";
    } else if (browserLanguage.startsWith("ko")) {
        detected = "ko";
    } else if (browserLanguage.startsWith("zh")) {
        detected = "zh";
    } else if (browserLanguage.startsWith("es")) {
        detected = "es";
    } else if (browserLanguage.startsWith("fr")) {
        detected = "fr";
    } else if (browserLanguage.startsWith("de")) {
        detected = "de";
    } else if (browserLanguage.startsWith("pt")) {
        detected = "pt";
    }

    languageSelect.value = detected;
    applyLanguage(detected);
}


/* =========================
   START
========================= */

renderKitTabs();
renderPlayers();
updateInfo();
initializeLanguage();
