const STORAGE_KEY = "delusional-handbook-v2";
const defaultState = {
  savingsTarget: 800000,
  savingsCurrent: 0,
  quests: {},
  customGoals: [],
  journal: [],
  theme: "dark"
};
let state = loadState();
let excuseNumber = 1;
let wisdomNumber = 0;
let roastNumber = 0;

const excuses = [
  "I'll start on Monday. This current week has bad energy.",
  "I work better under pressure. I have not tested the alternative, obviously.",
  "I need to research a little more. There are now 42 tabs and zero results.",
  "I deserve a break. I just took a break from the break.",
  "The setup isn't optimal. The setup is fine. The operator is buffering.",
  "I'm waiting for the right time. The right time has blocked my number.",
  "I have a plan. It is currently a beautifully formatted note.",
  "I'm manifesting. Excellent. Manifest a calendar reminder too.",
  "One last video. The sun has risen. That was not the last video.",
  "I'm saving money. The food delivery app would like to challenge that statement.",
  "I can't start today; Mercury is in retrograde and my Wi-Fi blinked.",
  "I was going to lock in, but the chair was comfortable and the vibes were immaculate."
];
const wisdom = [
  "Rich people have budgets. Broke people have screenshots of cars they want.",
  "You do not need a 17-step morning routine. You need to begin step one.",
  "Your dream car is not impressed by your Pinterest board. Earn the keys.",
  "Discipline is doing the boring thing while your brain opens the gaming launcher.",
  "Build skills, save money, avoid lifestyle inflation. Extremely unsexy. Weirdly effective.",
  "One finished project beats 40 tabs titled “best side hustles”.",
  "You can be delusional about the destination. Be realistic about the next step.",
  "Your future is built by boring little habits. Devastating news for people who love dramatic resets."
];
const roasts = [
  "You have the ambition of a billionaire and the calendar management of a sleepy pigeon.",
  "Your goals are premium. Your excuses are on a free trial.",
  "Potential: 10/10. Follow-through: please contact support.",
  "You are not behind in life. You are just buffering in 4K.",
  "The dream is valid. The “I'll do it tomorrow” subscription needs cancelling.",
  "Your future self is watching the loading screen and politely asking you to press Start."
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...defaultState, ...saved };
  } catch {
    return { ...defaultState };
  }
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("Browser storage is full. Even your excuses need storage now.");
  }
}
function $(id) { return document.getElementById(id); }
function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(Number(value) || 0);
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function randomFrom(list, previousIndex) {
  if (list.length < 2) return list[0];
  let index = Math.floor(Math.random() * list.length);
  while (index === previousIndex) index = Math.floor(Math.random() * list.length);
  return list[index];
}
function renderSavings() {
  const target = Math.max(1, Number(state.savingsTarget) || 1);
  const current = Math.max(0, Number(state.savingsCurrent) || 0);
  const pct = Math.min(100, Math.round(current / target * 100));
  $("savingsTarget").value = state.savingsTarget;
  $("savingsCurrent").value = state.savingsCurrent;
  $("savingsPercent").textContent = `${pct}%`;
  $("savingsRemaining").textContent = current >= target
    ? "TARGET HIT. FINANCIAL CHARACTER DEVELOPMENT."
    : `${money(target - current)} left. No pressure.`;
  $("savingsBar").style.width = `${pct}%`;
  $("statSavings").textContent = money(current);
}
function calculateCar() {
  const price = Math.max(0, Number($("carPrice").value) || 0);
  const down = Math.max(0, Number($("carDown").value) || 0);
  const principal = Math.max(0, price - down);
  const years = Math.max(1, Math.min(10, Number($("loanYears").value) || 1));
  const rate = Math.max(0, Number($("loanRate").value) || 0) / 1200;
  const months = years * 12;
  const emi = rate === 0 ? principal / months : principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  $("carEmi").textContent = money(Math.round(emi));
  $("carPrincipal").textContent = `Loan amount: ${money(principal)}`;
}
function renderQuests() {
  const inputs = [...document.querySelectorAll("[data-quest]")];
  inputs.forEach(input => { input.checked = Boolean(state.quests[input.dataset.quest]); });
  const done = inputs.filter(input => input.checked).length;
  const total = inputs.length;
  $("questCount").textContent = `${done} / ${total} done`;
  $("statDone").textContent = done;
  const level = 1 + Math.floor(done / 2) + (Number(state.savingsCurrent) >= Number(state.savingsTarget) ? 1 : 0);
  $("statLevel").textContent = level;
  $("levelNumber").textContent = level;
  $("levelBar").style.width = `${Math.min(100, done / total * 100)}%`;
  $("levelHint").textContent = done === total
    ? "All quests completed. We have no further excuses on file."
    : `${total - done} quests remain. Your excuses are preparing a statement.`;
  setBadge("badgeFirst", done >= 1);
  setBadge("badgeHalf", done >= Math.ceil(total / 2));
  setBadge("badgeAll", done === total);
}
function setBadge(id, unlocked) {
  const badge = $(id);
  badge.classList.toggle("unlocked", unlocked);
  badge.querySelector("b").textContent = unlocked ? "UNLOCKED" : "LOCKED";
}
function renderCustomGoals() {
  const grid = $("goalGrid");
  grid.querySelectorAll(".custom-goal").forEach(card => card.remove());
  state.customGoals.forEach((goal, index) => {
    const card = document.createElement("article");
    card.className = "goal-card custom-goal";
    const num = document.createElement("span");
    num.className = "goal-number";
    num.textContent = `SIDE_QUEST_${String(index + 1).padStart(3, "0")}`;
    const emoji = document.createElement("span");
    emoji.className = "goal-emoji";
    emoji.textContent = "✳";
    const title = document.createElement("h3");
    title.textContent = goal.title;
    const description = document.createElement("p");
    description.textContent = goal.description || "An ambitious side quest. Details to be determined by the committee (you).";
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = goal.category.toUpperCase();
    const remove = document.createElement("button");
    remove.className = "goal-remove";
    remove.textContent = "Remove ×";
    remove.setAttribute("aria-label", `Remove goal ${goal.title}`);
    remove.addEventListener("click", () => {
      state.customGoals.splice(index, 1);
      saveState(); renderCustomGoals(); updateGoalCount();
      showToast("Goal removed. One less thing to procrastinate about.");
    });
    card.append(num, emoji, title, description, tag, remove);
    grid.appendChild(card);
  });
  updateGoalCount();
}
function updateGoalCount() {
  $("statGoals").textContent = 6 + state.customGoals.length;
}
function renderJournal() {
  const list = $("journalEntries");
  list.replaceChildren();
  $("journalCount").textContent = `${state.journal.length} ${state.journal.length === 1 ? "entry" : "entries"}`;
  if (!state.journal.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No receipts yet. The evidence locker is suspiciously empty.";
    list.appendChild(empty);
    return;
  }
  state.journal.slice(0, 8).forEach(entry => {
    const article = document.createElement("article");
    article.className = "journal-entry";
    const time = document.createElement("time");
    time.textContent = entry.date;
    const p = document.createElement("p");
    p.textContent = entry.text;
    article.append(time, p);
    list.appendChild(article);
  });
}
function applyTheme() {
  document.body.classList.toggle("light", state.theme === "light");
  $("themeToggle").textContent = state.theme === "light" ? "☼" : "◐";
}
function init() {
  $("journalDate").textContent = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  $("savingsTarget").value = state.savingsTarget;
  $("savingsCurrent").value = state.savingsCurrent;
  renderSavings(); renderQuests(); renderCustomGoals(); renderJournal(); applyTheme(); calculateCar();
  document.querySelectorAll("[data-quest]").forEach(input => {
    input.addEventListener("change", () => {
      state.quests[input.dataset.quest] = input.checked;
      saveState(); renderQuests();
      if (input.checked) showToast("Quest logged. A rare instance of actually doing the thing.");
    });
  });
  $("savingsTarget").addEventListener("change", () => {
    state.savingsTarget = Math.max(1, Number($("savingsTarget").value) || 1);
    saveState(); renderSavings(); renderQuests();
  });
  $("savingsCurrent").addEventListener("change", () => {
    state.savingsCurrent = Math.max(0, Number($("savingsCurrent").value) || 0);
    saveState(); renderSavings(); renderQuests();
  });
  $("addSavingsButton").addEventListener("click", () => {
    const amount = Number($("savingsAdd").value);
    if (!Number.isFinite(amount) || amount <= 0) return showToast("Enter a positive amount. Imaginary rupees are not accepted.");
    state.savingsCurrent = Math.max(0, Number(state.savingsCurrent) || 0) + amount;
    $("savingsAdd").value = "";
    saveState(); renderSavings(); renderQuests();
    showToast(`Added ${money(amount)}. Look at you, making responsible decisions.`);
  });
  ["carPrice", "carDown", "loanYears", "loanRate"].forEach(id => $(id).addEventListener("input", calculateCar));
  $("excuseButton").addEventListener("click", () => {
    $("excuseText").textContent = `“${randomFrom(excuses, excuseNumber % excuses.length)}”`;
    excuseNumber++;
    $("excuseCount").textContent = `EXCUSE #${String(excuseNumber).padStart(3, "0")} · CERTIFIED NONSENSE`;
  });
  $("wisdomButton").addEventListener("click", () => {
    $("motivationText").textContent = randomFrom(wisdom, wisdomNumber % wisdom.length);
    wisdomNumber++;
    showToast("Wisdom delivered. Application not included.");
  });
  $("motivateButton").addEventListener("click", () => {
    $("motivationText").textContent = randomFrom(wisdom, wisdomNumber % wisdom.length);
    wisdomNumber++;
    showToast("Temporary motivation installed. Expires when you open social media.");
  });
  $("roastButton").addEventListener("click", doRoast);
  $("closingButton").addEventListener("click", () => {
    document.querySelector("#progress").scrollIntoView({ behavior: "smooth" });
    showToast("Character development started. Please do not close the tab.");
  });
  $("themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    saveState(); applyTheme();
    showToast(`${state.theme === "light" ? "Light" : "Dark"} mode. Your aesthetic has been updated.`);
  });
  $("addGoalButton").addEventListener("click", () => {
    $("goalForm").reset();
    $("goalDialog").showModal();
    $("newGoalTitle").focus();
  });
  $("goalForm").addEventListener("submit", event => {
    event.preventDefault();
    const title = $("newGoalTitle").value.trim();
    if (!title) return;
    state.customGoals.unshift({
      title,
      description: $("newGoalDescription").value.trim(),
      category: $("newGoalCategory").value
    });
    saveState(); renderCustomGoals();
    $("goalDialog").close();
    showToast("New side quest accepted. The committee has concerns.");
  });
  $("saveJournal").addEventListener("click", () => {
    const text = $("journalEntry").value.trim();
    if (!text) return showToast("Write something first. Even one sentence beats a blank page.");
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const existing = state.journal.findIndex(entry => entry.date === today);
    const entry = { date: today, text };
    if (existing >= 0) state.journal.splice(existing, 1);
    state.journal.unshift(entry);
    state.journal = state.journal.slice(0, 30);
    saveState(); renderJournal(); $("journalEntry").value = "";
    showToast("Daily log saved. Evidence of productivity has been secured.");
  });
}
function doRoast() {
  $("motivationText").textContent = randomFrom(roasts, roastNumber % roasts.length);
  roastNumber++;
  showToast("Roast delivered. Refunds are not available.");
}
document.addEventListener("DOMContentLoaded", init);
