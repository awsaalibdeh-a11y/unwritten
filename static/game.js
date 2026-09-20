"use strict";

/* Unwritten — game engine.
   The browser owns the whole life: stats, money, school, work, people, death. The server only
   writes words. Every number the AI suggests passes through clamps here, so a strange reply
   can colour the story but never break the game. */

/* ================= data ================= */

const STATS = ["happiness", "health", "smarts", "looks"];
const STAT_META = {
  happiness: { label: "Happiness", color: "var(--happy)" },
  health: { label: "Health", color: "var(--health)" },
  smarts: { label: "Smarts", color: "var(--smarts)" },
  looks: { label: "Looks", color: "var(--looks)" },
};

const COUNTRIES = {
  "Saudi Arabia": {
    female: ["Noura", "Sara", "Lama", "Reem", "Haya", "Dana", "Joud", "Layan", "Maha", "Rahaf", "Shahad", "Lulwa", "Ghada", "Ruba", "Aljawhara"],
    male: ["Abdullah", "Faisal", "Khalid", "Saud", "Turki", "Omar", "Yousef", "Nawaf", "Fahad", "Saad", "Rakan", "Ziyad", "Mishal", "Bandar", "Majed"],
    last: ["Al-Otaibi", "Al-Qahtani", "Al-Harbi", "Al-Ghamdi", "Al-Zahrani", "Al-Dosari", "Al-Shehri", "Al-Mutairi", "Al-Anazi", "Al-Subaie"],
  },
  "United States": {
    female: ["Emma", "Olivia", "Ava", "Mia", "Harper", "Chloe", "Madison", "Grace", "Lily", "Zoe"],
    male: ["Liam", "Noah", "Mason", "Ethan", "Logan", "Lucas", "Jackson", "Aiden", "Carter", "Wyatt"],
    last: ["Johnson", "Miller", "Davis", "Garcia", "Rodriguez", "Walker", "Brooks", "Carter", "Hayes", "Reed"],
  },
  "United Kingdom": {
    female: ["Amelia", "Isla", "Poppy", "Freya", "Evie", "Ella", "Florence", "Rosie", "Imogen", "Harriet"],
    male: ["Oliver", "George", "Harry", "Jack", "Charlie", "Alfie", "Theo", "Arthur", "Freddie", "Archie"],
    last: ["Smith", "Jones", "Taylor", "Brown", "Wilson", "Evans", "Thomas", "Roberts", "Hughes", "Clarke"],
  },
  Egypt: {
    female: ["Nour", "Mariam", "Salma", "Habiba", "Farida", "Malak", "Jana", "Hana", "Yasmin", "Laila"],
    male: ["Ahmed", "Mohamed", "Mostafa", "Karim", "Youssef", "Omar", "Hamza", "Ali", "Seif", "Adam"],
    last: ["Hassan", "Mahmoud", "Ibrahim", "Mostafa", "Saad", "Fathy", "Salem", "Nasser", "Kamel", "Farouk"],
  },
  Japan: {
    female: ["Yui", "Hina", "Sakura", "Aoi", "Mei", "Rin", "Yuna", "Haruka", "Nanami", "Koharu"],
    male: ["Haruto", "Sota", "Yuto", "Ren", "Riku", "Kaito", "Hayato", "Sora", "Takumi", "Yuki"],
    last: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato"],
  },
  Brazil: {
    female: ["Ana", "Beatriz", "Larissa", "Camila", "Júlia", "Mariana", "Gabriela", "Letícia", "Isabela", "Fernanda"],
    male: ["Lucas", "Gabriel", "Mateus", "Pedro", "Rafael", "Gustavo", "Felipe", "Thiago", "Bruno", "Diego"],
    last: ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa", "Ferreira", "Almeida", "Ribeiro"],
  },
  India: {
    female: ["Aanya", "Diya", "Ishita", "Kavya", "Meera", "Priya", "Riya", "Saanvi", "Tara", "Anika"],
    male: ["Aarav", "Arjun", "Rohan", "Vivaan", "Aditya", "Karan", "Rahul", "Dev", "Ishaan", "Kabir"],
    last: ["Sharma", "Patel", "Gupta", "Reddy", "Iyer", "Singh", "Nair", "Mehta", "Rao", "Joshi"],
  },
};
const PET_ICON = { Dog: "🐶", Cat: "🐱" };
const PET_NAMES = ["Biscuit", "Luna", "Milo", "Coco", "Pepper", "Simba", "Nala", "Oreo", "Ziggy", "Maple", "Tiger", "Pumpkin"];

// [title, yearly salary, education needed, minimum smarts, icon]
const JOBS = [
  ["Fast food crew", 22000, "none", 0, "🍔"],
  ["Retail associate", 26000, "none", 0, "🛍️"],
  ["Janitor", 27000, "none", 0, "🧹"],
  ["Delivery driver", 30000, "none", 10, "🛵"],
  ["Warehouse worker", 32000, "none", 10, "📦"],
  ["Receptionist", 34000, "high school", 30, "📞"],
  ["Chef", 46000, "high school", 35, "🍳"],
  ["Mechanic", 45000, "high school", 40, "🔧"],
  ["Flight attendant", 50000, "high school", 35, "🛫"],
  ["Firefighter", 52000, "high school", 40, "🚒"],
  ["Graphic designer", 54000, "high school", 50, "🎨"],
  ["Police officer", 55000, "high school", 45, "🚓"],
  ["Real estate agent", 58000, "high school", 45, "🏡"],
  ["Teacher", 50000, "university", 55, "🍎"],
  ["Journalist", 58000, "university", 60, "📰"],
  ["Nurse", 68000, "university", 60, "💉"],
  ["Accountant", 72000, "university", 65, "🧮"],
  ["Architect", 88000, "university", 70, "📐"],
  ["Engineer", 95000, "university", 72, "⚙️"],
  ["Veterinarian", 100000, "university", 76, "🐾"],
  ["Software engineer", 115000, "university", 75, "💻"],
  ["Pharmacist", 120000, "university", 78, "💊"],
  ["Data scientist", 125000, "university", 80, "📊"],
  ["Lawyer", 125000, "university", 80, "⚖️"],
  ["Pilot", 140000, "university", 72, "✈️"],
  ["Doctor", 190000, "university", 88, "🩺"],
];
// [title, yearly pay, minimum smarts, icon]
const PART_TIME = [["Dog walker", 6000, 0, "🐕"], ["Grocery bagger", 7500, 0, "🛒"], ["Tutor", 8000, 60, "📖"], ["Barista", 9000, 0, "☕"], ["Lifeguard", 10000, 0, "🏊"]];
const EDU_RANK = { none: 0, "high school": 1, university: 2 };
const RANKS = ["", "Senior", "Lead", "Head"];

const ACTIVITIES = [
  { id: "nap", icon: "😴", label: "Take a nap", sub: "Every baby's favourite hobby", min: 0, max: 4, fx: { happiness: [2, 5], health: [1, 3] }, log: "You had a long, cosy nap." },
  { id: "walk", icon: "🚶", label: "Go for a walk", sub: "Fresh air never hurts", min: 4, fx: { happiness: [2, 5], health: [1, 3] }, log: "You went for a long walk." },
  { id: "library", icon: "📚", label: "Read at the library", sub: "Smarts", min: 6, fx: { smarts: [2, 6] }, log: "You spent an afternoon reading at the library." },
  { id: "games", icon: "🎮", label: "Play video games", sub: "Happiness, maybe at a cost", min: 6, fx: { happiness: [4, 8], smarts: [-1, 1] }, log: "You lost a whole evening to video games." },
  { id: "instrument", icon: "🎸", label: "Practise an instrument", sub: "Smarts & happiness", min: 7, fx: { smarts: [2, 4], happiness: [1, 4] }, log: "You practised your instrument until your fingers ached." },
  { id: "meditate", icon: "🧘", label: "Meditate", sub: "Happiness", min: 10, fx: { happiness: [3, 7], health: [0, 2] }, log: "You meditated and felt calmer." },
  { id: "gym", icon: "🏋️", label: "Hit the gym", sub: "Health & looks", min: 12, fx: { health: [3, 7], looks: [1, 3] }, log: "You worked out at the gym." },
  { id: "volunteer", icon: "🤝", label: "Volunteer", sub: "Happiness & smarts", min: 12, fx: { happiness: [3, 6], smarts: [1, 2] }, log: "You volunteered in your community.", highlight: true },
  { id: "makeover", icon: "💇", label: "Get a makeover", sub: "Looks", min: 13, cost: 120, fx: { looks: [4, 9], happiness: [1, 3] }, log: "You got a fresh new look." },
  { id: "doctor", icon: "🩺", label: "Visit the doctor", sub: "Health", min: 0, cost: 150, costFrom: 18, fx: { health: [4, 14] },
    log: "You got a check-up at the doctor.", plateau: "The doctor found nothing to fix and sent you home.",
    blocked: () => (life.stats.health >= 92 ? "You're in perfect health — the doctor would just send you home." : null) },
  { id: "vacation", icon: "🏖️", label: "Take a vacation", sub: "A lot of happiness", min: 18, cost: 1800, fx: { happiness: [8, 15], health: [1, 3] }, log: "You took a relaxing vacation.", highlight: true },
];

const CARS = [["Used hatchback", 4000, "🚗"], ["Family sedan", 22000, "🚙"], ["SUV", 38000, "🛻"], ["Electric car", 45000, "🔋"], ["Sports car", 95000, "🏎️"]];
const HOMES = [["Studio apartment", 120000, "🏢"], ["Townhouse", 280000, "🏘️"], ["Family house", 420000, "🏠"], ["Beach villa", 1200000, "🏝️"], ["Mansion", 3000000, "🏰"]];

const SAVE_KEY = "unwritten_life_v1";
const GRAVE_KEY = "unwritten_graveyard_v1";

/* ================= utils ================= */

const $ = (id) => document.getElementById(id);
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const uid = () => Math.random().toString(36).slice(2, 10);
const fmtMoney = (n) => `${n < 0 ? "−" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
const firstName = (name) => String(name || "").split(" ")[0];
const an = (word) => `${/^[aeiou]/i.test(word) ? "an" : "a"} ${word}`;

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "style") e.setAttribute("style", v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    e.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return e;
}

// document.createElement("svg") makes an inert HTML element; sprite icons need the SVG namespace.
function svgIcon(id, size, cls) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  if (cls) svg.setAttribute("class", cls);
  const use = document.createElementNS(NS, "use");
  use.setAttribute("href", `#${id}`);
  svg.append(use);
  return svg;
}

function toast(text) {
  const t = $("toast");
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ================= state ================= */

let life = null;
let busy = false; // an AI exchange is in flight — no ageing up mid-story

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(life)); } catch { /* storage full or blocked — play on */ }
}
function load() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch { return null; }
}
function graveyard() {
  try { return JSON.parse(localStorage.getItem(GRAVE_KEY) || "[]"); } catch { return []; }
}

function stage(age) {
  if (age < 4) return "Baby";
  if (age < 13) return "Child";
  if (age < 18) return "Teen";
  if (age < 65) return "Adult";
  return "Senior";
}
const STAGE_RING = { Baby: "#ffd89a", Child: "#4be3a0", Teen: "#4fb6ff", Adult: "#ffb347", Senior: "#b98cff" };

function randomName(country, gender) {
  const pool = COUNTRIES[country] || COUNTRIES["United States"];
  return `${pick(pool[gender])} ${pick(pool.last)}`;
}

function newPerson(role, name, age, bond, extra = {}) {
  return { id: uid(), role, name, age, bond, alive: true, ...extra };
}

function createLife({ name, gender, country }) {
  const pool = COUNTRIES[country];
  const last = name.split(" ").slice(1).join(" ") || pick(pool.last);
  const people = [
    newPerson("Mother", `${pick(pool.female)} ${last}`, randInt(20, 38), randInt(62, 95)),
    newPerson("Father", `${pick(pool.male)} ${last}`, randInt(22, 42), randInt(58, 92)),
  ];
  for (let i = 0; i < randInt(0, 2); i++) {
    const g = Math.random() < 0.5 ? "female" : "male";
    people.push(newPerson(g === "female" ? "Sister" : "Brother", `${pick(pool[g])} ${last}`, randInt(1, 8), randInt(45, 85), { gender: g }));
  }
  life = {
    v: 1,
    id: uid(),
    name,
    gender,
    country,
    age: 0,
    alive: true,
    cause: null,
    stats: { happiness: randInt(55, 100), health: randInt(60, 100), smarts: randInt(15, 100), looks: randInt(15, 100) },
    money: 0,
    school: null,
    education: "none",
    job: null,
    retired: null,
    people,
    assets: [],
    log: [],
    highlights: [],
    doneThisYear: {},
    jobBoard: null,
  };
  const mom = people[0], dad = people[1];
  addLog(`You were born in ${country} to ${firstName(mom.name)} and ${firstName(dad.name)}.`, "milestone", { highlight: true });
  const sibs = people.filter((p) => p.role === "Sister" || p.role === "Brother");
  if (sibs.length) {
    const who = sibs.length === 2 && sibs[0].role === sibs[1].role
      ? `${sibs[0].role.toLowerCase()}s ${firstName(sibs[0].name)} and ${firstName(sibs[1].name)}`
      : sibs.map((s) => `${s.role.toLowerCase()} ${firstName(s.name)}`).join(" and ");
    addLog(`Your ${who} came to meet you.`, "milestone");
  }
  save();
}

/* ================= log ================= */

let renderedAge = null;

function addLog(text, kind = "event", opts = {}) {
  const entry = { age: life.age, text, kind, title: opts.title || null };
  life.log.push(entry);
  if (life.log.length > 1500) life.log.splice(0, life.log.length - 1500);
  if (opts.highlight) highlight(text);
  appendLogEntry(entry);
}

function highlight(text) {
  life.highlights.push(`Age ${life.age}: ${text}`);
  if (life.highlights.length > 60) life.highlights.splice(0, life.highlights.length - 60);
}

function appendLogEntry(entry) {
  const log = $("log");
  if (!log || $("game-screen").hidden) return;
  log.querySelector(".log-empty")?.remove();
  if (entry.age !== renderedAge) {
    log.append(el("div", { class: "log-age" }, entry.age === 0 ? "Born" : `Age ${entry.age}`));
    renderedAge = entry.age;
  }
  const line = el("p", { class: `log-line kind-${entry.kind}` });
  if (entry.title) line.append(el("span", { class: "log-title" }, entry.title));
  line.append(entry.text);
  log.append(line);
  if (!bulkRender) scrollLogToEnd(true);
}

let bulkRender = false;
// Smooth scrolling is animated by the browser and can stall part-way in a covered window, so a
// timer always finishes the job.
function scrollLogToEnd(smooth) {
  const log = $("log");
  log.scrollTo({ top: log.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  clearTimeout(scrollLogToEnd.timer);
  if (smooth) scrollLogToEnd.timer = setTimeout(() => { log.scrollTop = log.scrollHeight; }, 450);
}

function renderLog() {
  const log = $("log");
  log.innerHTML = "";
  renderedAge = null;
  bulkRender = true;
  for (const entry of life.log) appendLogEntry(entry);
  bulkRender = false;
  if (life.age === 0 && life.log.length <= 2) {
    log.append(el("p", { class: "log-empty" }, "The rest of your story is unwritten. Tap Age to live your first year."));
  }
  scrollLogToEnd(false);
}

/* ================= render ================= */

function renderHero() {
  const st = stage(life.age);
  const avatar = $("avatar");
  avatar.textContent = life.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  avatar.style.setProperty("--avatar", life.gender === "female"
    ? "linear-gradient(135deg, #ff7eb3, #a26bff)"
    : "linear-gradient(135deg, #4fb6ff, #5a5cff)");
  avatar.style.setProperty("--ring", STAGE_RING[st]);
  $("hero-name").textContent = life.name;
  const role = life.job ? life.job.title : life.retired ? "Retired" : life.school ? schoolLabel(life.school) : st;
  $("hero-sub").textContent = `Age ${life.age} · ${role}`;
  const money = $("money");
  money.textContent = fmtMoney(life.money);
  money.classList.toggle("negative", life.money < 0);
  $("dock-career-label").textContent = life.age < 18 || life.school ? "School" : "Career";
}

function renderStats() {
  const box = $("stats");
  box.innerHTML = "";
  for (const s of STATS) {
    const v = Math.round(life.stats[s]);
    box.append(el("div", { class: `stat-row${v < 25 ? " low" : ""}`, style: `--c: ${STAT_META[s].color}` },
      el("div", { class: "stat-top" }, el("span", { class: "stat-name" }, STAT_META[s].label), el("span", { class: "stat-val" }, `${v}%`)),
      el("div", { class: "bar" }, el("div", { class: "bar-fill", style: `width: ${v}%` }))));
  }
}

function renderAll() {
  renderHero();
  renderStats();
}

function showScreen(which) {
  for (const id of ["start-screen", "game-screen", "death-screen"]) $(id).hidden = id !== which;
}

/* ================= the year ================= */

const QUIET_YEAR = {
  Baby: ["You spent the year babbling at everyone who'd listen.", "You discovered your own feet. Fascinating.", "You mastered the art of the nap."],
  Child: ["You spent the year climbing everything in sight.", "You grew two inches and wanted everyone to notice.", "It was a year of scraped knees and big imaginations."],
  Teen: ["The year flew by in a blur of homework and group chats.", "You spent the year figuring out who you are.", "Your music taste changed completely. Again."],
  Adult: ["The year passed quietly — sometimes that's a gift.", "Work, rest, repeat. A steady kind of year.", "You settled into a comfortable rhythm."],
  Senior: ["You spent the year enjoying the little things.", "A peaceful year of long mornings and good tea.", "You told your favourite stories to anyone who'd listen."],
};

function ageUp() {
  if (!life?.alive || busy) return;
  closeSheet();
  life.age += 1;
  life.doneThisYear = {};
  const before = life.log.length;

  yearlyDrift();
  yearSchool();
  yearWork();
  yearPeople();
  yearAssets();

  if (life.stats.health <= 0) return die("poor health");
  if (rollDeath()) return;

  // a "quiet year" line only when the year really was quiet — never right above an event
  const eventful = Math.random() < (life.age < 3 ? 0.5 : 0.88);
  if (!eventful && life.log.length === before) addLog(pick(QUIET_YEAR[stage(life.age)]), "action");
  renderAll();
  save();
  if (eventful) runEvent();
}

function yearlyDrift() {
  const s = life.stats;
  for (const k of STATS) s[k] += rand(-2, 2);
  if (life.age > 45) s.health -= rand(0, (life.age - 45) / 8);
  if (life.age > 35) s.looks -= rand(0, life.age > 60 ? 2 : 1);
  const bonds = life.people.filter((p) => p.alive && !p.pet).map((p) => p.bond);
  if (bonds.length) s.happiness += (bonds.reduce((a, b) => a + b, 0) / bonds.length - 50) / 50;
  s.happiness += (60 - s.happiness) * 0.08; // moods drift back toward normal, good or bad
  if (life.money < -20000) s.happiness -= 1; // debt weighs on you
  for (const k of STATS) s[k] = clamp(s[k], 0, 100);
}

function schoolLabel(school) {
  if (school.stage === "university") return `University · year ${school.year}`;
  return { elementary: "Elementary school", middle: "Middle school", high: "High school" }[school.stage];
}

function yearSchool() {
  const a = life.age;
  const sc = life.school;
  if (sc) sc.grades = clamp(sc.grades + (life.stats.smarts - sc.grades) / 5 + rand(-6, 6), 0, 100);

  if (a === 5) {
    life.school = { stage: "elementary", grades: clamp(life.stats.smarts + rand(-15, 15), 20, 95) };
    addLog("You started elementary school. The backpack was bigger than you.", "milestone", { highlight: true });
  } else if (a === 11 && sc) {
    sc.stage = "middle";
    addLog("You started middle school.", "milestone");
  } else if (a === 14 && sc) {
    sc.stage = "high";
    addLog("You started high school. Everything felt very important.", "milestone");
  } else if (a === 18 && sc?.stage === "high") {
    life.school = null;
    life.education = "high school";
    const honours = sc.grades >= 85 ? " with honours" : "";
    addLog(`You graduated from high school${honours}!`, "milestone", { highlight: true });
    life.stats.happiness = clamp(life.stats.happiness + 6, 0, 100);
  } else if (sc?.stage === "university") {
    life.money -= 10000;
    if (sc.year >= 4) {
      life.school = null;
      life.education = "university";
      addLog(`You graduated from university${sc.grades >= 85 ? " at the top of your class" : ""}!`, "milestone", { highlight: true });
      life.stats.happiness = clamp(life.stats.happiness + 8, 0, 100);
    } else {
      sc.year += 1;
    }
  }
}

function yearWork() {
  const job = life.job;
  if (job) {
    job.years += 1;
    job.sinceRise = (job.sinceRise || 0) + 1;
    const saved = Math.round(job.salary * (job.partTime ? 0.6 : 0.35));
    life.money += saved;
    job.performance = clamp(job.performance - rand(0, 9), 0, 100);
    // a promotion takes a few good years, and each rung up needs more of them
    const canRise = !job.partTime && (job.level || 0) < RANKS.length - 1 && job.sinceRise >= 3 + (job.level || 0) * 2;
    if (canRise && job.performance >= 75 && Math.random() < 0.4) {
      job.level = (job.level || 0) + 1;
      job.sinceRise = 0;
      job.title = `${RANKS[job.level]} ${job.base.charAt(0).toLowerCase()}${job.base.slice(1)}`;
      job.salary = Math.round(job.salary * 1.22);
      job.performance -= 25;
      addLog(`You were promoted to ${job.title}! Your salary rose to ${fmtMoney(job.salary)}.`, "milestone", { highlight: true });
    } else if (job.performance < 15 && Math.random() < 0.4) {
      addLog(`You were let go from your job as ${an(job.title.toLowerCase())}.`, "bad", { highlight: true });
      life.stats.happiness = clamp(life.stats.happiness - 10, 0, 100);
      life.job = null;
    }
  } else if (life.retired) {
    life.money += life.retired.pension;
  } else if (life.age >= 22 && !life.school) {
    life.money -= 1500; // rent and groceries don't pay themselves
  }
}

function yearPeople() {
  for (const p of life.people) {
    if (!p.alive) continue;
    p.age += 1;
    p.bond = clamp(p.bond - rand(0, 3), 0, 100);
    const lifespan = p.pet ? 11 : 72;
    if (p.age > lifespan) {
      const risk = p.pet ? (p.age - lifespan) * 0.18 : Math.pow((p.age - lifespan) / 30, 2) * 0.35;
      if (Math.random() < risk) {
        p.alive = false;
        const close = p.bond >= 60;
        addLog(p.pet
          ? `Your ${p.role.toLowerCase()} ${p.name} passed away peacefully. You'll miss those happy greetings.`
          : `Your ${p.role.toLowerCase()} ${firstName(p.name)} passed away at ${p.age}.`, "bad", { highlight: true });
        life.stats.happiness = clamp(life.stats.happiness - (close ? rand(10, 18) : rand(4, 9)), 0, 100);
      }
    }
  }
}

function yearAssets() {
  for (const a of life.assets) a.value = a.kind === "car" ? Math.max(500, Math.round(a.value * 0.88)) : Math.round(a.value * 1.03);
}

function rollDeath() {
  const a = life.age;
  const base = a < 50 ? 0.0006 : Math.pow((a - 50) / 50, 3) * 0.28;
  const risk = base * (1.6 - life.stats.health / 100);
  if (Math.random() < risk) {
    die(a < 18 ? pick(["a sudden illness", "a freak accident"])
      : a < 60 ? pick(["a heart attack", "a sudden illness", "a car accident"])
      : pick(["old age", "old age", "heart failure", "pneumonia"]));
    return true;
  }
  return false;
}

/* ================= streaming + live typing ================= */

async function streamText(url, body, onChunk) {
  let res;
  try {
    res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    return { ok: false, error: "Can't reach the storyteller — check your connection." };
  }
  if (!res.ok) {
    let msg = "The storyteller stumbled. Try again.";
    try { msg = (await res.json()).error || msg; } catch { /* not JSON */ }
    return { ok: false, error: msg };
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  } catch {
    return { ok: false, error: "The connection dropped mid-story. Try again." };
  }
  return { ok: true };
}

// A timer, not requestAnimationFrame: browsers pause rAF for a covered or minimised window even
// while the page still counts as visible, which would freeze the story mid-sentence.
const FRAME_MS = 16;

// Reveals text at a steady typing pace no matter how the network delivers it — fast bursts are
// smoothed out, and if the model runs far ahead the pace quickens so it never lags behind.
class Typewriter {
  constructor(target, { caret = true } = {}) {
    // one writer per element: a retry must silence the previous attempt's pending frames
    target._typer?.stop();
    target._typer = this;
    this.el = target;
    this.text = "";
    this.shown = 0;
    this.ended = false;
    this.raf = 0;
    this.onDone = null;
    this.caret = el("span", { class: "caret" });
    this.showCaret = caret;
    this.el.textContent = "";
    if (caret) this.el.append(this.caret);
  }
  stop() {
    clearTimeout(this.raf);
    this.raf = 0;
    this.onDone = null;
    this.stopped = true;
  }
  set(text) {
    if (text === this.text) return;
    this.text = text;
    this.shown = Math.min(this.shown, text.length);
    this.kick();
  }
  end(onDone) {
    this.ended = true;
    this.onDone = onDone || null;
    this.kick();
  }
  kick() {
    if (!this.raf && !this.stopped) {
      this.last = performance.now();
      this.raf = setTimeout(() => this.tick(performance.now()), FRAME_MS);
    }
  }
  tick(now) {
    this.raf = 0;
    const dt = Math.min(1, (now - this.last) / 1000);
    this.last = now;
    const behind = this.text.length - this.shown;
    if (behind > 0) this.shown = Math.min(this.text.length, this.shown + Math.max(1, (48 + behind * 2.5) * dt));
    this.el.textContent = this.text.slice(0, Math.floor(this.shown));
    const caughtUp = this.shown >= this.text.length;
    if (this.showCaret && !(caughtUp && this.ended)) this.el.append(this.caret);
    if (!caughtUp) {
      this.raf = setTimeout(() => this.tick(performance.now()), FRAME_MS);
    } else if (this.ended && this.onDone) {
      const cb = this.onDone;
      this.onDone = null;
      cb();
    }
  }
}

const stripMarks = (s) => String(s || "").replace(/\*\*|__|`/g, "").trim();
// Short fields (titles, choices, the epitaph) sometimes come wrapped in quotes; story text keeps
// its quotes, since a line of dialogue can legitimately end one.
const stripQuotes = (s) => stripMarks(s).replace(/^["“”'‘’]+|["“”'‘’]+$/g, "").trim();

// The reply is a line protocol, so it can be understood while it's still arriving: the story
// types out as tokens land, and each choice becomes a button the moment its line is complete.
function parseEvent(buf, final) {
  const lines = buf.replace(/\r/g, "").split("\n");
  let title = "", text = "", inText = false;
  const choices = [];
  lines.forEach((line, i) => {
    const complete = final || i < lines.length - 1;
    let m;
    if ((m = line.match(/^\s*[*#]*\s*TITLE\s*[*]*:\s*(.*)$/i))) { title = stripQuotes(m[1]); inText = false; }
    else if ((m = line.match(/^\s*[*#]*\s*TEXT\s*[*]*:\s*(.*)$/i))) { text = m[1]; inText = true; }
    else if ((m = line.match(/^\s*[*]*([1-4])[*]*\s*[:.)\-]\s*(.+)$/))) { inText = false; if (complete) choices.push(stripQuotes(m[2])); }
    else if (inText && line.trim()) text += ` ${line.trim()}`;
  });
  return { title, text: stripMarks(text), choices: choices.filter(Boolean).slice(0, 4) };
}

function parseEffects(line) {
  const fx = {};
  for (const m of line.matchAll(/(happiness|health|smarts|looks|money)\s*[=:]\s*([+\-−]?\s*\$?\s*[\d,]+)/gi)) {
    fx[m[1].toLowerCase()] = parseInt(m[2].replace(/[\s$,]/g, "").replace("−", "-"), 10) || 0;
  }
  return fx;
}

function parseOutcome(buf, final) {
  const lines = buf.replace(/\r/g, "").split("\n");
  let text = "", inText = false, effects = null, bond = null, sawText = false;
  const loose = [];
  lines.forEach((line, i) => {
    const complete = final || i < lines.length - 1;
    let m;
    if ((m = line.match(/^\s*[*]*TEXT[*]*\s*:\s*(.*)$/i))) { text = m[1]; inText = true; sawText = true; }
    else if (/^\s*[*]*EFFECTS[*]*\s*:/i.test(line)) { inText = false; if (complete) effects = parseEffects(line); }
    else if ((m = line.match(/^\s*[*]*BOND[*]*\s*:\s*(.+?)\s*[=:]\s*([+\-−]?\d+)/i))) { inText = false; if (complete) bond = { name: m[1].trim(), delta: parseInt(m[2].replace("−", "-"), 10) || 0 }; }
    else if (inText && line.trim()) text += ` ${line.trim()}`;
    else if (!sawText && line.trim() && complete) loose.push(line.trim());
  });
  // a reply that forgot the TEXT: label still has a story in it — don't throw it away
  if (!sawText && final) text = loose.join(" ");
  return { text: stripMarks(text), effects, bond };
}

/* ================= events ================= */

function lifeForAI() {
  const people = life.people
    .filter((p) => p.alive)
    .sort((a, b) => b.bond - a.bond)
    .slice(0, 8)
    .map((p) => ({ name: p.pet ? p.name : firstName(p.name), role: p.role, bond: Math.round(p.bond) }));
  return {
    name: life.name,
    gender: life.gender,
    age: life.age,
    country: life.country,
    stats: Object.fromEntries(STATS.map((s) => [s, Math.round(life.stats[s])])),
    money: Math.round(life.money),
    school: life.school ? schoolLabel(life.school) : life.education !== "none" ? `finished ${life.education}` : null,
    job: life.job ? `${life.job.title}, ${fmtMoney(life.job.salary)} a year` : life.retired ? "retired" : null,
    people,
    recent: life.log.filter((e) => e.kind !== "action").slice(-8).map((e) => (e.title ? `${e.title}: ${e.text}` : e.text)),
  };
}

function setBusy(on) {
  busy = on;
  $("age-btn").disabled = on;
}

function openEventCard() {
  $("event-modal").hidden = false;
  $("event-kicker").textContent = `Age ${life.age} · ${stage(life.age)}`;
  for (const id of ["event-title", "event-text", "outcome-text"]) {
    $(id)._typer?.stop();
    $(id).textContent = "";
  }
  $("choices").innerHTML = "";
  $("outcome").hidden = true;
  $("chips").innerHTML = "";
  eventActions();
}

function closeEventCard() {
  $("event-modal").hidden = true;
  setBusy(false);
  renderAll();
  save();
}

function eventActions(...buttons) {
  const actions = $("event-actions");
  actions.innerHTML = "";
  actions.append(...buttons);
  actions.hidden = buttons.length === 0;
}

function showEventError(message, retry) {
  const box = $("choices");
  box.innerHTML = "";
  box.append(el("p", { class: "event-error" }, message));
  eventActions(
    el("button", { class: "ghost-btn", type: "button", onclick: () => { addLog(pick(QUIET_YEAR[stage(life.age)]), "action"); closeEventCard(); } }, "Skip"),
    el("button", { class: "primary-btn", type: "button", onclick: retry }, "Try again"),
  );
}

async function runEvent() {
  setBusy(true);
  openEventCard();
  // The title types first, then the story. Each gets its own writer so the caret always sits
  // exactly where the AI is "writing" at that moment.
  const titleTyper = new Typewriter($("event-title"));
  let textTyper = null;
  const slow = setTimeout(() => {
    if (!textTyper) $("event-text").replaceChildren(el("span", { class: "thinking" }, "The storyteller is gathering their thoughts…"));
  }, 5000);
  let buf = "";
  const res = await streamText("/api/event", { life: lifeForAI() }, (chunk) => {
    buf += chunk;
    const p = parseEvent(buf, false);
    titleTyper.set(p.title);
    if (p.text) {
      if (!textTyper) { titleTyper.end(); textTyper = new Typewriter($("event-text")); }
      textTyper.set(p.text);
    }
  });
  clearTimeout(slow);
  if (!res.ok) { titleTyper.stop(); textTyper?.stop(); return showEventError(res.error, runEvent); }

  const ev = parseEvent(buf, true);
  if (!ev.text || ev.choices.length < 2) {
    titleTyper.stop(); textTyper?.stop();
    return showEventError("The storyteller lost the thread. Give it another go?", runEvent);
  }
  ev.title = ev.title || "A new chapter";
  titleTyper.set(ev.title);
  titleTyper.end();
  textTyper = textTyper || new Typewriter($("event-text"));
  textTyper.set(ev.text);
  textTyper.end(() => renderChoices(ev));
}

// Choices are typed in too, all at once, each on its own card — clickable the moment they appear.
function renderChoices(ev, instant = false) {
  const box = $("choices");
  box.innerHTML = "";
  ev.choices.forEach((c, i) => {
    const label = el("span", {});
    box.append(el("button", {
      class: "choice",
      type: "button",
      style: `animation-delay: ${i * 0.06}s`,
      onclick: () => choose(ev, i),
    }, el("span", { class: "choice-key" }, String(i + 1)), label));
    if (instant) { label.textContent = c; return; }
    const t = new Typewriter(label, { caret: false });
    setTimeout(() => { t.set(c); t.end(); }, i * 60);
  });
}

async function choose(ev, index, luck = randInt(1, 100)) {
  const buttons = [...$("choices").querySelectorAll(".choice")];
  buttons.forEach((b, i) => {
    b.disabled = true;
    b.classList.toggle("picked", i === index);
    // finish any choice still mid-typing so the picked one reads in full
    const label = b.lastElementChild;
    label._typer?.stop();
    label.textContent = ev.choices[i];
  });
  $("outcome").hidden = false;
  $("chips").innerHTML = "";
  eventActions();
  const typer = new Typewriter($("outcome-text"));
  let buf = "";
  const res = await streamText("/api/outcome", {
    life: lifeForAI(),
    title: ev.title,
    text: ev.text,
    choice: ev.choices[index],
    luck,
  }, (chunk) => {
    buf += chunk;
    typer.set(parseOutcome(buf, false).text);
  });
  if (!res.ok) {
    typer.stop();
    $("outcome").hidden = true;
    // keep the same luck on retry, so trying again can't be used to re-roll a bad result
    return showEventError(res.error, () => { eventActions(); renderChoices(ev, true); choose(ev, index, luck); });
  }
  const out = parseOutcome(buf, true);
  const story = out.text || "It happened — though nobody can quite say how.";
  typer.set(story);
  typer.end(() => {
    const applied = applyEffects(out.effects || {}, out.bond);
    renderChips(applied);
    const big = applied.some((a) => (a.stat === "money" ? Math.abs(a.d) >= 1000 : Math.abs(a.d) >= 8));
    addLog(story, applied.some((a) => a.stat !== "money" && a.stat !== "bond" && a.d <= -8) ? "bad" : "event",
      { title: `${ev.title} · ${ev.choices[index]}`, highlight: big });
    renderAll();
    save();
    const fatal = life.stats.health <= 0;
    eventActions(el("button", {
      class: "primary-btn",
      type: "button",
      onclick: fatal ? () => { $("event-modal").hidden = true; setBusy(false); die("poor health"); } : closeEventCard,
    }, "Continue"));
  });
}

// The model proposes; the game disposes. Every suggested change is clamped to what this game
// allows, and money is scaled to the character, so no reply can hand a child a fortune.
function applyEffects(fx, bond) {
  const applied = [];
  for (const s of STATS) {
    const d = Math.round(clamp(Number(fx[s]) || 0, -15, 15));
    if (!d) continue;
    life.stats[s] = clamp(life.stats[s] + d, 0, 100);
    applied.push({ stat: s, d });
  }
  const moneyCap = life.age < 16 ? 150 : Math.max(2500, Math.abs(life.money) * 0.35, life.job ? life.job.salary * 0.5 : 0);
  const dm = Math.round(clamp(Number(fx.money) || 0, -moneyCap, moneyCap));
  if (dm) {
    life.money += dm;
    applied.push({ stat: "money", d: dm });
  }
  if (bond?.name) {
    const key = bond.name.toLowerCase();
    const person = life.people.find((p) => p.alive && (p.pet ? p.name : firstName(p.name)).toLowerCase() === key);
    const d = Math.round(clamp(bond.delta, -20, 20));
    if (person && d) {
      person.bond = clamp(person.bond + d, 0, 100);
      applied.push({ stat: "bond", d, name: person.pet ? person.name : firstName(person.name) });
    }
  }
  return applied;
}

function renderChips(applied) {
  const box = $("chips");
  box.innerHTML = "";
  if (!applied.length) {
    box.append(el("span", { class: "chip", style: "--c: var(--dim)" }, "No change"));
    return;
  }
  applied.forEach((a, i) => {
    const sign = a.d > 0 ? "+" : "−";
    let label, color;
    if (a.stat === "money") { label = `${sign}${fmtMoney(Math.abs(a.d))}`; color = a.d > 0 ? "var(--money)" : "var(--bad)"; }
    else if (a.stat === "bond") { label = `${sign}${Math.abs(a.d)} with ${a.name}`; color = a.d > 0 ? "var(--lamp)" : "var(--bad)"; }
    else { label = `${sign}${Math.abs(a.d)} ${STAT_META[a.stat].label}`; color = a.d > 0 ? STAT_META[a.stat].color : "var(--bad)"; }
    box.append(el("span", { class: `chip${a.d < 0 ? " down" : ""}`, style: `--c: ${color}; animation-delay: ${i * 0.08}s` }, label));
  });
}

/* ================= sheets ================= */

let sheetView = null;

function openSheet(view, arg) {
  sheetView = { view, arg };
  $("sheet").hidden = false;
  $("sheet-backdrop").hidden = false;
  renderSheet();
}
function closeSheet() {
  $("sheet").hidden = true;
  $("sheet-backdrop").hidden = true;
  sheetView = null;
}
function renderSheet() {
  if (!sheetView) return;
  const body = $("sheet-body");
  body.innerHTML = "";
  ({ career: sheetCareer, people: sheetPeople, person: sheetPerson, assets: sheetAssets, activities: sheetActivities })[sheetView.view](body, sheetView.arg);
  renderAll();
}

/* No energy meter: every action is simply once a year, and the row says so once you've used it.
   A year is the resource — if you want the gym AND the doctor, you have to live longer. */

const done = (id) => !!(life.doneThisYear && life.doneThisYear[id]);

function useAction(id, cost = 0) {
  if (done(id)) {
    toast("You already did that this year. Tap Age to move on.");
    return false;
  }
  // free actions must stay free even for someone deep in student debt
  if (cost > 0 && cost > life.money) {
    toast(`You can't afford that (${fmtMoney(cost)}).`);
    return false;
  }
  if (!life.doneThisYear) life.doneThisYear = {};
  life.doneThisYear[id] = true;
  life.money -= cost;
  return true;
}

// Gains shrink as a stat approaches 100, so no amount of repetition pins you at a perfect 100:
// the same hour at the gym is worth far less to an athlete than to a couch potato.
function bump(stat, lo, hi) {
  const raw = rand(lo, hi);
  const room = (100 - life.stats[stat]) / 100;
  // curve, not a cliff: full value at rock bottom, about a third at 80, nothing at all near 100
  const d = Math.round(raw > 0 ? raw * Math.pow(room, 0.75) : raw);
  life.stats[stat] = clamp(life.stats[stat] + d, 0, 100);
  return d;
}

function row({ icon, color, title, sub, side, sideClass, onclick, disabled, bar, barColor, doneId }) {
  const isDone = doneId ? done(doneId) : false;
  const tag = onclick ? "button" : "div";
  const emoji = /\p{Extended_Pictographic}/u.test(icon);
  return el(tag, {
    class: `row${isDone ? " is-done" : ""}`, type: onclick ? "button" : null, onclick,
    disabled: disabled || null, style: color ? `--c: ${color}` : null,
  },
    el("span", { class: `row-icon${emoji ? " emoji" : ""}` }, icon),
    el("span", { class: "row-main" },
      el("span", { class: "row-title" }, title),
      sub ? el("span", { class: "row-sub", style: "display:block" }, sub) : null,
      bar !== undefined ? el("span", { class: "mini-bar", style: `display:block; ${barColor ? `--c:${barColor}` : ""}` }, el("span", { style: `width:${Math.round(bar)}%` })) : null),
    isDone ? el("span", { class: "row-side done" }, "✓ done") : side ? el("span", { class: `row-side ${sideClass || ""}` }, side) : null,
    onclick && !disabled && !isDone ? svgIcon("i-chevron", 16, "chev") : null);
}
function sectionLabel(body, text) { body.append(el("p", { class: "section-label" }, text)); }

/* ----- school & career ----- */

function sheetCareer(body) {
  $("sheet-title").textContent = life.age < 18 || life.school ? "School" : "Career";
  const a = life.age;

  if (a < 5) {
    body.append(el("p", { class: "note" }, "Too young for school. Your only job right now is being adorable."));
    return;
  }

  if (life.school) {
    sectionLabel(body, "School");
    body.append(row({ icon: life.school.stage === "university" ? "🎓" : "🏫", color: "var(--smarts)", title: schoolLabel(life.school), sub: `Grades ${Math.round(life.school.grades)}%`, bar: life.school.grades, barColor: "var(--smarts)" }));
    body.append(row({
      icon: "✏️", color: "var(--smarts)", title: "Study harder", sub: "Better grades, more smarts",
      doneId: "study",
      onclick: () => { if (!useAction("study")) return; life.school.grades = clamp(life.school.grades + rand(8, 14), 0, 100); const d = bump("smarts", 1, 3); addLog(`You buckled down and studied hard.${d ? ` (+${d} smarts)` : ""}`, "action"); renderSheet(); save(); },
    }));
    body.append(row({
      icon: "😎", color: "var(--happy)", title: "Slack off", sub: "Fun now, grades later",
      doneId: "slack",
      onclick: () => { if (!useAction("slack")) return; life.school.grades = clamp(life.school.grades - rand(6, 12), 0, 100); bump("happiness", 3, 6); addLog("You slacked off and had a great time. Your grades didn't.", "action"); renderSheet(); save(); },
    }));
  }

  if (a >= 18 && !life.school && life.education === "high school" && (!life.job || life.job.partTime)) {
    sectionLabel(body, "Education");
    body.append(row({
      icon: "🎓", color: "var(--looks)", title: "Go to university", sub: "$10,000 a year for 4 years — unlocks the best jobs",
      onclick: () => {
        if (!useAction("university")) return;
        life.school = { stage: "university", year: 1, grades: clamp(life.stats.smarts + rand(-10, 10), 25, 95) };
        addLog("You enrolled at university. Time to find out what you love.", "milestone", { highlight: true });
        renderSheet(); save();
      },
    }));
  }

  if (life.job) {
    const j = life.job;
    sectionLabel(body, j.partTime ? "Part-time job" : "Your job");
    body.append(row({ icon: j.icon || "💼", color: "var(--money)", title: j.title, sub: `${fmtMoney(j.salary)} a year · ${j.years} year${j.years === 1 ? "" : "s"} · performance`, bar: j.performance, barColor: "var(--money)" }));
    body.append(row({
      icon: "💪", color: "var(--money)", title: "Work harder", sub: "Performance up, happiness down a little",
      doneId: "workharder",
      onclick: () => { if (!useAction("workharder")) return; j.performance = clamp(j.performance + rand(10, 18), 0, 100); bump("happiness", -2, -1); addLog("You put in extra hours at work.", "action"); renderSheet(); save(); },
    }));
    body.append(row({
      icon: "💰", color: "var(--money)", title: "Ask for a raise", sub: "Better odds when your performance is high", doneId: "raise",
      onclick: () => {
        if (!useAction("raise")) return;
        if (Math.random() < j.performance / 130) { j.salary = Math.round(j.salary * 1.1); addLog(`You asked for a raise — and got it! Now ${fmtMoney(j.salary)} a year.`, "milestone", { highlight: true }); }
        else { j.performance = clamp(j.performance - 6, 0, 100); addLog("You asked for a raise. Your boss said \"not this year.\"", "action"); }
        renderSheet(); save();
      },
    }));
    if (a >= 60 && !j.partTime) {
      body.append(row({
        icon: "🌅", color: "var(--lamp)", title: "Retire", sub: "Live on your pension",
        onclick: () => { life.retired = { pension: Math.round(j.salary * 0.5 * 0.35) }; addLog(`You retired after ${j.years} years as ${an(j.title.toLowerCase())}.`, "milestone", { highlight: true }); life.job = null; bump("happiness", 5, 10); renderSheet(); save(); },
      }));
    }
    body.append(row({
      icon: "🚪", color: "var(--bad)", title: "Quit", sub: "Walk away from this job",
      onclick: () => { addLog(`You quit your job as ${an(j.title.toLowerCase())}.`, "action"); life.job = null; renderSheet(); save(); },
    }));
    return;
  }

  if (life.retired) {
    body.append(el("p", { class: "note" }, `You're retired, living on a pension of ${fmtMoney(life.retired.pension)} a year.`));
    return;
  }

  const partTimeOnly = a < 18 || !!life.school;
  if (a < 15) {
    if (!life.school) body.append(el("p", { class: "note" }, "You're a little young to work."));
    return;
  }
  sectionLabel(body, partTimeOnly ? "Part-time jobs" : "Job board");
  for (const job of jobBoard(partTimeOnly)) body.append(jobRow(job, partTimeOnly));
}

function jobBoard(partTime) {
  const key = `${life.age}-${partTime}`;
  if (life.jobBoard?.key !== key) {
    const list = partTime ? PART_TIME.map((j) => j[0]) : [...JOBS].sort(() => Math.random() - 0.5).slice(0, 7).map((j) => j[0]);
    life.jobBoard = { key, titles: list };
  }
  return life.jobBoard.titles.map((t) => (partTime ? PART_TIME : JOBS).find((j) => j[0] === t)).filter(Boolean)
    .sort((x, y) => x[1] - y[1]);
}

function jobRow(job, partTime) {
  const [title, salary] = job;
  const eduNeed = partTime ? "none" : job[2];
  const smartsNeed = partTime ? job[2] : job[3];
  const icon = partTime ? job[3] : job[4];
  const eduOk = EDU_RANK[life.education] >= EDU_RANK[eduNeed];
  const needs = !eduOk ? `Needs a ${eduNeed === "university" ? "university degree" : "high school diploma"}` : `${fmtMoney(salary)} a year`;
  return row({
    icon, color: eduOk ? "var(--money)" : "var(--faint)", title, sub: needs, disabled: !eduOk,
    doneId: "apply",
    onclick: eduOk ? () => {
      if (!useAction("apply")) return;
      const s = life.stats;
      const chance = clamp(0.5 + (s.smarts - smartsNeed) / 110 + (s.looks - 50) / 350 + (s.happiness - 50) / 400, 0.08, 0.95);
      if (Math.random() < chance) {
        life.job = { title, base: title, level: 0, icon, salary, performance: randInt(45, 65), years: 0, partTime };
        addLog(`You got the job! You're now ${an(title.toLowerCase())} earning ${fmtMoney(salary)} a year.`, "milestone", { highlight: true });
        bump("happiness", 4, 8);
      } else {
        addLog(`You applied to be ${an(title.toLowerCase())}, but they went with someone else.`, "action");
      }
      renderSheet(); save();
    } : null,
  });
}

/* ----- people ----- */

const ROLE_COLOR = { Mother: "var(--health)", Father: "var(--smarts)", Sister: "var(--looks)", Brother: "var(--looks)", Friend: "var(--happy)", Partner: "#ff7eb3", Spouse: "#ff7eb3", Son: "var(--money)", Daughter: "var(--money)", Dog: "var(--lamp)", Cat: "var(--lamp)" };

const FAMILY_ROLES = ["Mother", "Father", "Sister", "Brother", "Son", "Daughter"];
const LOVE_ROLES = ["Spouse", "Partner"];
const bondWord = (b) => (b >= 85 ? "Inseparable" : b >= 70 ? "Close" : b >= 50 ? "Good" : b >= 30 ? "Drifting apart" : "Barely speaking");

function personRow(p) {
  return row({
    icon: p.pet ? PET_ICON[p.role] : firstName(p.name)[0], color: ROLE_COLOR[p.role] || "var(--dim)",
    title: p.name, sub: `${p.role} · ${p.age} · ${bondWord(p.bond)}`,
    bar: p.bond, barColor: ROLE_COLOR[p.role] || "var(--lamp)",
    onclick: () => openSheet("person", p.id),
  });
}

// The people you already have come first: the old order put "make a friend" at the top, which
// made it look as though everyone was locked until you unlocked them.
function sheetPeople(body) {
  $("sheet-title").textContent = "People";
  const a = life.age;
  const alive = life.people.filter((p) => p.alive);
  const groups = [
    ["Your family", alive.filter((p) => FAMILY_ROLES.includes(p.role))],
    ["Love", alive.filter((p) => LOVE_ROLES.includes(p.role))],
    ["Friends", alive.filter((p) => p.role === "Friend")],
    ["Pets", alive.filter((p) => p.pet)],
  ];
  body.append(el("p", { class: "note" }, "Tap anyone to spend time with them. Every relationship fades a little each year if you leave it alone."));
  for (const [label, list] of groups) {
    if (!list.length) continue;
    sectionLabel(body, label);
    for (const p of list) body.append(personRow(p));
  }

  const hasPartner = alive.some((p) => LOVE_ROLES.includes(p.role));
  sectionLabel(body, "Meet someone new");
  if (a >= 5) body.append(row({ icon: "👋", color: "var(--happy)", title: "Make a new friend", sub: "Someone to share the adventure", doneId: "friend", onclick: makeFriend }));
  if (a >= 16 && !hasPartner) body.append(row({ icon: "💘", color: "#ff7eb3", title: "Find love", sub: "Better odds when you're happy and looking good", doneId: "love", onclick: findLove }));
  if (a >= 8) body.append(row({ icon: "🐾", color: "var(--lamp)", title: "Adopt a pet", sub: a >= 18 ? "$200 adoption fee" : "If your parents say yes…", doneId: "pet", onclick: adoptPet }));
  if (a < 5) body.append(el("p", { class: "note" }, "You're a bit small to be making friends of your own just yet."));

  const gone = life.people.filter((p) => !p.alive);
  if (gone.length) {
    sectionLabel(body, "In memory");
    for (const p of gone) body.append(row({ icon: "🕯️", color: "var(--faint)", title: p.name, sub: `${p.role} · died at ${p.age}` }));
  }
}

function makeFriend() {
  if (!useAction("friend")) return;
  const g = Math.random() < 0.5 ? "female" : "male";
  const friend = newPerson("Friend", randomName(life.country, g), clamp(life.age + randInt(-2, 2), 3, 110), randInt(45, 70), { gender: g });
  life.people.push(friend);
  addLog(`You became friends with ${friend.name}.`, "milestone");
  bump("happiness", 2, 5);
  renderSheet(); save();
}

function findLove() {
  if (!useAction("love")) return;
  const s = life.stats;
  if (Math.random() < clamp(0.18 + (s.looks + s.happiness) / 260, 0.15, 0.85)) {
    const g = life.gender === "female" ? "male" : "female";
    // teens only ever date teens, adults only adults
    const age = life.age < 18 ? randInt(Math.max(16, life.age - 1), 17) : clamp(life.age + randInt(-3, 3), 18, 110);
    const partner = newPerson("Partner", randomName(life.country, g), age, randInt(55, 75), { gender: g });
    life.people.push(partner);
    addLog(`You started dating ${partner.name}.`, "milestone", { highlight: true });
    bump("happiness", 5, 10);
  } else {
    addLog("You put yourself out there, but it just didn't click.", "action");
    bump("happiness", -3, -1);
  }
  renderSheet(); save();
}

function adoptPet() {
  const cost = life.age >= 18 ? 200 : 0;
  if (!useAction("pet", cost)) return;
  if (life.age < 18 && Math.random() < 0.45) {
    addLog("You begged for a pet. Your parents said \"maybe next year.\"", "action");
  } else {
    const kind = Math.random() < 0.55 ? "Dog" : "Cat";
    const pet = newPerson(kind, pick(PET_NAMES), 0, randInt(70, 90), { pet: true });
    life.people.push(pet);
    addLog(`You adopted a ${kind.toLowerCase()} named ${pet.name}!`, "milestone", { highlight: true });
    bump("happiness", 6, 10);
  }
  renderSheet(); save();
}

function sheetPerson(body, id) {
  const p = life.people.find((x) => x.id === id);
  if (!p) return openSheet("people");
  const name = p.pet ? p.name : firstName(p.name);
  $("sheet-title").textContent = p.name;
  body.append(el("button", { class: "ghost-btn", type: "button", style: "margin-bottom:12px; padding:10px", onclick: () => openSheet("people") }, "← All people"));
  body.append(row({ icon: p.pet ? PET_ICON[p.role] : name[0], color: ROLE_COLOR[p.role] || "var(--dim)", title: `${p.role} · ${p.age}`, sub: `${bondWord(p.bond)} · ${Math.round(p.bond)}%`, bar: p.bond, barColor: ROLE_COLOR[p.role] || "var(--lamp)" }));

  const slot = `person:${p.id}`;
  const act = (icon, title, sub, fn) => body.append(row({ icon, color: ROLE_COLOR[p.role] || "var(--lamp)", title, sub, doneId: slot, onclick: fn }));
  const refresh = () => { renderSheet(); save(); };

  if (p.pet) {
    act("🎾", "Play together", "Happiness for you both", () => { if (!useAction(slot)) return; p.bond = clamp(p.bond + rand(8, 14), 0, 100); bump("happiness", 3, 6); addLog(`You played with ${p.name} until you were both exhausted.`, "action"); refresh(); });
    return;
  }

  act("☕", "Spend time together", "Grow closer", () => { if (!useAction(slot)) return; p.bond = clamp(p.bond + rand(8, 14), 0, 100); bump("happiness", 2, 5); addLog(`You spent a lovely day with ${name}.`, "action"); refresh(); });
  act("💬", "Have a heart-to-heart", "Talk about something real", () => { if (!useAction(slot)) return; p.bond = clamp(p.bond + rand(4, 9), 0, 100); bump("happiness", 1, 3); addLog(`You and ${name} had a long heart-to-heart.`, "action"); refresh(); });
  if (life.age >= 12) act("🎁", "Give a gift", "$50", () => { if (!useAction(slot, 50)) return; p.bond = clamp(p.bond + rand(10, 16), 0, 100); addLog(`You gave ${name} a thoughtful gift.`, "action"); refresh(); });
  if ((p.role === "Mother" || p.role === "Father") && life.age >= 6) {
    act("💵", "Ask for money", "Depends on how they feel about you", () => {
      if (!useAction(slot)) return;
      if (Math.random() < p.bond / 125) {
        const amt = life.age < 13 ? randInt(5, 40) : life.age < 18 ? randInt(20, 200) : randInt(200, 3000);
        life.money += amt;
        addLog(`${name} gave you ${fmtMoney(amt)}.`, "action");
      } else {
        p.bond = clamp(p.bond - 3, 0, 100);
        addLog(`You asked ${name} for money. The answer was a firm no.`, "action");
      }
      refresh();
    });
  }
  if (p.role === "Partner") {
    act("🌹", "Go on a date", "Romance & happiness", () => { if (!useAction(slot, life.age >= 18 ? 60 : 0)) return; p.bond = clamp(p.bond + rand(8, 14), 0, 100); bump("happiness", 4, 7); addLog(`You and ${name} went on a wonderful date.`, "action"); refresh(); });
    if (life.age >= 18 && p.age >= 18) act("💍", "Propose", "Needs a strong relationship", () => {
      if (!useAction(slot)) return;
      if (Math.random() < clamp((p.bond - 30) / 55, 0.05, 0.95)) {
        p.role = "Spouse";
        addLog(`You proposed to ${name} — they said yes! You got married.`, "milestone", { highlight: true });
        bump("happiness", 10, 15);
      } else {
        p.bond = clamp(p.bond - 6, 0, 100);
        addLog(`You proposed to ${name}. They said they weren't ready.`, "bad");
        bump("happiness", -8, -4);
      }
      refresh();
    });
    act("💔", "Break up", "End the relationship", () => { life.people = life.people.filter((x) => x.id !== p.id); addLog(`You and ${name} broke up.`, "bad", { highlight: true }); bump("happiness", -8, -3); openSheet("people"); save(); });
  }
  if (p.role === "Spouse") {
    act("🍝", "Go on a date night", "Keep the spark alive", () => { if (!useAction(slot, 80)) return; p.bond = clamp(p.bond + rand(7, 12), 0, 100); bump("happiness", 3, 6); addLog(`You and ${name} had a lovely date night.`, "action"); refresh(); });
    if (life.age >= 20 && life.age <= 48) act("👶", "Start a family", "Welcome a baby into the world", () => {
      if (!useAction(slot)) return;
      if (Math.random() < 0.55) {
        const g = Math.random() < 0.5 ? "female" : "male";
        const last = life.name.split(" ").slice(1).join(" ");
        const baby = newPerson(g === "female" ? "Daughter" : "Son", `${pick((COUNTRIES[life.country] || COUNTRIES["United States"])[g])} ${last}`, 0, randInt(80, 100), { gender: g });
        life.people.push(baby);
        addLog(`You and ${name} welcomed a baby ${g === "female" ? "girl" : "boy"}, ${firstName(baby.name)}!`, "milestone", { highlight: true });
        bump("happiness", 10, 16);
      } else {
        addLog("You and your spouse are hoping for a baby. Not this year.", "action");
      }
      refresh();
    });
    act("📄", "Divorce", "End the marriage", () => { life.people = life.people.filter((x) => x.id !== p.id); const cost = Math.max(0, Math.round(life.money * 0.3)); life.money -= cost; addLog(`You and ${name} got divorced.${cost ? ` It cost you ${fmtMoney(cost)}.` : ""}`, "bad", { highlight: true }); bump("happiness", -12, -6); openSheet("people"); save(); });
  }
  if (!["Mother", "Father", "Son", "Daughter", "Spouse", "Partner"].includes(p.role)) {
    act("😤", "Argue", "Say what you really think", () => { if (!useAction(slot)) return; p.bond = clamp(p.bond - rand(8, 16), 0, 100); bump("happiness", -4, -1); addLog(`You got into an argument with ${name}.`, "action"); refresh(); });
  }
}

/* ----- assets ----- */

function sheetAssets(body) {
  $("sheet-title").textContent = "Assets";
  body.append(row({ icon: "🏦", color: life.money < 0 ? "var(--bad)" : "var(--money)", title: fmtMoney(life.money), sub: life.money < 0 ? "You're in debt" : "In the bank" }));

  if (life.assets.length) {
    sectionLabel(body, "You own");
    for (const a of life.assets) {
      body.append(row({
        icon: a.icon || (a.kind === "car" ? "🚗" : "🏠"), color: "var(--lamp)", title: a.name, sub: `Worth ${fmtMoney(a.value)} · tap to sell`,
        onclick: () => { life.money += a.value; life.assets = life.assets.filter((x) => x.id !== a.id); addLog(`You sold your ${a.name.toLowerCase()} for ${fmtMoney(a.value)}.`, "action"); renderSheet(); save(); },
      }));
    }
  }

  const buy = (kind, name, price, icon) => {
    if (price > life.money) { toast(`You need ${fmtMoney(price)} for that.`); return; }
    life.money -= price;
    life.assets.push({ id: uid(), kind, name, icon, value: price });
    addLog(`You bought ${an(name.toLowerCase())} for ${fmtMoney(price)}!`, "milestone", { highlight: price >= 20000 });
    bump("happiness", kind === "home" ? 8 : 4, kind === "home" ? 14 : 8);
    renderSheet(); save();
  };
  const shop = (label, kind, list, color) => {
    sectionLabel(body, label);
    for (const [name, price, icon] of list) {
      const ok = price <= life.money;
      body.append(row({ icon, color, title: name, side: fmtMoney(price), sideClass: ok ? "good" : "", disabled: !ok, onclick: () => buy(kind, name, price, icon) }));
    }
  };
  if (life.age >= 17) shop("Cars", "car", CARS, "var(--smarts)");
  if (life.age >= 20) shop("Homes", "home", HOMES, "var(--looks)");
  if (life.age < 17) body.append(el("p", { class: "note" }, "Cars at 17, homes at 20. Start saving your pocket money."));
}

/* ----- activities ----- */

function sheetActivities(body) {
  $("sheet-title").textContent = "Activities";
  const list = ACTIVITIES.filter((x) => life.age >= x.min && (x.max === undefined || life.age <= x.max));
  for (const act of list) {
    const cost = act.cost && life.age >= (act.costFrom || 0) ? act.cost : 0;
    const color = STAT_META[Object.keys(act.fx)[0]]?.color || "var(--lamp)";
    body.append(row({
      icon: act.icon, color, title: act.label, sub: act.sub, side: cost ? fmtMoney(cost) : null, doneId: act.id,
      onclick: () => {
        if (act.blocked && act.blocked()) { toast(act.blocked()); return; }
        if (!useAction(act.id, cost)) return;
        const bits = [];
        for (const [stat, [lo, hi]] of Object.entries(act.fx)) {
          const d = bump(stat, lo, hi);
          if (d) bits.push(`${d > 0 ? "+" : ""}${d} ${STAT_META[stat].label.toLowerCase()}`);
        }
        addLog(bits.length ? `${act.log} (${bits.join(", ")})` : `${act.log} ${act.plateau || "You're already at your peak — it barely moved the needle."}`, "action", { highlight: act.highlight && bits.length > 0 });
        renderSheet(); save();
      },
    }));
  }
}

/* ================= death ================= */

// Like a yearbook superlative: the one line a whole life gets remembered by.
function ribbon() {
  const s = life.stats;
  const worth = life.money + life.assets.reduce((t, a) => t + a.value, 0);
  const close = life.people.filter((p) => p.bond >= 75).length;
  const kids = life.people.filter((p) => p.role === "Son" || p.role === "Daughter").length;
  const rules = [
    [life.age >= 100, "Legend", "Lived to see a hundred"],
    [worth >= 1_000_000, "Tycoon", "Died a millionaire"],
    [life.age < 30, "Shooting Star", "Gone far too soon"],
    [worth < -20000, "In the Red", "Owed half the town money"],
    [life.education === "university" && s.smarts >= 80, "Scholar", "Brains, and a degree to prove it"],
    [kids >= 3, "Full House", "Raised a big, loud family"],
    [close >= 5, "Beloved", "Surrounded by people who adored them"],
    [s.looks >= 90, "Heartthrob", "Turned heads to the very end"],
    [s.happiness >= 85, "Sunshine", "Happy — truly happy"],
    [s.health >= 80 && life.age >= 60, "Iron Will", "Fit as a fiddle for life"],
    [s.happiness < 20, "Storm Cloud", "Never quite cheered up"],
    [(life.job?.level || 0) >= 2, "Climber", "Worked their way to the top"],
  ];
  const hit = rules.find(([ok]) => ok);
  return hit ? { name: hit[1], line: hit[2] } : { name: "Steady", line: "A quiet, steady life" };
}

function recordGrave() {
  const past = graveyard().filter((g) => g.id !== life.id);
  past.unshift({ id: life.id, name: life.name, age: life.age, cause: life.cause, epitaph: life.epitaph || null, ribbon: life.ribbon?.name || null });
  try { localStorage.setItem(GRAVE_KEY, JSON.stringify(past.slice(0, 20))); } catch { /* storage blocked — the life still happened */ }
}

function die(cause) {
  if (!life.alive) return;
  life.alive = false;
  life.cause = cause;
  life.ribbon = ribbon();
  addLog(`You died of ${cause} at the age of ${life.age}.`, "bad", { highlight: true });
  save();
  recordGrave();
  closeSheet();
  $("event-modal").hidden = true;
  setBusy(false);
  showDeath();
}

// The obituary streams in, then the epitaph lands on its own. While the text is still arriving,
// a half-written "EPITA…" marker line is held back so it never flashes on screen.
function splitStory(buf, final) {
  const marker = buf.match(/\s*[*_]*EPITAPH[*_]*\s*:[*_]*\s*/i);
  let story = marker ? buf.slice(0, marker.index) : buf;
  if (!marker && !final) story = story.replace(/\n\s*[*_]*([A-Za-z]{0,7})$/, (all, w) => ("EPITAPH".startsWith(w.toUpperCase()) ? "" : all));
  const epitaph = marker ? stripQuotes(buf.slice(marker.index + marker[0].length).trim().split("\n")[0]) : "";
  return { story: story.trim(), epitaph };
}

function storyHighlights() {
  const h = life.highlights;
  return h.length > 24 ? [...h.slice(0, 4), ...h.slice(-20)] : h;
}

async function showDeath() {
  showScreen("death-screen");
  $("death-name").textContent = life.name;
  $("death-sub").textContent = `${life.age} ${life.age === 1 ? "year" : "years"} · died of ${life.cause}`;
  const rb = life.ribbon || ribbon();
  $("ribbon").replaceChildren(el("b", {}, rb.name), ` · ${rb.line}`);
  $("ribbon").hidden = false;
  const statsBox = $("death-stats");
  statsBox.innerHTML = "";
  for (const s of STATS) statsBox.append(el("div", { class: "death-stat", style: `--c: ${STAT_META[s].color}` }, el("b", {}, Math.round(life.stats[s])), el("span", {}, STAT_META[s].label)));
  const epitaph = $("epitaph");
  epitaph.hidden = true;
  $("new-life-btn").disabled = false;

  if (life.story) {
    $("obituary-text").textContent = life.story;
    if (life.epitaph) { epitaph.textContent = `“${life.epitaph}”`; epitaph.hidden = false; }
    return;
  }
  const typer = new Typewriter($("obituary-text"));
  let buf = "";
  const res = await streamText("/api/story", { life: lifeForAI(), cause: life.cause, highlights: storyHighlights() }, (chunk) => {
    buf += chunk;
    typer.set(splitStory(buf, false).story);
  });
  const parts = splitStory(buf, true);
  const story = res.ok && parts.story
    ? parts.story
    : `${life.name} lived ${life.age} years — a life full of choices, some brilliant, some not, all their own.`;
  typer.set(story);
  typer.end(() => {
    life.story = story;
    life.epitaph = parts.epitaph || null;
    if (life.epitaph) { epitaph.textContent = `“${life.epitaph}”`; epitaph.hidden = false; }
    recordGrave();
    save();
  });
}

function renderPastLives() {
  const box = $("past-lives");
  const past = graveyard().slice(0, 5);
  box.replaceChildren();
  box.hidden = !past.length;
  if (!past.length) return;
  box.append(el("p", { class: "section-label" }, "Past lives"));
  for (const g of past) {
    box.append(el("div", { class: "past-life" },
      el("div", { class: "past-top" },
        el("span", { class: "past-name" }, g.name),
        el("span", { class: "past-age" }, `${g.age}${g.ribbon ? ` · ${g.ribbon}` : ""}`)),
      g.epitaph ? el("p", { class: "past-epitaph" }, `“${g.epitaph}”`) : el("p", { class: "past-epitaph" }, `Died of ${g.cause}`)));
  }
}

/* ================= start ================= */

let setupGender = Math.random() < 0.5 ? "female" : "male";

function initStart() {
  const sel = $("setup-country");
  sel.innerHTML = "";
  for (const c of Object.keys(COUNTRIES)) sel.append(el("option", { value: c }, c));
  sel.value = "Saudi Arabia";
  setGender(setupGender);
  rerollName();

  const saved = load();
  const cont = $("continue-btn");
  if (saved?.alive) {
    cont.hidden = false;
    cont.textContent = `Continue as ${saved.name} (age ${saved.age})`;
  } else {
    cont.hidden = true;
  }
  renderPastLives();
}

function setGender(g) {
  setupGender = g;
  for (const b of $("setup-gender").querySelectorAll("button")) b.setAttribute("aria-checked", String(b.dataset.value === g));
}
function rerollName() {
  $("setup-name").value = randomName($("setup-country").value, setupGender);
}

function beginLife() {
  const country = $("setup-country").value;
  let name = $("setup-name").value.trim().replace(/\s+/g, " ").slice(0, 24);
  if (!name) name = randomName(country, setupGender);
  if (!name.includes(" ")) name += ` ${pick(COUNTRIES[country].last)}`;
  createLife({ name, gender: setupGender, country });
  enterGame();
}

function enterGame() {
  showScreen("game-screen");
  closeSheet();
  $("event-modal").hidden = true;
  setBusy(false);
  renderAll();
  renderLog();
}

/* ================= wiring ================= */

$("reroll-name").addEventListener("click", rerollName);
$("setup-country").addEventListener("change", rerollName);
for (const b of $("setup-gender").querySelectorAll("button")) {
  b.addEventListener("click", () => { setGender(b.dataset.value); rerollName(); });
}
$("begin-btn").addEventListener("click", beginLife);
$("continue-btn").addEventListener("click", () => { life = load(); enterGame(); });
$("new-life-btn").addEventListener("click", () => { initStart(); showScreen("start-screen"); });
$("age-btn").addEventListener("click", ageUp);
for (const b of document.querySelectorAll(".dock-btn")) b.addEventListener("click", () => openSheet(b.dataset.sheet));
$("sheet-close").addEventListener("click", closeSheet);
$("sheet-backdrop").addEventListener("click", closeSheet);

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, select")) return;
  const onControl = e.target.closest?.("button, a");
  if (!$("event-modal").hidden) {
    const n = parseInt(e.key, 10);
    const choices = [...$("choices").querySelectorAll(".choice:not(:disabled)")];
    if (n >= 1 && n <= choices.length) { e.preventDefault(); choices[n - 1].click(); }
    else if (e.key === "Enter" && !onControl) $("event-actions").querySelector(".primary-btn")?.click();
    return;
  }
  if (e.key === "Escape") closeSheet();
  else if ((e.key === " " || e.key === "Enter") && !onControl && !$("game-screen").hidden && $("sheet").hidden) { e.preventDefault(); ageUp(); }
});

// Keep a free-tier host awake while someone is actually playing: a sleeping instance takes the
// better part of a minute to wake, which would stall the next event mid-life.
fetch("/api/health").catch(() => {});
setInterval(() => { if (document.visibilityState === "visible") fetch("/api/health").catch(() => {}); }, 9 * 60 * 1000);

initStart();
const resumed = load();
if (resumed?.alive) {
  life = resumed;
  enterGame();
} else {
  showScreen("start-screen");
}
