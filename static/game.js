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

/* Activities. Every life stage gets its own things to do, so a 70-year-old never opens the same
   menu as a 20-year-old, and something new keeps unlocking all the way to the end.
   { id, icon, label, cat, min, max, cost, costFrom, once, fx, log, plateau, highlight, need, blocked } */
const CATS = ["Body", "Mind", "Fun", "Care", "Money"];

const ACTIVITIES = [
  // --- the first few years ---
  { id: "nap", icon: "😴", label: "Take a nap", cat: "Body", min: 0, max: 5, fx: { happiness: [2, 5], health: [1, 3] }, log: "You had a long, cosy nap." },
  { id: "babble", icon: "🗣️", label: "Babble at everyone", cat: "Mind", min: 0, max: 3, fx: { smarts: [1, 3], happiness: [1, 3] }, log: "You held a long conversation with the cat. Neither of you understood it." },
  { id: "cuddle", icon: "🤗", label: "Cuddle a parent", cat: "Care", min: 0, max: 8, fx: { happiness: [3, 6] }, bond: ["parent", 4, 9], log: "You fell asleep on somebody's shoulder mid-sentence." },
  { id: "newword", icon: "🔤", label: "Learn a new word", cat: "Mind", min: 1, max: 5, fx: { smarts: [2, 4] }, log: "Today's word was \"absolutely\". You used it eleven times." },
  { id: "playground", icon: "🛝", label: "Go to the playground", cat: "Body", min: 2, max: 9, fx: { health: [2, 4], happiness: [3, 6] }, log: "You conquered the big slide. Twice." },
  { id: "scribble", icon: "🖍️", label: "Scribble on the wall", cat: "Fun", min: 2, max: 6, fx: { happiness: [4, 7] }, bond: ["parent", -4, -1], log: "You created a masterpiece. On the hallway wall." },

  // --- childhood ---
  { id: "walk", icon: "🚶", label: "Go for a walk", cat: "Body", min: 4, fx: { happiness: [2, 5], health: [1, 3] }, log: "You went for a long walk." },
  { id: "bike", icon: "🚲", label: "Learn to ride a bike", cat: "Body", min: 4, max: 11, once: true, fx: { health: [2, 5], happiness: [5, 9] }, log: "You rode a bike without stabilisers for the first time!", highlight: true, badge: "wheels" },
  { id: "swim", icon: "🏊", label: "Learn to swim", cat: "Body", min: 4, max: 14, once: true, fx: { health: [3, 6], happiness: [4, 7] }, log: "You swam a whole length without touching the bottom.", highlight: true, badge: "swimmer" },
  { id: "draw", icon: "🎨", label: "Draw all afternoon", cat: "Fun", min: 4, max: 15, fx: { happiness: [3, 6], smarts: [0, 2] }, log: "You drew your whole family, roughly to scale." },
  { id: "library", icon: "📚", label: "Read at the library", cat: "Mind", min: 6, fx: { smarts: [2, 5] }, log: "You spent an afternoon reading at the library." },
  { id: "games", icon: "🎮", label: "Play video games", cat: "Fun", min: 6, fx: { happiness: [3, 6], smarts: [-1, 1] }, log: "You lost a whole evening to video games." },
  { id: "instrument", icon: "🎸", label: "Practise an instrument", cat: "Mind", min: 7, fx: { smarts: [2, 4], happiness: [1, 4] }, log: "You practised until your fingers ached." },
  { id: "sleepover", icon: "🛌", label: "Have a sleepover", cat: "Fun", min: 7, max: 17, fx: { happiness: [4, 8] }, bond: ["friend", 6, 12], log: "Nobody slept. That was rather the point." },
  { id: "scifair", icon: "🔬", label: "Enter the science fair", cat: "Mind", min: 8, max: 18, fx: { smarts: [3, 7], happiness: [1, 4] }, log: "Your volcano erupted more or less on schedule." },
  { id: "play", icon: "🎭", label: "Audition for the school play", cat: "Fun", min: 7, max: 18, fx: { looks: [1, 4], happiness: [3, 6] }, log: "You got a part with three whole lines." },

  // --- teenage ---
  { id: "meditate", icon: "🧘", label: "Meditate", cat: "Care", min: 10, fx: { happiness: [3, 7], health: [0, 2] }, log: "You meditated and felt calmer." },
  { id: "gym", icon: "🏋️", label: "Hit the gym", cat: "Body", min: 12, fx: { health: [2, 5], looks: [1, 3] }, log: "You worked out at the gym." },
  { id: "volunteer", icon: "🤝", label: "Volunteer", cat: "Care", min: 12, fx: { happiness: [3, 6], smarts: [1, 2] }, log: "You volunteered in your community.", highlight: true, badge: "helper" },
  { id: "haircut", icon: "✂️", label: "Get a haircut", cat: "Body", min: 6, cost: 25, fx: { looks: [2, 5] }, log: "You got a haircut you mostly like." },
  { id: "post", icon: "📱", label: "Post something online", cat: "Fun", min: 12, fx: { happiness: [2, 7], looks: [0, 3] }, log: "It did numbers. Modest numbers, but numbers." },
  { id: "band", icon: "🎤", label: "Start a band", cat: "Fun", min: 13, max: 30, once: true, fx: { happiness: [5, 10], looks: [1, 3] }, log: "You started a band. You are, obviously, the frontperson.", highlight: true, badge: "band" },
  { id: "makeover", icon: "💇", label: "Get a makeover", cat: "Body", min: 13, cost: 120, cooldown: 2, fx: { looks: [3, 7], happiness: [1, 3] }, log: "You got a fresh new look." },
  { id: "cook", icon: "🍳", label: "Learn to cook properly", cat: "Care", min: 13, fx: { health: [2, 5], happiness: [2, 4] }, log: "You made dinner for everyone, and it was genuinely good." },
  { id: "lessons", icon: "🚗", label: "Take driving lessons", cat: "Mind", min: 16, cost: 400, fx: { smarts: [0, 2] }, log: "Another hour of lessons. The instructor's nerves are healing.",
    need: () => (life.licence ? "You already have your licence." : null),
    after: () => { life.lessons = (life.lessons || 0) + 1; } },
  { id: "drivingtest", icon: "🪪", label: "Take your driving test", cat: "Mind", min: 16, fx: {},
    subText: "More lessons, better odds — pass it and you can buy a car",
    need: () => (life.licence ? "You passed this years ago." : null),
    custom: () => {
      const chance = clamp(0.2 + (life.lessons || 0) * 0.22 + life.stats.smarts / 400, 0.1, 0.95);
      if (Math.random() < chance) {
        life.licence = true;
        bump("happiness", 6, 10);
        addLog("You passed your driving test! The examiner looked relieved for both of you.", "milestone", { highlight: true });
        awardBadge("licensed");
      } else {
        bump("happiness", -5, -2);
        addLog("You failed your driving test. The roundabout won.", "bad");
      }
    } },

  // --- adult ---
  { id: "vacation", icon: "🏖️", label: "Take a vacation", cat: "Fun", min: 18, cost: 1800, fx: { happiness: [6, 11], health: [1, 3] },
    after: () => { life.holidays = (life.holidays || 0) + 1; }, log: "You took a proper holiday and came back a different person.", highlight: true },
  { id: "marathon", icon: "🏃", label: "Run a marathon", cat: "Body", min: 18, max: 60, fx: { health: [5, 9], happiness: [5, 9] }, log: "You ran a marathon. Slowly, but entirely.", highlight: true, badge: "marathon",
    need: () => (life.stats.health < 45 ? "You'd need to be a lot fitter first." : null) },
  { id: "therapy", icon: "🛋️", label: "See a therapist", cat: "Care", min: 16, cost: 600, fx: { happiness: [6, 12], smarts: [0, 2] }, log: "You talked it through with someone who actually listens." },
  { id: "nightclass", icon: "🌙", label: "Take a night class", cat: "Mind", min: 18, cost: 500, fx: { smarts: [4, 8] }, log: "You took a night class and remembered you like learning things." },
  { id: "spa", icon: "💆", label: "Spa day", cat: "Body", min: 18, cost: 250, fx: { looks: [3, 6], happiness: [3, 6] }, log: "You spent a day being pampered and regret nothing." },
  { id: "skydive", icon: "🪂", label: "Go skydiving", cat: "Fun", min: 18, cost: 300, fx: { happiness: [9, 15], health: [-3, 0] }, log: "You jumped out of a perfectly good aeroplane.", highlight: true, badge: "skydiver" },
  { id: "roadtrip", icon: "🛣️", label: "Take a road trip", cat: "Fun", min: 17, fx: { happiness: [6, 11], health: [-1, 1] },
    need: () => (life.licence && life.assets.some((a) => a.kind === "car") ? null : "You'd need a licence and a car of your own."),
    log: "You drove somewhere far away with the windows down." },
  { id: "charity", icon: "🎗️", label: "Give to charity", cat: "Care", min: 18, cost: 1000, fx: { happiness: [6, 11] }, log: "You gave a chunk of money to a cause you believe in.", highlight: true, badge: "giver" },

  // --- later life ---
  { id: "garden", icon: "🌱", label: "Tend the garden", cat: "Care", min: 45, fx: { happiness: [3, 7], health: [1, 4] }, log: "You spent the season arguing with the roses." },
  { id: "reunion", icon: "🎉", label: "Go to a reunion", cat: "Fun", min: 40, fx: { happiness: [4, 9] }, log: "Everyone looked older except, obviously, you." },
  { id: "mentor", icon: "🧑‍🏫", label: "Mentor someone young", cat: "Care", min: 50, fx: { happiness: [4, 8], smarts: [1, 3] }, log: "You passed on everything you know to someone just starting out." },
  { id: "cruise", icon: "🚢", label: "Go on a cruise", cat: "Fun", min: 60, cost: 4000, cooldown: 2, fx: { happiness: [7, 12], health: [0, 3] },
    after: () => { life.holidays = (life.holidays || 0) + 1; }, log: "You spent two weeks at sea eating spectacularly.", highlight: true },
  { id: "memoir", icon: "✍️", label: "Write your memoir", cat: "Mind", min: 62, once: true, fx: { smarts: [2, 5], happiness: [5, 9] }, log: "You wrote it all down. Some of it is even true.", highlight: true, badge: "memoir" },
  { id: "babysit", icon: "👵", label: "Babysit the grandkids", cat: "Care", min: 45, fx: { happiness: [6, 11], health: [-2, 0] },
    need: () => (life.people.some((p) => p.alive && GRANDKID_ROLES.includes(p.role)) ? null : "No grandchildren to spoil yet."),
    bond: ["grandchild", 8, 14], log: "You fed them too much sugar and sent them home. Perfect." },

  // --- always there ---
  // Not a vending machine: two years between visits, worth a lot when you're ill and almost
  // nothing when you're well, and the check-up itself can find something.
  { id: "doctor", icon: "🩺", label: "Visit the doctor", cat: "Body", min: 0, cost: 220, costFrom: 18, cooldown: 2, fx: {},
    subText: "Worth a lot when you're ill, little when you're well",
    need: () => (life.stats.health >= 92 ? "You're in rude health — the doctor would just send you home." : null),
    custom: () => {
      if (life.condition) {
        life.condition = null;
        const d = bump("health", 6, 12);
        addLog(`The treatment worked. You're back on your feet.${d ? ` (+${d} health)` : ""}`, "milestone", { highlight: true });
        toast("Treated — you're well again");
        return;
      }
      const before = life.stats.health;
      life.stats.health = clamp(before + (100 - before) * rand(0.12, 0.26), 0, 100);
      const d = Math.round(life.stats.health - before);
      if (Math.random() < 0.1 && life.age > 25) {
        life.condition = true;
        life.stats.health = clamp(life.stats.health - 4, 0, 100);
        addLog("The check-up found something. It's treatable, but it needs looking after.", "bad", { highlight: true });
        toast("The doctor found something");
      } else {
        addLog(d ? `You had a check-up and left in better shape. (+${d} health)` : "You had a check-up. Nothing to fix — you're in good shape.", "action");
        toast(d ? `+${d} health` : "Nothing to fix");
      }
    } },
];

// Earned during the life, not only at the end of it — the middle of a life needs applause too.
const BADGES = {
  wheels: ["🚲", "On Two Wheels", "Learned to ride a bike"],
  swimmer: ["🏊", "Like a Fish", "Learned to swim"],
  band: ["🎸", "Frontperson", "Started a band"],
  licensed: ["🪪", "Licensed", "Passed your driving test"],
  helper: ["🤝", "Good Sort", "Volunteered in your community"],
  marathon: ["🏃", "Twenty-Six Miles", "Ran a whole marathon"],
  skydiver: ["🪂", "No Fear", "Jumped out of an aeroplane"],
  giver: ["🎗️", "Generous", "Gave to a cause you believe in"],
  memoir: ["✍️", "Memoirist", "Wrote the story of your life"],
  straightA: ["💯", "Straight A's", "Finished a school year at 95%"],
  topofyear: ["🥇", "Top of the Year", "Came top in your exams"],
  graduate: ["🎓", "Graduate", "Finished high school"],
  scholar: ["📜", "Scholar", "Earned a university degree"],
  firstjob: ["💼", "On the Payroll", "Got your first job"],
  boss: ["🏆", "The Boss", "Reached the top of your career"],
  sixfigures: ["💵", "Six Figures", "Banked $100,000"],
  millionaire: ["💰", "Millionaire", "Banked your first million"],
  homeowner: ["🏠", "Homeowner", "Bought a home of your own"],
  wheels4: ["🚗", "Keys in Hand", "Bought your first car"],
  married: ["💍", "Married", "Somebody said yes"],
  parent: ["👶", "Parent", "Became somebody's parent"],
  grandparent: ["👵", "Grandparent", "Lived to spoil the next lot"],
  petlover: ["🐾", "Pet Person", "Gave an animal a home"],
  bestfriend: ["🫂", "Inseparable", "Loved somebody to 95"],
  centenarian: ["🎂", "A Hundred", "Reached one hundred years old"],
};

/* Four goals, drawn at birth. Without them a life sim is a treadmill: this is the thing that
   makes one life different from the last, and gives a player a reason to choose. */
const GOALS = [
  { id: "degree", icon: "🎓", name: "Earn a degree", hint: "Finish university", test: (l) => l.education === "university" },
  { id: "rich", icon: "💰", name: "Bank a million", hint: "Have $1,000,000 at once", test: (l) => l.money >= 1000000 },
  { id: "home", icon: "🏠", name: "Own your own home", hint: "Buy any home", test: (l) => l.assets.some((a) => a.kind === "home") },
  { id: "top", icon: "🏆", name: "Reach the top of a career", hint: "Get promoted three times", test: (l) => (l.job?.level || 0) >= 3 },
  { id: "married", icon: "💍", name: "Marry someone you love", hint: "Marry with a bond above 80", test: (l) => l.people.some((p) => p.role === "Spouse" && p.bond >= 80) },
  { id: "family", icon: "👨‍👩‍👧", name: "Raise two children", hint: "Have two kids", test: (l) => l.people.filter((p) => KID_ROLES.includes(p.role)).length >= 2 },
  { id: "bestie", icon: "🫂", name: "Find a friend for life", hint: "A friend at 95 bond", test: (l) => l.people.some((p) => p.alive && p.role === "Friend" && p.bond >= 95) },
  { id: "fit", icon: "💪", name: "Be in the shape of your life", hint: "Health above 90 after 40", test: (l) => l.age >= 40 && l.stats.health >= 90 },
  { id: "clever", icon: "🧠", name: "Become genuinely clever", hint: "Smarts above 90", test: (l) => l.stats.smarts >= 90 },
  { id: "old", icon: "🎂", name: "See ninety", hint: "Live to 90", test: (l) => l.age >= 90 },
  { id: "travel", icon: "🏖️", name: "See the world", hint: "Three holidays in one life", test: (l) => (l.holidays || 0) >= 3 },
  { id: "wheels", icon: "🚗", name: "Drive something you love", hint: "Buy a car worth over $40,000", test: (l) => l.assets.some((a) => a.kind === "car" && (a.paid || 0) >= 40000) },
  { id: "kind", icon: "🎗️", name: "Be somebody's good news", hint: "Volunteer and give to charity", test: (l) => (l.badges || []).includes("helper") && (l.badges || []).includes("giver") },
  { id: "pets", icon: "🐾", name: "Give an animal a home", hint: "Adopt a pet", test: (l) => l.people.some((p) => p.pet) },
];

const KID_ROLES = ["Son", "Daughter"];
const GRANDKID_ROLES = ["Grandson", "Granddaughter"];

const CARS = [["Used hatchback", 4000, "🚗"], ["Family sedan", 22000, "🚙"], ["SUV", 38000, "🛻"], ["Electric car", 45000, "🔋"], ["Sports car", 95000, "🏎️"]];
const HOMES = [["Studio apartment", 120000, "🏢"], ["Townhouse", 280000, "🏘️"], ["Family house", 420000, "🏠"], ["Beach villa", 1200000, "🏝️"], ["Mansion", 3000000, "🏰"]];

const SAVE_KEY = "unwritten_life_v1";
const ESTATE_KEY = "unwritten_estate_v1";
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

// What one life leaves the next: dying rich becomes a goal instead of a footnote.
function takeEstate() {
  try {
    const estate = JSON.parse(localStorage.getItem(ESTATE_KEY) || "null");
    localStorage.removeItem(ESTATE_KEY);
    return estate && estate.amount > 0 ? estate : null;
  } catch { return null; }
}
function leaveEstate() {
  const worth = life.money + life.assets.reduce((t, a) => t + a.value, 0);
  const amount = Math.min(Math.round(worth * 0.2), 250000);
  if (amount < 2000) return;
  try { localStorage.setItem(ESTATE_KEY, JSON.stringify({ from: life.name, amount })); } catch { /* storage blocked */ }
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
    stats: pendingRoll || { happiness: randInt(55, 100), health: randInt(60, 100), smarts: randInt(15, 100), looks: randInt(15, 100) },
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
    onceDone: {},
    clubs: [],
    badges: [],
    licence: false,
    lessons: 0,
    inheritance: takeEstate(),
    peak: 0,
    jobsHeld: 0,
    holidays: 0,
    goals: [...GOALS].sort(() => Math.random() - 0.5).slice(0, 4).map((g) => ({ id: g.id, done: 0 })),
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
  if (opts.highlight && kind === "milestone" && !bulkRender && !$("game-screen").hidden) milestoneCard(text);
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

// a brass light running down the page: the machine printing another year
function yearSweep() {
  if (reducedMotion() || $("game-screen").hidden) return;
  const log = $("log");
  const line = el("div", { class: "year-sweep", style: `top: ${log.clientHeight / 2}px` });
  log.append(line);
  setTimeout(() => line.remove(), 520);
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

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Numbers tick up rather than jumping: a timer, never rAF, because rAF stalls in a covered
// window and a money counter frozen mid-count reads as a broken game.
function countTo(node, from, to, ms, format) {
  clearInterval(node._count);
  if (reducedMotion() || from === to) { node.textContent = format(to); return; }
  const started = performance.now();
  node._count = setInterval(() => {
    const t = Math.min(1, (performance.now() - started) / ms);
    node.textContent = format(from + (to - from) * (1 - Math.pow(1 - t, 3)));
    if (t >= 1) clearInterval(node._count);
  }, 16);
}

let shown = { money: null, stats: {}, age: null };

function renderHero() {
  const st = stage(life.age);
  const avatar = $("avatar");
  avatar.textContent = life.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  avatar.style.setProperty("--avatar", life.gender === "female"
    ? "linear-gradient(135deg, #ff7eb3, #a26bff)"
    : "linear-gradient(135deg, #4fb6ff, #5a5cff)");
  avatar.style.setProperty("--ring", STAGE_RING[st]);
  $("hero-name").textContent = life.name;

  const flap = $("age-flap");
  if (shown.age !== life.age) {
    flap.textContent = life.age;
    flap.classList.remove("turning");
    void flap.offsetWidth; // restart the flip
    flap.classList.add("turning");
    shown.age = life.age;
  }
  $("hero-role").textContent = life.job ? life.job.title : life.retired ? "Retired" : life.school ? schoolLabel(life.school) : st;

  const money = $("money");
  const to = Math.round(life.money);
  if (shown.money === null) money.textContent = fmtMoney(to);
  else if (shown.money !== to) {
    countTo(money, shown.money, to, 520, (v) => fmtMoney(v));
    money.classList.add(to > shown.money ? "flash-up" : "flash-down");
    setTimeout(() => money.classList.remove("flash-up", "flash-down"), 400);
  }
  shown.money = to;
  money.classList.toggle("negative", life.money < 0);
  $("dock-career-label").textContent = life.age < 18 || life.school ? "School" : "Career";
  renderDangerBanner();
  renderDockBadges();
}

function renderStats() {
  const box = $("stats");
  box.innerHTML = "";
  for (const s of STATS) {
    const v = Math.round(life.stats[s]);
    const was = shown.stats[s];
    const valEl = el("span", { class: "stat-val" }, `${was === undefined ? v : Math.round(was)}%`);
    const rowEl = el("div", { class: `stat-row${v < 25 ? " low" : ""}`, style: `--c: ${STAT_META[s].color}` },
      el("div", { class: "stat-top" }, el("span", { class: "stat-name" }, STAT_META[s].label), valEl),
      el("div", { class: "bar" }, el("div", { class: "bar-fill", style: `width: ${v}%` })));
    if (was !== undefined && Math.round(was) !== v) {
      const d = v - Math.round(was);
      rowEl.append(el("span", { class: "stat-delta", style: `color: ${d > 0 ? STAT_META[s].color : "var(--bad)"}` }, `${d > 0 ? "+" : "−"}${Math.abs(d)}`));
      countTo(valEl, Math.round(was), v, 520, (x) => `${Math.round(x)}%`);
    }
    box.append(rowEl);
    shown.stats[s] = v;
  }
}

// How many things are still worth doing in each sheet this year — the honest replacement for
// an energy meter: a count of what's left, not a budget you spend.
function sheetTodo(view) {
  if (view === "activities") return ACTIVITIES.filter((a) => activityOpen(a) && !done(a.id, perYear(a.id)) && !(a.need && a.need()) && !(a.cooldown && cooling(a.id, a.cooldown))).length;
  if (view === "people") return life.people.filter((p) => p.alive && !done(`person:${p.id}`)).length;
  if (view === "career") {
    let n = 0;
    if (life.school) n += (done("study") ? 0 : 1) + (life.clubs || []).filter((c) => !done(`club:${c}`)).length;
    if (life.job) n += (done("workharder") ? 0 : 1) + (done("raise") || cooling("raise", 2) ? 0 : 1);
    if (!life.job && !life.retired && life.age >= 15) n += Math.max(0, 2 - (life.applied || 0));
    n += HUSTLES.filter((h) => life.age >= h.min && !done(`hustle:${h.id}`) && !(h.need && h.need())).length;
    return n;
  }
  if (view === "assets") return done("trade") ? 0 : 1;
  if (view === "you") return (life.goals || []).filter((g) => !g.done).length;
  return 0;
}

function renderDockBadges() {
  for (const btn of document.querySelectorAll(".dock-btn")) {
    const n = sheetTodo(btn.dataset.sheet);
    let badge = btn.querySelector(".dock-badge");
    if (!badge) { badge = el("span", { class: "dock-badge" }); btn.prepend(badge); }
    badge.textContent = n;
    badge.classList.toggle("empty", n === 0);
  }
}

function renderDangerBanner() {
  const banner = $("danger-banner");
  const h = life.stats.health;
  if (!life.alive || h >= 30) { banner.hidden = true; return; }
  banner.hidden = false;
  banner.className = `danger-banner${h < 15 ? " critical" : ""}`;
  banner.replaceChildren(
    el("b", {}, h < 15 ? "Your health is critical." : "Your health is failing."),
    " A doctor could help.",
  );
  banner.onclick = () => openSheet("activities");
}

function renderAll() {
  renderHero();
  renderStats();
}

/* A milestone deserves more than one grey line in a list nobody is looking at. */
function milestoneCard(text) {
  if (reducedMotion()) return;
  document.querySelector(".milestone")?.remove();
  const card = el("div", { class: "milestone", onclick: () => card.remove() },
    el("div", { class: "m-icon" }, "✦"),
    el("p", { class: "m-kicker" }, `Age ${life.age}`),
    el("p", { class: "m-text" }, text));
  document.body.append(card);
  setTimeout(() => card.remove(), 2600);
}

function showScreen(which) {
  for (const id of ["start-screen", "game-screen", "death-screen"]) $(id).hidden = id !== which;
}

/* ================= the year ================= */

const QUIET_YEAR = {
  Baby: ["You spent the year babbling at everyone who'd listen.", "You discovered your own feet. Fascinating.", "You mastered the art of the nap.",
    "You learned that dropping food is hilarious.", "You developed strong opinions about one specific spoon.", "You slept through something important."],
  Child: ["You spent the year climbing everything in sight.", "You grew two inches and wanted everyone to notice.", "It was a year of scraped knees and big imaginations.",
    "You lost a tooth and negotiated hard over it.", "You had a best friend, then a different best friend.", "You watched the same film eleven times."],
  Teen: ["The year flew by in a blur of homework and group chats.", "You spent the year figuring out who you are.", "Your music taste changed completely. Again.",
    "You stayed up far too late for no particular reason.", "You had opinions. Loud ones.", "Nothing happened, which at that age feels like everything."],
  Adult: ["The year passed quietly — sometimes that's a gift.", "Work, rest, repeat. A steady kind of year.", "You settled into a comfortable rhythm.",
    "You meant to start something new and didn't. Next year.", "A year of small, unremarkable, decent days.", "You got very good at one boring, useful thing."],
  Senior: ["You spent the year enjoying the little things.", "A peaceful year of long mornings and good tea.", "You told your favourite stories to anyone who'd listen.",
    "You gave unsolicited advice and were mostly right.", "The garden looked better than it had in years.", "You slept badly and read a great deal."],
};

// A quiet year still knows who you are: it borrows from your job, your spouse, your pet.
function quietLine() {
  const pool = [...QUIET_YEAR[stage(life.age)]];
  const alive = life.people.filter((p) => p.alive);
  const spouse = alive.find((p) => p.role === "Spouse");
  const pet = alive.find((p) => p.pet);
  const closest = alive.filter((p) => !p.pet).sort((a, b) => b.bond - a.bond)[0];
  if (life.job) pool.push(`A quiet year at work. You got very good at the coffee machine.`, `Another year as ${an(life.job.title.toLowerCase())}. Nothing broke.`);
  if (life.school) pool.push("School, homework, repeat. The year went by in a blur.");
  if (life.clubs?.length) pool.push("Another season with the club. You were almost good at it.");
  if (spouse) pool.push(`You and ${firstName(spouse.name)} watched an entire series twice.`);
  if (pet) pool.push(`${pet.name} turned ${pet.age}. There was a small hat involved.`);
  if (closest && closest.bond >= 70) pool.push(`You and ${firstName(closest.name)} talked most weeks. It helped.`);
  if (life.money < 0) pool.push("A thin year. You got very good at not looking at your balance.");
  if (life.retired) pool.push("Retirement suits you. The mornings belong to you now.");
  if (life.assets.some((a) => a.kind === "home")) pool.push("You finally fixed the thing in the kitchen you'd been ignoring.");
  return pick(pool);
}

function ageUp() {
  if (!life?.alive || busy) return;
  closeSheet();
  yearSweep();
  life.age += 1;
  life.prepped = uses("study"); // revision done during the year just gone, read by the exams
  life.doneThisYear = {};
  life.gained = {};
  life.applied = 0;
  life.rejected = [];
  const before = life.log.length;

  yearlyDrift();
  yearSchool();
  yearWork();
  yearPeople();
  yearAssets();

  if (life.stats.health <= 0) return die("poor health");
  if (rollDeath()) return;

  if (life.age === 18 && life.inheritance) {
    const { from, amount } = life.inheritance;
    life.money += amount;
    life.inheritance = null;
    addLog(`A letter arrived: ${from} left you ${fmtMoney(amount)}.`, "milestone", { highlight: true });
    bump("happiness", 4, 8);
  }
  const worth = life.money + life.assets.reduce((t, a) => t + a.value, 0);
  life.peak = Math.max(life.peak || 0, worth);
  checkBadges();
  // a "quiet year" line only when the year really was quiet — never right above an event
  const eventful = Math.random() < (life.age < 3 ? 0.5 : 0.88);
  if (!eventful && life.log.length === before) addLog(quietLine(), "action");
  renderAll();
  save();
  if (eventful) runEvent();
}

function yearlyDrift() {
  const s = life.stats;
  for (const k of STATS) s[k] += rand(-2, 2);
  // everything fades with time; the menus can only just keep pace, which is the point
  if (life.age > 30) s.health -= rand(0, (life.age - 30) / 7);
  // looks fade, but nobody is a zero: gravity slows down once it has had its way
  if (life.age > 25 && s.looks > 12) s.looks -= rand(0, life.age > 55 ? 1.8 : 1.1);
  if (life.age > 25) s.smarts -= rand(0, (life.age - 25) / 30);
  if (life.condition) s.health -= 1;
  // only the people you're closest to move your mood — a stack of distant acquaintances doesn't
  const bonds = life.people.filter((p) => p.alive && !p.pet).map((p) => p.bond).sort((a, b) => b - a).slice(0, 5);
  if (bonds.length) s.happiness += (bonds.reduce((a, b) => a + b, 0) / bonds.length - 50) / 20;
  s.happiness += (50 - s.happiness) * 0.08; // moods drift back toward normal, good or bad
  if (life.money < -20000) s.happiness -= 1; // debt weighs on you
  for (const k of STATS) s[k] = clamp(s[k], 0, 100);
}

function schoolLabel(school) {
  if (school.stage === "university") return `University · year ${school.year}`;
  return { elementary: "Elementary school", middle: "Middle school", high: "High school" }[school.stage];
}

// End-of-year exams: the one moment school actually judges you, and the gate to university.
function sitExams(sc) {
  // One number, and you can see where it came from: how clever you are, how much work you put
  // in across the years, and how much you revised this one.
  const score = clamp(life.stats.smarts * 0.55 + (sc.effort || 50) * 0.3 + (life.prepped || 0) * 6 + rand(-7, 7), 0, 100);
  sc.exam = Math.round(score);
  sc.grades = sc.exam;
  const verdict = score >= 90 ? "Top of the year." : score >= 75 ? "A good year." : score >= 55 ? "You scraped through." : "That did not go well.";
  addLog(`End-of-year exams: ${Math.round(score)}%. ${verdict}`, score >= 75 ? "milestone" : score < 45 ? "bad" : "action", { highlight: score >= 90 || score < 40 });
  if (score >= 90) awardBadge("topofyear");
}

function yearSchool() {
  const a = life.age;
  const sc = life.school;
  if (sc) {
    if (sc.effort === undefined) sc.effort = 50;
    sc.effort = clamp(sc.effort - rand(0, 4), 0, 100); // effort slides unless you put the work in
    if (a >= 7) sitExams(sc);
  }

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
    life.lastGrades = sc.grades;
    life.school = null;
    life.education = "high school";
    const honours = sc.grades >= 85 ? " with honours" : "";
    addLog(`You graduated from high school${honours}!`, "milestone", { highlight: true });
    life.stats.happiness = clamp(life.stats.happiness + 6, 0, 100);
  } else if (sc?.stage === "university") {
    life.money -= 16000;
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
    // progressive take-home: a big salary keeps less of each extra pound
    const take = job.partTime ? job.salary * 0.85
      : job.salary <= 40000 ? job.salary * 0.72 : 28800 + (job.salary - 40000) * 0.52;
    life.money += Math.round(take);
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
    life.stats.happiness = clamp(life.stats.happiness - rand(1, 3), 0, 100); // being out of work grinds
  }
  // Everyone pays to live. Nobody did before, which is why every life ended a millionaire.
  if (life.age >= 22) {
    const kids = life.people.filter((p) => p.alive && KID_ROLES.includes(p.role) && p.age < 18).length;
    life.money -= COST_OF_LIVING + kids * 7000;
  }
}

function yearPeople() {
  // grown-up children start families of their own: the whole point of the senior years
  for (const kid of life.people.filter((p) => p.alive && KID_ROLES.includes(p.role) && p.age >= 24 && p.age <= 42 && p.bond >= 40)) {
    if (Math.random() < 0.16) {
      const g = Math.random() < 0.5 ? "female" : "male";
      const last = life.name.split(" ").slice(1).join(" ");
      const baby = newPerson(g === "female" ? "Granddaughter" : "Grandson",
        `${pick((COUNTRIES[life.country] || COUNTRIES["United States"])[g])} ${last}`, 0, randInt(70, 92), { gender: g });
      life.people.push(baby);
      addLog(`${firstName(kid.name)} had a baby ${g === "female" ? "girl" : "boy"} — you're a grandparent! Meet ${firstName(baby.name)}.`, "milestone", { highlight: true });
      bump("happiness", 8, 14);
    }
  }
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
  let upkeep = 0;
  for (const a of life.assets) {
    // things you own cost money to keep: cars lose value and eat repairs, homes gain but need work
    a.value = a.kind === "car" ? Math.max(500, Math.round(a.value * 0.88)) : Math.round(a.value * 1.03);
    upkeep += Math.round(a.value * (a.kind === "car" ? 0.04 : 0.012));
  }
  if (upkeep) life.money -= upkeep;
  if (life.assets.some((a) => a.kind === "home")) life.stats.happiness = clamp(life.stats.happiness + 0.6, 0, 100);
}

function rollDeath() {
  const a = life.age;
  // Health has to matter: neglect it and you die decades early, look after it and you see ninety.
  const base = a < 1 ? 0.0035 : a < 14 ? 0.0007 : a < 26 ? 0.0022 : a < 40 ? 0.0010
    : a < 50 ? 0.0018 : Math.pow((a - 50) / 50, 3) * 0.30;
  const h = life.stats.health;
  let risk = base * (0.4 + Math.pow((100 - h) / 100, 1.6) * 3.2);
  if (h < 30) risk += ((30 - h) / 100) * 0.06;
  if (life.condition) risk += 0.004;
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
    el("button", { class: "ghost-btn", type: "button", onclick: () => { addLog(quietLine(), "action"); closeEventCard(); } }, "Skip"),
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
  for (const btn of document.querySelectorAll(".dock-btn")) btn.classList.remove("open");
}
function renderSheet() {
  if (!sheetView) return;
  const body = $("sheet-body");
  // keep the player's place: rebuilding the list used to fling them back to the top on every tap
  const keepScroll = body.scrollTop;
  body.innerHTML = "";
  $("sheet-back").hidden = sheetView.view !== "person";
  ({ career: sheetCareer, people: sheetPeople, person: sheetPerson, assets: sheetAssets, activities: sheetActivities, you: sheetYou })[sheetView.view](body, sheetView.arg);
  const n = sheetTodo(sheetView.view === "person" ? "people" : sheetView.view);
  $("sheet-ledger").textContent = `Age ${life.age} · ${n} left to do here this year`;
  body.scrollTop = keepScroll;
  for (const btn of document.querySelectorAll(".dock-btn")) btn.classList.toggle("open", btn.dataset.sheet === sheetView.view || (sheetView.view === "person" && btn.dataset.sheet === "people"));
  renderAll();
}

/* No energy meter: every action is simply once a year, and the row says so once you've used it.
   A year is the resource — if you want the gym AND the doctor, you have to live longer. */

/* How many times you've used something this year, and how many you have left. A flat "once a
   year, everything" was too blunt — a trip to the gym is not a wedding. Each action carries its
   own allowance instead. */
const uses = (id) => (life.doneThisYear && life.doneThisYear[id]) || 0;
const left = (id, limit = 1) => Math.max(0, limit - uses(id));
const done = (id, limit = 1) => left(id, limit) === 0;
// life.last remembers the age an action was last used, and survives the year rollover, so some
// things can carry a cooldown measured in years rather than resetting every birthday.
const yearsSince = (id) => (life.last && life.last[id] !== undefined ? life.age - life.last[id] : 999);
function cooling(id, years) {
  const since = yearsSince(id);
  return since < years ? years - since : 0;
}

function useAction(id, cost = 0, limit = 1) {
  if (done(id, limit)) {
    toast(limit > 1
      ? `That's your ${limit} for this year. Tap Age to move on.`
      : "You already did that this year. Tap Age to move on.");
    return false;
  }
  if (!payFor(cost)) return false;
  if (!life.doneThisYear) life.doneThisYear = {};
  if (!life.last) life.last = {};
  life.doneThisYear[id] = uses(id) + 1;
  life.last[id] = life.age;
  return true;
}

// Children have no money of their own, so anything with a price tag means asking a parent —
// and a parent who barely hears from you is less inclined to say yes.
function payFor(cost) {
  if (cost <= 0) return true;
  const parents = life.people.filter((p) => p.alive && (p.role === "Mother" || p.role === "Father"));
  if (life.age >= 18 || !parents.length) {
    if (cost > life.money) {
      toast(`You can't afford that — you need ${fmtMoney(cost - life.money)} more.`);
      return false;
    }
    life.money -= cost;
    return true;
  }
  const parent = parents.sort((a, b) => b.bond - a.bond)[0];
  if (Math.random() < clamp(0.35 + parent.bond / 140, 0.2, 0.95)) {
    toast(`${firstName(parent.name)} paid for it.`);
    return true;
  }
  parent.bond = clamp(parent.bond - 1, 0, 100);
  toast(`${firstName(parent.name)} said not this month.`);
  return false;
}

function awardBadge(id) {
  if (!BADGES[id]) return;
  if (!life.badges) life.badges = [];
  if (life.badges.includes(id)) return;
  life.badges.push(id);
  const [icon, name, line] = BADGES[id];
  toast(`${icon}  ${name} — ${line}`);
  addLog(`${icon} ${name}: ${line.toLowerCase()}.`, "milestone", { highlight: true });
}

function checkGoals() {
  if (!life.goals) return;
  for (const g of life.goals) {
    if (g.done) continue;
    const goal = GOALS.find((x) => x.id === g.id);
    if (!goal || !goal.test(life)) continue;
    g.done = life.age;
    toast(`${goal.icon}  Goal complete — ${goal.name}`);
    addLog(`${goal.icon} Goal complete: ${goal.name.toLowerCase()}.`, "milestone", { highlight: true });
    bump("happiness", 6, 10);
  }
}

// Badges you earn by living rather than by tapping: checked after every year and every action.
function checkBadges() {
  checkGoals();
  const alive = life.people.filter((p) => p.alive);
  if (life.education === "high school" || life.education === "university") awardBadge("graduate");
  if (life.education === "university") awardBadge("scholar");
  if (life.job) awardBadge("firstjob");
  if ((life.job?.level || 0) >= 3) awardBadge("boss");
  if (life.money >= 100000) awardBadge("sixfigures");
  if (life.money >= 1000000) awardBadge("millionaire");
  if (life.assets.some((a) => a.kind === "home")) awardBadge("homeowner");
  if (life.assets.some((a) => a.kind === "car")) awardBadge("wheels4");
  if (life.people.some((p) => p.role === "Spouse")) awardBadge("married");
  if (life.people.some((p) => KID_ROLES.includes(p.role))) awardBadge("parent");
  if (life.people.some((p) => GRANDKID_ROLES.includes(p.role))) awardBadge("grandparent");
  if (life.people.some((p) => p.pet)) awardBadge("petlover");
  if (alive.some((p) => p.bond >= 95)) awardBadge("bestfriend");
  if (life.school && life.school.grades >= 95) awardBadge("straightA");
  if (life.age >= 100) awardBadge("centenarian");
}

/* Two ways a stat can move.

   gain() is the raw one, used by AI events and one-off milestones. It reports what ACTUALLY
   happened after clamping — the old version returned the dice roll, so at 100 health the doctor
   cheerfully logged "+9 health" while nothing moved at all. That lie is why the doctor looked
   like free health.

   gain() is the one every menu action uses: it fades out as the stat approaches SHEET_CEIL and
   is capped per year, so no amount of tapping pins you at 100. Only the AI's events can take a
   stat above the ceiling — which is what makes its choices worth something. */
const SHEET_CEIL = 94;
const COST_OF_LIVING = 16000;
const YEAR_GAIN_CAP = { happiness: 7, health: 5, smarts: 5, looks: 5 };

function bump(stat, lo, hi) {
  const before = life.stats[stat];
  life.stats[stat] = clamp(before + rand(lo, hi), 0, 100);
  return Math.round(life.stats[stat] - before);
}

function gain(stat, lo, hi) {
  const raw = rand(lo, hi);
  if (raw <= 0) return bump(stat, lo, hi); // penalties always land in full
  const fade = clamp((SHEET_CEIL - life.stats[stat]) / 30, 0, 1);
  if (!life.gained) life.gained = {};
  const spent = life.gained[stat] || 0;
  const room = Math.max(0, (YEAR_GAIN_CAP[stat] || 6) - spent);
  const before = life.stats[stat];
  life.stats[stat] = clamp(before + Math.min(raw * fade, room), 0, 100);
  const applied = Math.round(life.stats[stat] - before);
  life.gained[stat] = spent + applied;
  return applied;
}

/* Rows never use the HTML disabled attribute: a disabled button swallows the tap, and then the
   player has no idea why nothing happened. A spent or locked row stays tappable, wears a stamp,
   and when you tap it, it shakes its head and tells you exactly why. */
function row({ icon, color, title, sub, side, sideClass, onclick, disabled, reason, bar, barColor, doneId, doneLimit = 1 }) {
  const isDone = doneId ? done(doneId, doneLimit) : false;
  // part-used rows say so without being spent: "1 of 3 this year"
  if (doneId && !isDone && doneLimit > 1 && uses(doneId) > 0 && !side) side = `${uses(doneId)} of ${doneLimit}`;
  const inert = isDone || !!disabled;
  const stamp = isDone ? (doneLimit > 1 ? `all ${doneLimit} done` : "done this year") : disabled && side ? side : null;
  const tag = onclick || inert ? "button" : "div";
  const emoji = /\p{Extended_Pictographic}/u.test(icon);
  const node = el(tag, {
    class: `row${isDone ? " is-done" : ""}${tag === "div" ? " static" : ""}`,
    type: tag === "button" ? "button" : null,
    "aria-disabled": inert ? "true" : null,
    style: color ? `--c: ${color}` : null,
    onclick: inert
      ? () => {
        node.classList.remove("nudging");
        void node.offsetWidth;
        node.classList.add("nudging");
        toast(reason || (isDone
        ? doneLimit > 1
          ? `That's your ${doneLimit} for this year. Tap Age to move on.`
          : "You already did that this year. Tap Age to move on."
        : `Not yet — ${String(side || "locked").toLowerCase()}.`));
      }
      : onclick,
  },
    el("span", { class: `row-icon${emoji ? " emoji" : ""}` }, icon),
    el("span", { class: "row-main" },
      el("span", { class: "row-title" }, title),
      sub ? el("span", { class: "row-sub", style: "display:block" }, sub) : null,
      bar !== undefined ? el("span", { class: "mini-bar", style: `display:block; ${barColor ? `--c:${barColor}` : ""}` }, el("span", { style: `width:${Math.round(bar)}%` })) : null),
    stamp ? el("span", { class: "row-stamp" }, stamp)
      : side ? el("span", { class: `row-side ${sideClass || ""}` }, side) : null,
    onclick && !inert ? svgIcon("i-chevron", 16, "chev") : null);
  return node;
}
function sectionLabel(body, text) { body.append(el("p", { class: "section-label" }, text)); }

// Anything you can't undo asks once. Two taps, four seconds, no modal.
let pendingConfirm = null;
function dangerRow(body, { icon, title, sub, question, onConfirm }) {
  const armed = pendingConfirm === title;
  body.append(row({
    icon: armed ? "⚠️" : icon, color: "var(--bad)",
    title: armed ? question : title,
    sub: armed ? "Tap again to confirm" : sub,
    onclick: () => {
      if (armed) { pendingConfirm = null; onConfirm(); return; }
      pendingConfirm = title;
      renderSheet();
      setTimeout(() => { if (pendingConfirm === title) { pendingConfirm = null; if (sheetView) renderSheet(); } }, 4000);
    },
  }));
}

/* ----- you: goals, badges, and what the numbers actually mean ----- */

const STAT_RULE = {
  happiness: "How good life feels. It drifts back to normal, and the people you're close to pull it up.",
  health: "What keeps you alive. Let it fall and you die decades early; look after it and you'll see ninety.",
  smarts: "Gets you into university and into the jobs worth having.",
  looks: "Helps at interviews and when you're looking for someone. It fades after 25 unless you work at it.",
};

function sheetYou(body) {
  $("sheet-title").textContent = life.name;
  const openGoals = (life.goals || []).filter((g) => !g.done);
  const doneGoals = (life.goals || []).filter((g) => g.done);

  sectionLabel(body, `Life goals · ${doneGoals.length} of ${(life.goals || []).length}`);
  if (!life.goals?.length) body.append(el("p", { class: "note" }, "This life has no set goals — make your own."));
  for (const g of [...openGoals, ...doneGoals]) {
    const goal = GOALS.find((x) => x.id === g.id);
    if (!goal) continue;
    body.append(row({
      icon: goal.icon, color: g.done ? "var(--money)" : "var(--brass)",
      title: goal.name, sub: g.done ? `Done at ${g.done}` : goal.hint,
      side: g.done ? "✓" : null, sideClass: g.done ? "good" : "",
    }));
  }

  sectionLabel(body, "What the numbers mean");
  for (const s of STATS) {
    body.append(row({
      icon: `${Math.round(life.stats[s])}`, color: STAT_META[s].color,
      title: STAT_META[s].label, sub: STAT_RULE[s],
      bar: life.stats[s], barColor: STAT_META[s].color,
    }));
  }

  const badges = life.badges || [];
  sectionLabel(body, `Badges · ${badges.length} of ${Object.keys(BADGES).length}`);
  if (!badges.length) body.append(el("p", { class: "note" }, "None yet. They come from doing things for the first time."));
  for (const id of badges) {
    const b = BADGES[id];
    if (b) body.append(row({ icon: b[0], color: "var(--brass)", title: b[1], sub: b[2] }));
  }
}

/* ----- school & career ----- */

// Clubs are what people actually remember about school. Join up to two; each pays out yearly.
const CLUBS = [
  { id: "football", icon: "⚽", name: "Football team", min: 8, fx: { health: [3, 6], happiness: [2, 5] }, line: "Another season on the team." },
  { id: "drama", icon: "🎭", name: "Drama club", min: 8, fx: { looks: [2, 4], happiness: [3, 6] }, line: "You performed in front of actual humans." },
  { id: "chess", icon: "♟️", name: "Chess club", min: 7, fx: { smarts: [3, 6] }, line: "You got sharper across the board." },
  { id: "band", icon: "🎺", name: "School band", min: 7, fx: { smarts: [2, 4], happiness: [2, 5] }, line: "You played in the school band." },
  { id: "debate", icon: "🗣️", name: "Debate team", min: 12, fx: { smarts: [3, 5], looks: [0, 2] }, line: "You argued your way through another season." },
  { id: "art", icon: "🖌️", name: "Art club", min: 7, fx: { happiness: [3, 5], smarts: [1, 3] }, line: "You made things nobody asked for, happily." },
];

function schoolClubs(body) {
  const joined = life.clubs || (life.clubs = []);
  sectionLabel(body, "Clubs");
  if (!joined.length) body.append(el("p", { class: "note" }, "Join up to two clubs — they pay off every year you stay in."));
  for (const id of joined) {
    const club = CLUBS.find((c) => c.id === id);
    if (!club) continue;
    body.append(row({
      icon: club.icon, color: "var(--happy)", title: club.name, sub: `Member · ${effectLine(club)}`, doneId: `club:${id}`,
      onclick: () => {
        if (!useAction(`club:${id}`)) return;
        const bits = [];
        for (const [stat, [lo, hi]] of Object.entries(club.fx)) { const d = gain(stat, lo, hi); if (d) bits.push(`+${d} ${STAT_META[stat].label.toLowerCase()}`); }
        addLog(`${club.line}${bits.length ? ` (${bits.join(", ")})` : ""}`, "action");
        toast(bits.length ? bits.join("   ") : "A quiet season.");
        checkBadges(); renderSheet(); save();
      },
    }));
  }
  if (joined.length < 2) {
    for (const club of CLUBS.filter((c) => !joined.includes(c.id))) {
      const tooYoung = life.age < club.min;
      body.append(row({
        icon: club.icon, color: tooYoung ? "var(--faint)" : "var(--dim)", title: `Join the ${club.name.toLowerCase()}`,
        sub: effectLine(club), side: tooYoung ? `at ${club.min}` : null, disabled: tooYoung,
        onclick: () => {
          joined.push(club.id);
          addLog(`You joined the ${club.name.toLowerCase()}.`, "milestone", { highlight: true });
          renderSheet(); save();
        },
      }));
    }
  }
}

// Money you can actually influence, instead of waiting for a salary to trickle in.
const HUSTLES = [
  { id: "tutor", icon: "📐", name: "Tutor younger students", min: 15, fx: { smarts: [0, 2] },
    need: () => (life.stats.smarts >= 50 ? null : "You'd need sharper smarts to be trusted with that."),
    money: () => randInt(200, 900) + Math.round(life.stats.smarts * 8), line: "You tutored a few students through their exams." },
  { id: "art", icon: "🖼️", name: "Sell things you made", min: 14, fx: { happiness: [1, 4] },
    money: () => randInt(80, 700) + Math.round(life.stats.smarts * 4), line: "You sold a few pieces online." },
  { id: "market", icon: "🥘", name: "Run a weekend stall", min: 18, fx: { happiness: [1, 4], health: [-1, 0] },
    money: () => randInt(400, 2200), line: "You ran a stall at the weekend market." },
  { id: "freelance", icon: "💻", name: "Freelance at weekends", min: 18, fx: { happiness: [-3, -1], health: [-1, 0] },
    need: () => (life.job ? null : "You'd need a main job to freelance around."),
    money: () => Math.round(life.job.salary * rand(0.06, 0.16)), line: "You worked weekends and made rent twice over." },
  { id: "room", icon: "🛏️", name: "Rent out the spare room", min: 20, fx: { happiness: [-2, 0] },
    need: () => (life.assets.some((a) => a.kind === "home") ? null : "You'd need a home of your own first."),
    money: () => randInt(3500, 9000), line: "You rented out the spare room to a quiet lodger." },
];

function sideHustles(body) {
  const open = HUSTLES.filter((h) => life.age >= h.min);
  if (!open.length) return;
  sectionLabel(body, "Side hustles");
  for (const h of open) {
    body.append(row({
      icon: h.icon, color: "var(--money)", title: h.name, sub: h.need && h.need() ? h.need() : "Once a year · pays what it pays",
      doneId: `hustle:${h.id}`,
      onclick: () => {
        const blocked = h.need ? h.need() : null;
        if (blocked) { toast(blocked); return; }
        if (!useAction(`hustle:${h.id}`)) return;
        const earned = Math.round(h.money());
        life.money += earned;
        const bits = [`+${fmtMoney(earned)}`];
        for (const [stat, [lo, hi]] of Object.entries(h.fx || {})) { const d = gain(stat, lo, hi); if (d) bits.push(`${d > 0 ? "+" : "−"}${Math.abs(d)} ${STAT_META[stat].label.toLowerCase()}`); }
        addLog(`${h.line} (${bits.join(", ")})`, "action", { highlight: earned >= 3000 });
        toast(bits.join("   "));
        checkBadges(); renderSheet(); save();
      },
    }));
  }
}

function sheetCareer(body) {
  $("sheet-title").textContent = life.age < 18 || life.school ? "School" : "Career";
  const a = life.age;

  if (a < 5) {
    body.append(el("p", { class: "note" }, "Too young for school. Your only job right now is being adorable."));
    return;
  }

  if (life.school) {
    sectionLabel(body, "School");
    body.append(row({
      icon: life.school.stage === "university" ? "🎓" : "🏫", color: "var(--smarts)", title: schoolLabel(life.school),
      sub: life.school.exam ? `Last exams: ${life.school.exam}%` : "Your first exams are at 7",
      bar: life.school.effort === undefined ? 50 : life.school.effort, barColor: "var(--smarts)",
    }));
    body.append(row({
      icon: "✏️", color: "var(--smarts)", title: "Study harder", sub: "Better grades, more smarts · counts towards your exams · 2× a year",
      doneId: "study", doneLimit: 2,
      onclick: () => { if (!useAction("study", 0, 2)) return; life.school.effort = clamp((life.school.effort || 50) + rand(9, 16), 0, 100); const d = gain("smarts", 1, 3); addLog(`You buckled down and studied hard.${d ? ` (+${d} smarts)` : ""}`, "action"); toast(d ? `+${d} smarts   ready for the exams` : "Ready for the exams"); renderSheet(); save(); },
    }));
    body.append(row({
      icon: "😎", color: "var(--happy)", title: "Slack off", sub: "Fun now, exams later · 2× a year",
      doneId: "slack", doneLimit: 2,
      onclick: () => { if (!useAction("slack", 0, 2)) return; life.school.effort = clamp((life.school.effort || 50) - rand(8, 15), 0, 100); const h = gain("happiness", 3, 6); addLog("You slacked off and had a great time. Your grades didn't.", "action"); toast(h ? `+${h} happiness   exams are going to hurt` : "Exams are going to hurt"); renderSheet(); save(); },
    }));
    schoolClubs(body);
  }

  if (a >= 18 && !life.school && life.education === "high school") {
    sectionLabel(body, "Education");
    const grades = life.lastGrades || 0; // your final school exams
    if (life.job && !life.job.partTime) {
      body.append(row({ icon: "🎓", color: "var(--faint)", title: "Go to university", sub: "Quit your job to study full time", disabled: true }));
    } else if (grades < 60) {
      body.append(row({ icon: "🎓", color: "var(--faint)", title: "Go to university", sub: `Your school grades (${Math.round(grades)}%) weren't good enough`, disabled: true }));
    } else {
      body.append(row({
        icon: "🎓", color: "var(--looks)", title: "Go to university",
        sub: `$16,000 a year for 4 years · you'd graduate around ${fmtMoney(life.money - 64000)}`,
        onclick: () => {
          if (!useAction("university")) return;
          life.school = { stage: "university", year: 1, grades: clamp(life.stats.smarts + rand(-10, 10), 25, 95) };
          addLog("You enrolled at university. Time to find out what you love.", "milestone", { highlight: true });
          renderSheet(); save();
        },
      }));
    }
  }
  if (life.school && life.school.stage === "university") {
    dangerRow(body, {
      icon: "🚪", title: "Drop out", sub: "Keep the debt, lose the degree",
      question: "Drop out of university?",
      onConfirm: () => { life.school = null; addLog("You dropped out of university.", "bad", { highlight: true }); gain("happiness", -6, -2); renderSheet(); save(); },
    });
  }

  if (life.job) {
    const j = life.job;
    sectionLabel(body, j.partTime ? "Part-time job" : "Your job");
    body.append(row({ icon: j.icon || "💼", color: "var(--money)", title: j.title, sub: `${fmtMoney(j.salary)} a year · ${j.years} year${j.years === 1 ? "" : "s"} · performance`, bar: j.performance, barColor: "var(--money)" }));
    body.append(row({
      icon: "💪", color: "var(--money)", title: "Work harder", sub: "Performance up, happiness down a little",
      doneId: "workharder",
      onclick: () => { if (!useAction("workharder")) return; j.performance = clamp(j.performance + rand(10, 18), 0, 100); gain("happiness", -2, -1); addLog("You put in extra hours at work.", "action"); renderSheet(); save(); },
    }));
    body.append(row({
      icon: "💰", color: "var(--money)", title: "Ask for a raise",
      sub: cooling("raise", 2) ? `Too soon — wait ${cooling("raise", 2)} year${cooling("raise", 2) === 1 ? "" : "s"}` : `${Math.round(clamp((j.performance - 40) / 70, 0.05, 0.75) * 100)}% chance · costs you standing either way`,
      doneId: "raise",
      onclick: () => {
        const wait = cooling("raise", 2);
        if (wait) { toast(`You asked recently. Try again in ${wait} year${wait === 1 ? "" : "s"}.`); return; }
        if (!useAction("raise")) return;
        // no more 1.1x a year compounding into a $50M fast-food salary
        if (Math.random() < clamp((j.performance - 40) / 70, 0.05, 0.75)) {
          j.salary = Math.min(Math.round(j.salary * 1.06), Math.round(j.base_salary * Math.pow(1.22, j.level || 0) * 1.45));
          j.performance = clamp(j.performance - 30, 0, 100);
          addLog(`You asked for a raise — and got it! Now ${fmtMoney(j.salary)} a year.`, "milestone", { highlight: true });
          toast(`Raise! ${fmtMoney(j.salary)} a year`);
        } else {
          j.performance = clamp(j.performance - 10 - (Math.random() < 0.08 ? 25 : 0), 0, 100);
          addLog("You asked for a raise. Your boss said \"not this year\" — and remembered you asked.", "action");
          toast("No raise this year");
        }
        renderSheet(); save();
      },
    }));
    if (a >= 60 && !j.partTime) {
      body.append(row({
        icon: "🌅", color: "var(--lamp)", title: "Retire", sub: "Live on your pension",
        onclick: () => { life.retired = { pension: Math.round(j.salary * 0.5 * 0.35) }; addLog(`You retired after ${j.years} years as ${an(j.title.toLowerCase())}.`, "milestone", { highlight: true }); life.job = null; gain("happiness", 5, 10); renderSheet(); save(); },
      }));
    }
    dangerRow(body, {
      icon: "🚪", title: "Quit", sub: "Walk away from this job",
      question: `Quit? ${fmtMoney(j.salary)} a year gone.`,
      onConfirm: () => { addLog(`You quit your job as ${an(j.title.toLowerCase())}.`, "action"); life.job = null; renderSheet(); save(); },
    });
    sideHustles(body);
    return;
  }

  if (life.retired) {
    body.append(el("p", { class: "note" }, `You're retired on a pension of ${fmtMoney(life.retired.pension)} a year. Your time is finally your own — Activities is where the good stuff is now.`));
    sideHustles(body);
    return;
  }

  const partTimeOnly = a < 18 || !!life.school;
  if (a < 15) {
    if (!life.school) body.append(el("p", { class: "note" }, "You're a little young to work."));
    return;
  }
  sectionLabel(body, partTimeOnly ? "Part-time jobs" : "Job board");
  body.append(el("p", { class: "note" }, partTimeOnly
    ? "One application a year — pick the one you actually want."
    : `New openings every year — ${jobBoard(false).length} of ${JOBS.length} careers showing. One application a year.`));
  for (const job of jobBoard(partTimeOnly)) body.append(jobRow(job, partTimeOnly));
  sideHustles(body);
}

function jobBoard(partTime) {
  const key = `${life.age}-${partTime}`;
  if (life.jobBoard?.key !== key) {
    const list = partTime ? PART_TIME.map((j) => j[0]) : [...JOBS].sort(() => Math.random() - 0.5).slice(0, 7).map((j) => j[0]);
    life.jobBoard = { key, titles: list };
  }
  // best paid at the top: the job you're aiming for should be the first thing you see
  return life.jobBoard.titles.map((t) => (partTime ? PART_TIME : JOBS).find((j) => j[0] === t)).filter(Boolean)
    .sort((x, y) => y[1] - x[1]);
}

// Falling short of the smarts bar should genuinely lock you out, not cost you one extra try.
function hireChance(smartsNeed) {
  const s = life.stats;
  const grades = life.school ? life.school.grades : 60;
  return clamp(0.25 + (s.smarts - smartsNeed) / 70 + (s.looks - 50) / 300 + (grades - 50) / 200, 0.05, 0.85);
}
const oddsWord = (c) => (c >= 0.6 ? "Likely" : c >= 0.35 ? "Even odds" : "Long shot");

function jobRow(job, partTime) {
  const [title, salary] = job;
  const eduNeed = partTime ? "none" : job[2];
  const smartsNeed = partTime ? job[2] : job[3];
  const icon = partTime ? job[3] : job[4];
  const eduOk = EDU_RANK[life.education] >= EDU_RANK[eduNeed];
  const chanceNow = hireChance(smartsNeed);
  const rejected = (life.rejected || []).includes(title);
  const needs = !eduOk
    ? `🔒 Needs ${eduNeed === "university" ? "a degree" : "a diploma"}`
    : rejected ? "They passed on you this year"
    : `${fmtMoney(salary)} a year · ${oddsWord(chanceNow)}`;
  return row({
    icon, color: eduOk && !rejected ? "var(--money)" : "var(--faint)", title, sub: needs, disabled: !eduOk || rejected,
    reason: !eduOk
      ? `${title} needs ${eduNeed === "university" ? "a university degree" : "a high school diploma"} first.`
      : "They've already passed on you this year. Try again next year.",
    onclick: eduOk ? () => {
      // two applications a year, and a rejection closes that door until next year
      const used = (life.applied || 0);
      if (used >= 2) { toast("Two applications a year. Tap Age to try again."); return; }
      life.applied = used + 1;
      const chance = hireChance(smartsNeed);
      if (Math.random() < chance) {
        life.job = { title, base: title, base_salary: salary, level: 0, icon, salary, performance: randInt(45, 65), years: 0, partTime };
        life.jobsHeld = (life.jobsHeld || 0) + 1;
        addLog(`You got the job! You're now ${an(title.toLowerCase())} earning ${fmtMoney(salary)} a year.`, "milestone", { highlight: true });
        gain("happiness", 4, 8);
      } else {
        if (!life.rejected) life.rejected = [];
        life.rejected.push(title);
        addLog(`You applied to be ${an(title.toLowerCase())}, but they went with someone else.`, "action");
        toast("They went with someone else");
      }
      renderSheet(); save();
    } : null,
  });
}

/* ----- people ----- */

const ROLE_COLOR = { Mother: "var(--health)", Father: "var(--smarts)", Sister: "var(--looks)", Brother: "var(--looks)", Friend: "var(--happy)", Partner: "#ff7eb3", Spouse: "#ff7eb3", "Ex-partner": "var(--faint)", "Ex-spouse": "var(--faint)", Son: "var(--money)", Daughter: "var(--money)", Grandson: "#7dd3fc", Granddaughter: "#7dd3fc", Dog: "var(--lamp)", Cat: "var(--lamp)" };

const FAMILY_ROLES = ["Mother", "Father", "Sister", "Brother", "Son", "Daughter", "Grandson", "Granddaughter"];
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
function meetSection(body) {
  const a = life.age;
  const hasPartner = life.people.some((p) => p.alive && LOVE_ROLES.includes(p.role));
  sectionLabel(body, "Meet someone new");
  body.append(row({
    icon: "👋", color: "var(--happy)", title: "Make a new friend",
    sub: a >= 4 ? "Someone to share the whole thing with" : "Unlocks at 4",
    disabled: a < 4, side: a < 4 ? "at 4" : null,
    reason: "You're still a bit small to be making friends of your own.",
    doneId: "friend", doneLimit: 2, onclick: makeFriend,
  }));
  body.append(row({
    icon: "💘", color: "#ff7eb3", title: hasPartner ? "You're seeing someone" : "Find love",
    sub: hasPartner ? "Tap them above to make it count" : a >= 14 ? "Better odds when you're happy and looking after yourself" : "Unlocks at 14",
    disabled: a < 14 || hasPartner, side: a < 14 ? "at 14" : null,
    reason: hasPartner ? "You're already seeing someone." : "You're too young for that yet.",
    doneId: "love", onclick: findLove,
  }));
  body.append(row({
    icon: "🐾", color: "var(--lamp)", title: "Adopt a pet",
    sub: a >= 6 ? (a >= 18 ? "$200 adoption fee" : "If your parents say yes…") : "Unlocks at 6",
    disabled: a < 6, side: a < 6 ? "at 6" : null,
    reason: "Your parents aren't ready to trust you with an animal yet.",
    doneId: "pet", onclick: adoptPet,
  }));
}

function sheetPeople(body) {
  $("sheet-title").textContent = "People";
  const alive = life.people.filter((p) => p.alive);
  const friends = alive.filter((p) => p.role === "Friend");
  const loves = alive.filter((p) => LOVE_ROLES.includes(p.role));
  // When you have nobody of your own, meeting people is the first thing you see — burying it
  // under the family list is exactly why this looked like it wasn't in the game.
  const lonely = !friends.length && !loves.length;

  if (lonely) {
    body.append(el("p", { class: "note" }, life.age < 4
      ? "Right now your whole world is your family. Friends come soon."
      : "You haven't got anyone of your own yet. Go and find someone."));
    meetSection(body);
  } else {
    body.append(el("p", { class: "note" }, "Tap anyone to spend time with them. Every bond fades a little each year you leave it alone."));
  }

  const groups = [
    ["Love", loves],
    ["Friends", friends],
    ["Your family", alive.filter((p) => FAMILY_ROLES.includes(p.role))],
    ["Pets", alive.filter((p) => p.pet)],
    ["Water under the bridge", alive.filter((p) => p.role.startsWith("Ex-"))],
  ];
  for (const [label, list] of groups) {
    if (!list.length) continue;
    sectionLabel(body, label);
    for (const p of list.sort((x, y) => y.bond - x.bond)) body.append(personRow(p));
  }

  if (!lonely) meetSection(body);

  const gone = life.people.filter((p) => !p.alive);
  if (gone.length) {
    sectionLabel(body, "In memory");
    for (const p of gone) body.append(row({ icon: "🕯️", color: "var(--faint)", title: p.name, sub: `${p.role} · died at ${p.age}` }));
  }
}

const MAX_FRIENDS = 6;
function makeFriend() {
  if (life.people.filter((p) => p.alive && p.role === "Friend").length >= MAX_FRIENDS) {
    toast("Your calendar's full — you can't keep up with any more people.");
    return;
  }
  if (!useAction("friend", 0, 2)) return;
  const g = Math.random() < 0.5 ? "female" : "male";
  const friend = newPerson("Friend", randomName(life.country, g), clamp(life.age + randInt(-2, 2), 3, 110), randInt(45, 70), { gender: g, met: life.age });
  life.people.push(friend);
  addLog(`You became friends with ${friend.name}.`, "milestone");
  gain("happiness", 2, 5);
  renderSheet(); save();
}

function findLove() {
  if (!useAction("love")) return;
  const s = life.stats;
  if (Math.random() < clamp(0.18 + (s.looks + s.happiness) / 260, 0.15, 0.85)) {
    const g = life.gender === "female" ? "male" : "female";
    // teens only ever date teens, adults only adults
    const age = life.age < 18 ? clamp(life.age + randInt(-1, 1), 13, 17) : clamp(life.age + randInt(-3, 3), 18, 110);
    const partner = newPerson("Partner", randomName(life.country, g), age, randInt(55, 75), { gender: g });
    life.people.push(partner);
    addLog(`You started dating ${partner.name}.`, "milestone", { highlight: true });
    gain("happiness", 5, 10);
  } else {
    addLog("You put yourself out there, but it just didn't click.", "action");
    gain("happiness", -3, -1);
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
    gain("happiness", 6, 10);
  }
  renderSheet(); save();
}

function sheetPerson(body, id) {
  const p = life.people.find((x) => x.id === id);
  if (!p) return openSheet("people");
  const name = p.pet ? p.name : firstName(p.name);
  $("sheet-title").textContent = p.name;
  const avatar = el("div", { class: "avatar", style: `--avatar: linear-gradient(135deg, ${ROLE_COLOR[p.role] || "var(--dim)"}, #2a2440); --ring: ${ROLE_COLOR[p.role] || "var(--brass)"}` },
    p.pet ? PET_ICON[p.role] : name[0]);
  body.append(el("div", { class: "person-head" }, avatar,
    el("div", {},
      el("h3", {}, p.name),
      el("p", {}, `${p.role} · ${p.age} years old · `, el("span", { class: "bondval" }, `${bondWord(p.bond)} ${Math.round(p.bond)}%`)))));
  body.append(el("p", { class: "note" }, "Bonds fade a little every year. One proper afternoon together each year is what keeps them."));

  const slot = `person:${p.id}`;
  const act = (icon, title, sub, fn) => body.append(row({ icon, color: ROLE_COLOR[p.role] || "var(--lamp)", title, sub, doneId: slot, onclick: fn }));
  const refresh = () => { renderSheet(); save(); };

  if (p.pet) {
    act("🎾", "Play together", "Happiness for you both", () => { if (!useAction(slot)) return; p.bond = clamp(p.bond + rand(8, 14), 0, 100); gain("happiness", 3, 6); addLog(`You played with ${p.name} until you were both exhausted.`, "action"); refresh(); });
    return;
  }

  // one meaningful thing per person per year — which one is the interesting choice
  const together = (icon, title, sub, line, bondLo, bondHi, hapLo, hapHi, cost = 0) =>
    act(icon, title, sub, () => {
      if (!useAction(slot, cost)) return;
      // closeness has diminishing returns too: at 85 a day together barely beats the year's drift,
      // so keeping someone close is a standing cost, and with ten people you have to choose
      const b = Math.round(rand(bondLo, bondHi) * clamp((97 - p.bond) / 40, 0, 1));
      p.bond = clamp(p.bond + b, 0, 100);
      const h = gain("happiness", hapLo, hapHi);
      addLog(line, "action");
      toast(`${b > 0 ? "+" : "−"}${Math.abs(b)} with ${name}${h ? `   +${h} happiness` : ""}`);
      checkBadges();
      refresh();
    });

  together("☕", "Spend time together", "Grow closer", `You spent a lovely day with ${name}.`, 8, 14, 2, 5);
  together("💬", "Have a heart-to-heart", "Talk about something real", `You and ${name} had a long heart-to-heart.`, 4, 9, 1, 3);
  if (life.age >= 12) together("🎁", "Give a gift", fmtMoney(60 + life.age * 8), `You gave ${name} a thoughtful gift.`, 8, 14, 0, 2, 60 + life.age * 8);

  // roles have their own things to do: you don't read a bedtime story to your father
  if (p.role === "Mother" || p.role === "Father") {
    act("🦉", "Ask for advice", "Their years, your problem", () => {
      if (!useAction(slot)) return;
      const d = gain("smarts", 2, 5);
      p.bond = clamp(p.bond + rand(5, 9), 0, 100);
      addLog(`${name} told you what they'd have done at your age.${d ? ` (+${d} smarts)` : ""}`, "action");
      toast(d ? `+${d} smarts   closer to ${name}` : `Closer to ${name}`);
      refresh();
    });
    if (life.age >= 18) together("🍽️", "Take them out", "$80 — your treat for once", `You took ${name} out and insisted on paying.`, 10, 16, 3, 6, 80);
  }
  if (p.role === "Sister" || p.role === "Brother") {
    together("😈", "Team up against your parents", "Sibling solidarity", `You and ${name} closed ranks. Your parents never stood a chance.`, 8, 13, 3, 6);
  }
  if (KID_ROLES.includes(p.role)) {
    if (p.age <= 9) together("📖", "Read a bedtime story", "The same one again", `You read ${name} the same story for the ninth night running.`, 10, 15, 4, 7);
    if (p.age >= 6 && p.age <= 18) together("📐", "Help with homework", "Pretend you remember maths", `You helped ${name} with homework and quietly googled half of it.`, 7, 12, 1, 4);
    if (p.age >= 18) together("🔑", "Give them a hand", "$500 towards their life", `You helped ${name} out with money, no questions asked.`, 9, 15, 3, 6, 500);
  }
  if (GRANDKID_ROLES.includes(p.role)) {
    together("🍬", "Spoil them rotten", "That's the whole job", `You spoiled ${name} rotten and sent them home buzzing.`, 10, 16, 5, 9);
  }
  if (p.role === "Friend") {
    together("🎳", "Go out together", "A proper night out", `You and ${name} went out and stayed out.`, 8, 14, 4, 8, life.age >= 18 ? 40 : 0);
  }
  if ((p.role === "Mother" || p.role === "Father") && life.age >= 6) {
    // there is an age past which you cannot keep shaking down your mother
    if (life.age <= 30) act("💵", "Ask for money", "Costs you a little goodwill either way", () => {
      if (!useAction(slot)) return;
      if (Math.random() < p.bond / 125) {
        const amt = life.age < 13 ? randInt(5, 40) : life.age < 18 ? randInt(20, 200) : randInt(150, 1200);
        life.money += amt;
        p.bond = clamp(p.bond - 4, 0, 100);
        addLog(`${name} gave you ${fmtMoney(amt)}.`, "action");
        toast(`+${fmtMoney(amt)}   −4 with ${name}`);
      } else {
        p.bond = clamp(p.bond - 8, 0, 100);
        addLog(`You asked ${name} for money. The answer was a firm no.`, "action");
        toast(`No. −8 with ${name}`);
      }
      refresh();
    });
  }
  if (p.role === "Partner") {
    act("🌹", "Go on a date", "Romance & happiness", () => { if (!useAction(slot, life.age >= 18 ? 60 : 0)) return; p.bond = clamp(p.bond + rand(8, 14), 0, 100); gain("happiness", 4, 7); addLog(`You and ${name} went on a wonderful date.`, "action"); refresh(); });
    if (life.age >= 18 && p.age >= 18) act("💍", "Propose", "Needs a strong relationship", () => {
      if (!useAction(slot)) return;
      if (Math.random() < clamp((p.bond - 30) / 55, 0.05, 0.95)) {
        p.role = "Spouse";
        addLog(`You proposed to ${name} — they said yes! You got married.`, "milestone", { highlight: true });
        gain("happiness", 10, 15);
      } else {
        p.bond = clamp(p.bond - 6, 0, 100);
        addLog(`You proposed to ${name}. They said they weren't ready.`, "bad");
        gain("happiness", -8, -4);
      }
      refresh();
    });
    dangerRow(body, {
      icon: "💔", title: "Break up", sub: "End the relationship",
      question: `Break up with ${name}?`,
      // exes stay in the story — they just move to "Past" instead of never having existed
      onConfirm: () => { p.role = "Ex-partner"; addLog(`You and ${name} broke up.`, "bad", { highlight: true }); gain("happiness", -8, -3); openSheet("people"); save(); },
    });
  }
  if (p.role === "Spouse") {
    act("🍝", "Go on a date night", "Keep the spark alive", () => { if (!useAction(slot, 80)) return; p.bond = clamp(p.bond + rand(7, 12), 0, 100); gain("happiness", 3, 6); addLog(`You and ${name} had a lovely date night.`, "action"); refresh(); });
    if (life.age >= 20 && life.age <= 48) act("👶", "Start a family", "Welcome a baby into the world", () => {
      if (!useAction(slot)) return;
      if (Math.random() < 0.55) {
        const g = Math.random() < 0.5 ? "female" : "male";
        const last = life.name.split(" ").slice(1).join(" ");
        const baby = newPerson(g === "female" ? "Daughter" : "Son", `${pick((COUNTRIES[life.country] || COUNTRIES["United States"])[g])} ${last}`, 0, randInt(80, 100), { gender: g });
        life.people.push(baby);
        addLog(`You and ${name} welcomed a baby ${g === "female" ? "girl" : "boy"}, ${firstName(baby.name)}!`, "milestone", { highlight: true });
        gain("happiness", 10, 16);
      } else {
        addLog("You and your spouse are hoping for a baby. Not this year.", "action");
      }
      refresh();
    });
    dangerRow(body, {
      icon: "📄", title: "Divorce", sub: `Half of everything — about ${fmtMoney(Math.max(0, Math.round(life.money * 0.3)))}`,
      question: `Divorce ${name}? It costs ${fmtMoney(Math.max(0, Math.round(life.money * 0.3)))}.`,
      onConfirm: () => {
        p.role = "Ex-spouse";
        const cost = Math.max(0, Math.round(life.money * 0.3));
        life.money -= cost;
        addLog(`You and ${name} got divorced.${cost ? ` It cost you ${fmtMoney(cost)}.` : ""}`, "bad", { highlight: true });
        gain("happiness", -12, -6);
        openSheet("people"); save();
      },
    });
  }
  if (!["Mother", "Father", "Son", "Daughter", "Spouse", "Partner"].includes(p.role)) {
    act("😤", "Argue", "Say what you really think", () => { if (!useAction(slot)) return; p.bond = clamp(p.bond - rand(8, 16), 0, 100); gain("happiness", -4, -1); addLog(`You got into an argument with ${name}.`, "action"); refresh(); });
  }
}

/* ----- assets ----- */

function sheetAssets(body) {
  $("sheet-title").textContent = "Assets";
  body.append(row({ icon: "🏦", color: life.money < 0 ? "var(--bad)" : "var(--money)", title: fmtMoney(life.money), sub: life.money < 0 ? "You're in debt" : "In the bank" }));

  if (life.assets.length) {
    sectionLabel(body, "You own");
    for (const a of life.assets) {
      const resale = Math.round(a.value * (a.kind === "car" ? 0.85 : 0.94));
      const upkeep = Math.round(a.value * (a.kind === "car" ? 0.04 : 0.012));
      body.append(row({
        icon: a.icon || (a.kind === "car" ? "🚗" : "🏠"), color: "var(--lamp)", title: a.name,
        sub: `Worth ${fmtMoney(a.value)} · ${fmtMoney(upkeep)} a year to keep`,
      }));
      dangerRow(body, {
        icon: "🏷️", title: `Sell the ${a.name.toLowerCase()}`, sub: `You'd get ${fmtMoney(resale)}${a.paid ? ` · you paid ${fmtMoney(a.paid)}` : ""}`,
        question: `Sell for ${fmtMoney(resale)}?`,
        onConfirm: () => {
          if (done("trade")) { toast("One big purchase or sale a year."); return; }
          if (!life.doneThisYear) life.doneThisYear = {};
          life.doneThisYear.trade = uses("trade") + 1;
          life.money += resale;
          life.assets = life.assets.filter((x) => x.id !== a.id);
          addLog(`You sold your ${a.name.toLowerCase()} for ${fmtMoney(resale)}.`, "action");
          renderSheet(); save();
        },
      });
    }
  }

  const buy = (kind, name, price, icon) => {
    if (kind === "car" && !life.licence) { toast("You need a driving licence first — try Activities."); return; }
    if (life.assets.some((a) => a.name === name)) { toast(`You already own ${an(name.toLowerCase())}.`); return; }
    if (done("trade")) { toast("One big purchase or sale a year. Tap Age to move on."); return; }
    if (!payFor(price)) return;
    if (!life.doneThisYear) life.doneThisYear = {};
    life.doneThisYear.trade = uses("trade") + 1;
    // a car is worth less the moment it leaves the forecourt: no more buy-and-sell happiness loop
    life.assets.push({ id: uid(), kind, name, icon, paid: price, value: Math.round(price * (kind === "car" ? 0.82 : 1)) });
    addLog(`You bought ${an(name.toLowerCase())} for ${fmtMoney(price)}!`, "milestone", { highlight: price >= 20000 });
    // the thrill is relative to what you had: a first car at 19 beats a fourth car at 50
    const worth = Math.max(price, life.money + life.assets.reduce((t, a) => t + a.value, 0));
    gain("happiness", 1, clamp((price / worth) * 14, 1, kind === "home" ? 14 : 9));
    checkBadges();
    renderSheet(); save();
  };
  // Rows stay tappable even when you can't afford them: the gap between you and the thing you
  // want is the whole reason to keep tapping Age.
  const shop = (label, kind, list, color) => {
    sectionLabel(body, label);
    for (const [name, price, icon] of list) {
      const short = price - life.money;
      body.append(row({
        icon, color, title: name,
        sub: short > 0 ? `${fmtMoney(short)} short` : "You can afford this",
        side: fmtMoney(price), sideClass: short <= 0 ? "good" : "",
        onclick: () => buy(kind, name, price, icon),
      }));
    }
  };
  if (life.age >= 16) {
    if (!life.licence) body.append(el("p", { class: "note" }, "Cars need a driving licence — take lessons and a test in Activities."));
    shop("Cars", "car", CARS, "var(--smarts)");
  }
  if (life.age >= 20) shop("Homes", "home", HOMES, "var(--looks)");
  if (life.age < 16) body.append(el("p", { class: "note" }, "Cars once you can drive, homes at 20. Start saving your pocket money."));
}

/* ----- activities ----- */

/* How often a thing can be done in one year. Everyday habits come round again; the big ones
   don't. Anything not listed is once a year, and gain() still fades toward its ceiling, so
   repeating something cheap stops paying long before it breaks the balance. */
const PER_YEAR = {
  nap: 4, walk: 3, playground: 3, gym: 3, games: 3, post: 3, garden: 3, babysit: 3, meditate: 3, babble: 3,
  library: 2, instrument: 2, draw: 2, cook: 2, sleepover: 2, newword: 2, cuddle: 2, scribble: 2,
  haircut: 2, volunteer: 2, therapy: 2, spa: 2, roadtrip: 2, charity: 2, mentor: 2, lessons: 3, drivingtest: 2,
};
const perYear = (id) => PER_YEAR[id] || 1;

const activityCost = (act) => (act.cost && life.age >= (act.costFrom || 0) ? act.cost : 0);
const activityOpen = (act) => life.age >= act.min && (act.max === undefined || life.age <= act.max)
  && !(act.once && life.onceDone && life.onceDone[act.id]);

function effectLine(act) {
  const parts = act.subText ? [act.subText] : Object.entries(act.fx || {}).map(([stat, [lo, hi]]) => `${lo > 0 ? "+" : ""}${lo}–${hi} ${STAT_META[stat].label.toLowerCase()}`);
  const cost = activityCost(act);
  if (cost) parts.push(life.age < 18 ? `${fmtMoney(cost)} — ask a parent` : fmtMoney(cost));
  if (act.cooldown) parts.push(`every ${act.cooldown} years`);
  else if (act.id && perYear(act.id) > 1) parts.push(`${perYear(act.id)}× a year`);
  if (act.once) parts.push("once in a lifetime");
  return parts.join(" · ") || "See what happens";
}

function bondTarget(kind) {
  const alive = life.people.filter((p) => p.alive);
  const pools = {
    parent: alive.filter((p) => p.role === "Mother" || p.role === "Father"),
    friend: alive.filter((p) => p.role === "Friend"),
    grandchild: alive.filter((p) => GRANDKID_ROLES.includes(p.role)),
  };
  const pool = pools[kind] || [];
  return pool.length ? pick(pool) : null;
}

function doActivity(act) {
  const blocked = act.need ? act.need() : null;
  if (blocked) { toast(blocked); return; }
  const wait = act.cooldown ? cooling(act.id, act.cooldown) : 0;
  if (wait) { toast(`Not again for ${wait} year${wait === 1 ? "" : "s"}.`); return; }
  if (!useAction(act.id, activityCost(act), perYear(act.id))) return;
  if (act.once) {
    if (!life.onceDone) life.onceDone = {};
    life.onceDone[act.id] = true;
  }
  if (act.custom) {
    act.custom();
  } else {
    const bits = [];
    for (const [stat, [lo, hi]] of Object.entries(act.fx || {})) {
      const d = gain(stat, lo, hi);
      if (d) bits.push(`${d > 0 ? "+" : "−"}${Math.abs(d)} ${STAT_META[stat].label.toLowerCase()}`);
    }
    const friend = act.bond ? bondTarget(act.bond[0]) : null;
    if (friend) {
      const d = Math.round(rand(act.bond[1], act.bond[2]));
      friend.bond = clamp(friend.bond + d, 0, 100);
      bits.push(`${d > 0 ? "+" : "−"}${Math.abs(d)} with ${firstName(friend.name)}`);
    }
    addLog(bits.length ? `${act.log} (${bits.join(", ")})` : `${act.log} ${act.plateau || "It barely moved the needle this time."}`,
      "action", { highlight: act.highlight && bits.length > 0 });
    // the log is behind the sheet, so say what happened where the thumb already is
    toast(bits.length ? bits.join("   ") : act.plateau || "Barely moved the needle.");
  }
  if (act.after) act.after();
  if (act.badge) awardBadge(act.badge);
  checkBadges();
  renderSheet();
  save();
}

function sheetActivities(body) {
  $("sheet-title").textContent = "Activities";
  const open = ACTIVITIES.filter(activityOpen);
  for (const cat of CATS) {
    const list = open.filter((a) => a.cat === cat);
    if (!list.length) continue;
    sectionLabel(body, cat);
    for (const act of list) {
      body.append(row({
        icon: act.icon, color: STAT_META[Object.keys(act.fx || {})[0]]?.color || "var(--lamp)",
        title: act.label, sub: effectLine(act), doneId: act.id, doneLimit: perYear(act.id),
        onclick: () => doActivity(act),
      }));
    }
  }
  // a preview of the next few unlocks, so there is always something to look forward to
  const soon = ACTIVITIES.filter((a) => life.age < a.min).sort((a, b) => a.min - b.min).slice(0, 3);
  if (soon.length) {
    sectionLabel(body, "Coming up");
    for (const act of soon) {
      body.append(row({ icon: act.icon, color: "var(--faint)", title: act.label, sub: effectLine(act), side: `at ${act.min}`, disabled: true }));
    }
  }
}

/* ================= death ================= */

// Like a yearbook superlative: the one line a whole life gets remembered by.
function ribbon() {
  const s = life.stats;
  const worth = life.money + life.assets.reduce((t, a) => t + a.value, 0);
  const close = life.people.filter((p) => p.bond >= 75).length;
  const kids = life.people.filter((p) => p.role === "Son" || p.role === "Daughter").length;
  // Ordered rarest-first: by old age almost everyone is a millionaire, so wealth alone is a
  // dull thing to be remembered for.
  const rules = [
    [life.age >= 100, "Legend", "Lived to see a hundred"],
    [life.age < 30, "Shooting Star", "Gone far too soon"],
    [worth >= 5_000_000, "Tycoon", "Died with more money than sense"],
    [worth < -20000, "In the Red", "Owed half the town money"],
    [kids >= 3 && close >= 4, "Full House", "Raised a big, loud, loving family"],
    [close >= 5, "Beloved", "Surrounded by people who adored them"],
    [(life.job?.level || 0) >= 3, "Climber", "Worked all the way to the top"],
    [life.education === "university" && s.smarts >= 88, "Scholar", "Brains, and a degree to prove it"],
    [s.looks >= 85, "Heartthrob", "Turned heads to the very end"],
    [s.happiness >= 80, "Sunshine", "Happy — truly happy"],
    [s.health >= 80 && life.age >= 75, "Iron Will", "Fit as a fiddle for life"],
    [s.happiness < 25, "Storm Cloud", "Never quite cheered up"],
    [worth >= 1_000_000, "Comfortable", "Never had to worry about money again"],
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
  leaveEstate();
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

// Eighty years of numbers, handed back as something you'd screenshot.
function renderWrapped() {
  const box = $("wrapped");
  box.innerHTML = "";
  const worth = life.money + life.assets.reduce((t, a) => t + a.value, 0);
  const tiles = [
    [String(life.age), "Years lived"],
    [fmtMoney(Math.max(life.peak || 0, worth)), "Peak net worth"],
    [String(life.jobsHeld || 0), life.jobsHeld === 1 ? "Job held" : "Jobs held"],
    [String(life.people.length), "People in your life"],
  ];
  const grid = el("div", { class: "wrap-grid" });
  for (const [b, s] of tiles) grid.append(el("div", { class: "wrap-tile" }, el("b", {}, b), el("span", {}, s)));
  box.append(grid);

  if (life.badges?.length) {
    box.append(el("p", { class: "section-label" }, `${life.badges.length} badge${life.badges.length === 1 ? "" : "s"} earned`));
    const strip = el("div", { class: "badges" });
    for (const id of life.badges) {
      const badge = BADGES[id];
      if (badge) strip.append(el("div", { class: "badge" }, el("i", {}, badge[0]), badge[1]));
    }
    box.append(strip);
  }

  const marks = life.highlights.slice(-16);
  if (marks.length) {
    box.append(el("p", { class: "section-label" }, "The moments that made it"));
    const tl = el("div", { class: "timeline" });
    for (const m of marks) tl.append(el("p", {}, m));
    box.append(tl);
  }
}

async function showDeath() {
  showScreen("death-screen");
  renderWrapped();
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
  const newLife = $("new-life-btn");

  if (life.story) {
    $("obituary-text").textContent = life.story;
    if (life.epitaph) { epitaph.textContent = `“${life.epitaph}”`; epitaph.hidden = false; }
    return;
  }
  newLife.disabled = true;
  newLife.textContent = "Writing your obituary…";
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
    newLife.disabled = false;
    newLife.textContent = "Live another life";
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
let pendingRoll = null;

// You should see the hand you're being dealt before you agree to play it.
function rollStats() {
  pendingRoll = { happiness: randInt(55, 100), health: randInt(60, 100), smarts: randInt(15, 100), looks: randInt(15, 100) };
  const box = $("setup-roll");
  box.innerHTML = "";
  for (const s of STATS) {
    const v = pendingRoll[s];
    box.append(el("div", { class: "roll-stat", style: `--c: ${STAT_META[s].color}` },
      el("div", { class: "roll-top" }, el("span", {}, STAT_META[s].label), el("span", {}, `${v}`)),
      el("div", { class: "bar" }, el("div", { class: "bar-fill", style: `width: ${v}%` }))));
  }
}

function initStart() {
  const sel = $("setup-country");
  sel.innerHTML = "";
  for (const c of Object.keys(COUNTRIES)) sel.append(el("option", { value: c }, c));
  sel.value = "Saudi Arabia";
  setGender(setupGender);
  rerollName();
  rollStats();

  // A returning player's biggest button must not be the one that deletes their life.
  const saved = load();
  const cont = $("continue-btn");
  const begin = $("begin-btn");
  if (saved?.alive) {
    cont.hidden = false;
    cont.textContent = `Continue as ${firstName(saved.name)}, age ${saved.age}`;
    cont.className = "primary-btn";
    begin.className = "ghost-btn";
    begin.textContent = "Start a new life instead";
  } else {
    cont.hidden = true;
    begin.className = "primary-btn";
    begin.textContent = "Begin a new life";
  }
  renderPastLives();
}

function setGender(g) {
  setupGender = g;
  for (const b of $("setup-gender").querySelectorAll("button")) b.setAttribute("aria-checked", String(b.dataset.value === g));
}
function rerollName() {
  $("setup-name").value = randomName($("setup-country").value, setupGender);
  if (pendingRoll) rollStats();
}

let confirmNewLife = false;
function beginLife() {
  const saved = load();
  if (saved?.alive && !confirmNewLife) {
    confirmNewLife = true;
    const begin = $("begin-btn");
    begin.textContent = `Really start over? ${firstName(saved.name)}'s life ends here.`;
    setTimeout(() => { confirmNewLife = false; if (!$("start-screen").hidden) initStart(); }, 4000);
    return;
  }
  confirmNewLife = false;
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
$("sheet-back").addEventListener("click", () => openSheet("people"));
$("hero").addEventListener("click", () => { if (life?.alive) openSheet("you"); });
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
