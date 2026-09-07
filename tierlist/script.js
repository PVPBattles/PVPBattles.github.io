"use strict";

/* =========================
   KIT DATA
========================= */

const kits = [
    {
        id: "overall",
        name: "overall",
        image: "../assets/tierlist/overall.png",
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
        description: "Pot PvP rankings."
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
        description: "NethPot PvP rankings."
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

const tableHeader = document.getElementById("tableHeader");

const infoIcon = document.getElementById("infoIcon");
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById(
    "infoDescription"
);

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

const languageSelect =
    document.getElementById("languageSelect");

/* =========================
   SKIN
========================= */

function getSkinUrl(playerName) {
    return (
        "https://mc-heads.net/avatar/" +
        encodeURIComponent(playerName) +
        "/48"
    );
}

/* =========================
   KIT TABS
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

        const text = document.createElement("span");

        text.textContent = kit.name;

        button.appendChild(image);
        button.appendChild(text);

        button.addEventListener("click", () => {

            currentKit = kit.id;

            renderKitTabs();
            renderTable();
            updateInfo();
        });

        kitTabs.appendChild(button);
    });
}

/* =========================
   OVERALL POINTS
========================= */

function getOverallPoints(player) {

    let total = 0;

    for (const kit of kits) {

        if (kit.id === "overall") {
            continue;
        }

        const tier = player.tiers[kit.id];

        if (!tierPoints[tier]) {
            return null;
        }

        total += tierPoints[tier];
    }

    return Math.round((total / 80) * 300);
}

/* =========================
   SORT PLAYERS
========================= */

function getSortedPlayers() {

    const filtered = players.filter((player) => {

        return player.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });

    if (currentKit === "overall") {

        return filtered.sort((a, b) => {

            const aPoints = getOverallPoints(a);
            const bPoints = getOverallPoints(b);

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
    }

    return filtered.sort((a, b) => {

        const aTier = tierPoints[a.tiers[currentKit]] || 0;
        const bTier = tierPoints[b.tiers[currentKit]] || 0;

        return bTier - aTier;
    });
}

/* =========================
   TABLE HEADER
========================= */

function renderTableHeader() {

    tableHeader.innerHTML = "";

    if (currentKit === "overall") {

        tableHeader.className =
            "table-header overall-header";

        const rank = document.createElement("div");

        rank.textContent = "#";

        const player = document.createElement("div");

        player.textContent = "PLAYER";

        tableHeader.appendChild(rank);
        tableHeader.appendChild(player);

        kits.slice(1).forEach((kit) => {

            const kitHeader =
                document.createElement("div");

            kitHeader.className = "overall-kit-head";

            const image = document.createElement("img");

            image.src = kit.image;
            image.alt = kit.name;

            const name = document.createElement("span");

            name.textContent = kit.name;

            kitHeader.appendChild(image);
            kitHeader.appendChild(name);

            tableHeader.appendChild(kitHeader);
        });

        const points = document.createElement("div");

        points.textContent = "POINTS";

        tableHeader.appendChild(points);

        return;
    }

    tableHeader.className =
        "table-header kit-header";

    const rank = document.createElement("div");

    rank.textContent = "#";

    const player = document.createElement("div");

    player.textContent = "PLAYER";

    const tier = document.createElement("div");

    tier.textContent = "TIER / POINTS";

    tableHeader.appendChild(rank);
    tableHeader.appendChild(player);
    tableHeader.appendChild(tier);
}

/* =========================
   CREATE PLAYER INFO
========================= */

function createPlayerInfo(player) {

    const wrapper = document.createElement("div");

    wrapper.className = "player-info";

    const skin = document.createElement("img");

    skin.className = "player-skin";
    skin.src = getSkinUrl(player.name);
    skin.alt = player.name;

    const name = document.createElement("div");

    name.className = "player-name";
    name.textContent = player.name;

    wrapper.appendChild(skin);
    wrapper.appendChild(name);

    return wrapper;
}

/* =========================
   OVERALL ROW
========================= */

function createOverallRow(player, index) {

    const row = document.createElement("div");

    row.className =
        "player-row overall-row";

    const number = document.createElement("div");

    number.className = "player-number";
    number.textContent = index + 1;

    row.appendChild(number);

    row.appendChild(createPlayerInfo(player));

    kits.slice(1).forEach((kit) => {

        const tier = document.createElement("div");

        tier.className = "overall-tier";

        tier.textContent =
            player.tiers[kit.id] || "-";

        row.appendChild(tier);
    });

    const points = document.createElement("div");

    points.className = "overall-points";

    const overallPoints =
        getOverallPoints(player);

    points.textContent =
        overallPoints === null
            ? "-"
            : `${overallPoints} Points`;

    row.appendChild(points);

    return row;
}

/* =========================
   NORMAL KIT ROW
========================= */

function createKitRow(player, index) {

    const row = document.createElement("div");

    row.className =
        "player-row kit-row";

    const number = document.createElement("div");

    number.className = "player-number";
    number.textContent = index + 1;

    const info = createPlayerInfo(player);

    const tier = player.tiers[currentKit] || "-";

    const points = document.createElement("div");

    points.className = "player-points";

    if (tierPoints[tier]) {

        points.textContent =
            `${tier} · ${tierPoints[tier]} Points`;

    } else {

        points.textContent = "-";
    }

    row.appendChild(number);
    row.appendChild(info);
    row.appendChild(points);

    return row;
}

/* =========================
   RENDER TABLE
========================= */

function renderTable() {

    playerList.innerHTML = "";

    renderTableHeader();

    const filteredPlayers = getSortedPlayers();

    if (filteredPlayers.length === 0) {

        const empty =
            document.createElement("div");

        empty.className = "empty-message";

        empty.textContent = "No players found.";

        playerList.appendChild(empty);

        return;
    }

    filteredPlayers.forEach((player, index) => {

        if (currentKit === "overall") {

            playerList.appendChild(
                createOverallRow(player, index)
            );

        } else {

            playerList.appendChild(
                createKitRow(player, index)
            );
        }
    });
}

/* =========================
   INFO
========================= */

function updateInfo() {

    const kit = kits.find(
        (item) => item.id === currentKit
    );

    if (!kit) {
        return;
    }

    infoIcon.src = kit.image;
    infoIcon.alt = kit.name;

    infoTitle.textContent = kit.name;
    infoDescription.textContent =
        kit.description;
}

/* =========================
   SEARCH
========================= */

playerSearch.addEventListener(
    "input",
    (event) => {

        searchText =
            event.target.value.trim();

        renderTable();
    }
);

/* =========================
   MOBILE MENU
========================= */

menuButton.addEventListener(
    "click",
    () => {

        mobileMenu.classList.toggle("open");
    }
);

/* =========================
   LANGUAGE
========================= */

const translations = {

    ja: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "プレイヤーを検索..."
    },

    en: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Search player..."
    },

    ko: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "플레이어 검색..."
    },

    zh: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "搜索玩家..."
    },

    es: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Buscar jugador..."
    },

    fr: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Rechercher un joueur..."
    },

    de: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Spieler suchen..."
    },

    pt: {
        home: "Home",
        discord: "Discord",
        tierlist: "TierList",
        support: "Support",
        search: "Pesquisar jogador..."
    }
};

function applyLanguage(language) {

    const translation =
        translations[language];

    if (!translation) {
        return;
    }

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );

    if (navLinks.length >= 4) {

        navLinks[0].textContent =
            translation.home;

        navLinks[1].textContent =
            translation.discord;

        navLinks[2].textContent =
            translation.tierlist;

        navLinks[3].textContent =
            translation.support;
    }

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );

    if (mobileLinks.length >= 4) {

        mobileLinks[0].textContent =
            translation.home;

        mobileLinks[1].textContent =
            translation.discord;

        mobileLinks[2].textContent =
            translation.tierlist;

        mobileLinks[3].textContent =
            translation.support;
    }

    playerSearch.placeholder =
        translation.search;

    localStorage.setItem(
        "pvpbattles-language",
        language
    );
}

languageSelect.addEventListener(
    "change",
    () => {

        applyLanguage(
            languageSelect.value
        );
    }
);

/* =========================
   LANGUAGE INIT
========================= */

function initializeLanguage() {

    const saved =
        localStorage.getItem(
            "pvpbattles-language"
        );

    if (saved && translations[saved]) {

        languageSelect.value = saved;

        applyLanguage(saved);

        return;
    }

    const browser =
        navigator.language.toLowerCase();

    let language = "ja";

    if (browser.startsWith("en")) {
        language = "en";
    } else if (browser.startsWith("ko")) {
        language = "ko";
    } else if (browser.startsWith("zh")) {
        language = "zh";
    } else if (browser.startsWith("es")) {
        language = "es";
    } else if (browser.startsWith("fr")) {
        language = "fr";
    } else if (browser.startsWith("de")) {
        language = "de";
    } else if (browser.startsWith("pt")) {
        language = "pt";
    }

    languageSelect.value = language;

    applyLanguage(language);
}

/* =========================
   START
========================= */

renderKitTabs();
renderTable();
updateInfo();
initializeLanguage();
