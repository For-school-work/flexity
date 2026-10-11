/* ============================================================
   Flexity — main.js
   Navigation, product filtering, meal finder, store search,
   testimonial slider, newsletter validation, scroll effects.
   ============================================================ */

"use strict";

/* ---------- Product data ---------- */
const PRODUCTS = [
  { id: 1,  name: "Kung Pao Power Bowl",   cuisine: "chinese",  emoji: "🥡", goals: ["muscle", "fitness"],   kcal: 520, protein: 38, prep: 12, desc: "Spicy wok chicken, peanuts & brown rice for a protein-packed punch.", ingredients: "Chicken breast, peanuts, brown rice, chilli, spring onion, house sauce", allergens: "Peanuts" },
  { id: 2,  name: "Sweet & Sour Glow",     cuisine: "chinese",  emoji: "🍛", goals: ["fitness"],            kcal: 430, protein: 25, prep: 10, desc: "Lighter sweet & sour veggie mix with grilled chicken and jasmine rice.", ingredients: "Chicken breast, peppers, pineapple, jasmine rice, light sweet & sour sauce", allergens: "None" },
  { id: 3,  name: "Veggie Dragon Noodles", cuisine: "chinese",  emoji: "🍜", goals: ["weightloss", "fitness"], kcal: 340, protein: 16, prep: 8,  desc: "Chilli-garlic noodles loaded with crunchy vegetables, half the oil.", ingredients: "Wheat noodles, cabbage, carrot, pak choi, chilli-garlic sauce", allergens: "Gluten (wheat)" },
  { id: 4,  name: "Lean Burger Stack",     cuisine: "american", emoji: "🍔", goals: ["muscle"],             kcal: 560, protein: 42, prep: 15, desc: "Lean beef, wholegrain bun and all the sauce — no guilt attached.", ingredients: "Lean beef patty, wholegrain bun, lettuce, tomato, house sauce", allergens: "Gluten (wheat), sesame" },
  { id: 5,  name: "Morning Kickstart",     cuisine: "american", emoji: "🥞", goals: ["fitness", "weightloss"], kcal: 380, protein: 22, prep: 7,  desc: "Protein pancakes with berries and a light maple drizzle.", ingredients: "Oats, egg whites, whey protein, berries, light maple drizzle", allergens: "Eggs, milk" },
  { id: 6,  name: "Grilled BBQ Chicken",   cuisine: "american", emoji: "🍗", goals: ["muscle", "weightloss"], kcal: 460, protein: 45, prep: 14, desc: "Smoky BBQ chicken breast with roasted corn and slaw.", ingredients: "Chicken breast, roasted corn, crunchy slaw, smoky BBQ glaze", allergens: "Mustard" },
  { id: 7,  name: "Teriyaki Fit Bowl",     cuisine: "japanese", emoji: "🍣", goals: ["muscle", "fitness"],   kcal: 490, protein: 36, prep: 12, desc: "Glazed teriyaki chicken, edamame and sesame brown rice.", ingredients: "Chicken teriyaki, edamame, sesame brown rice, sesame seeds", allergens: "Soy, sesame" },
  { id: 8,  name: "Salmon Sushi Plate",    cuisine: "japanese", emoji: "🍱", goals: ["fitness", "weightloss"], kcal: 410, protein: 28, prep: 5,  desc: "Fresh salmon maki & nigiri with ginger and light soy.", ingredients: "Salmon, sushi rice, nori, avocado, pickled ginger, light soy", allergens: "Fish, soy, gluten" },
  { id: 9,  name: "Miso Veggie Soup",      cuisine: "japanese", emoji: "🍲", goals: ["weightloss"],         kcal: 210, protein: 12, prep: 6,  desc: "Warming miso broth with tofu and seaweed — light and satisfying.", ingredients: "Tofu, miso paste, wakame, spring onion, vegetable broth (no fish sauce)", allergens: "Soy" },
  { id: 10, name: "Dragon Roll Box",       cuisine: "japanese", emoji: "🍤", goals: ["fitness", "muscle"],  kcal: 470, protein: 30, prep: 9,  desc: "Prawn avocado rolls with a light chilli-mayo finish.", ingredients: "Prawn, avocado, sushi rice, nori, light chilli-mayo", allergens: "Shellfish, egg, soy" },
  { id: 11, name: "Mapo Tofu Lean",        cuisine: "chinese",  emoji: "🥘", goals: ["weightloss"],         kcal: 320, protein: 21, prep: 11, desc: "Silken tofu in a savoury Sichuan sauce over cauliflower rice.", ingredients: "Silken tofu, Sichuan sauce, spring onion, cauliflower rice", allergens: "Soy" },
  { id: 12, name: "All-Day Protein Stack", cuisine: "american", emoji: "🍳", goals: ["muscle"],             kcal: 540, protein: 40, prep: 10, desc: "Eggs, grilled turkey strips and avocado toast for serious fuel.", ingredients: "Eggs, grilled turkey strips, avocado, wholegrain toast", allergens: "Eggs, gluten (wheat)" }
];

const CUISINE_LABELS = { chinese: "Chinese", american: "American", japanese: "Japanese" };
const CUISINE_THUMBS = { chinese: "thumb-cn", american: "thumb-us", japanese: "thumb-jp" };
const GOAL_LABELS = {
  muscle: "Build muscle",
  weightloss: "Lose weight",
  fitness: "Stay fit & energised"
};

/* ---------- DOM helpers ---------- */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ============================================================
   1. Mobile navigation
   ============================================================ */
const nav = $("#nav");
const navToggle = $("#navToggle");

function closeNav() {
  nav.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

$$(".nav-link, .nav-cta", nav).forEach((link) => link.addEventListener("click", closeNav));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

/* ============================================================
   2. Header shadow + back-to-top button
   ============================================================ */
const header = $("#header");
const toTop = $("#toTop");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  toTop.classList.toggle("visible", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ============================================================
   3. Active nav link while scrolling (scroll spy)
   ============================================================ */
const sections = $$("main section[id]");

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((section) => spy.observe(section));

/* ============================================================
   4. Reveal-on-scroll animations
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ============================================================
   5. Animated hero counters
   ============================================================ */
const counters = $$("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => counterObserver.observe(el));

/* ============================================================
   6. Product grid + filters
   ============================================================ */
const productGrid = $("#productGrid");
const resultsCount = $("#resultsCount");
const emptyState = $("#emptyState");
const goalFilter = $("#goalFilter");

let activeCuisine = "all";

function productCard(product) {
  const article = document.createElement("article");
  article.className = "product-card meal-card reveal visible";
  article.dataset.cuisine = product.cuisine;
  article.dataset.goals = product.goals.join(" ");
  article.dataset.id = product.id;
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `View details for ${product.name}`);

  article.innerHTML = `
    <div class="product-thumb ${CUISINE_THUMBS[product.cuisine]}">
      <span class="product-tag">${CUISINE_LABELS[product.cuisine]}</span>
      <span aria-hidden="true">${product.emoji}</span>
    </div>
    <div class="product-body">
      <h3>${product.name}</h3>
      <div class="product-meta">
        <span class="meta-pill">🔥 ${product.kcal} kcal</span>
        <span class="meta-pill">💪 ${product.protein}g protein</span>
        <span class="meta-pill">⏱️ ${product.prep} min</span>
      </div>
      <p class="product-desc">${product.desc}</p>
      <div class="product-foot">
        <span class="meal-tag">Preservative-free</span>
        <span class="view-hint">View details →</span>
      </div>
    </div>`;
  return article;
}

function renderProducts() {
  const goal = goalFilter.value;
  const matches = PRODUCTS.filter((p) => {
    const cuisineOk = activeCuisine === "all" || p.cuisine === activeCuisine;
    const goalOk = goal === "all" || p.goals.includes(goal);
    return cuisineOk && goalOk;
  });

  productGrid.innerHTML = "";
  matches.forEach((p) => productGrid.appendChild(productCard(p)));
  emptyState.hidden = matches.length !== 0;

  const cuisineText = activeCuisine === "all" ? "" : `${CUISINE_LABELS[activeCuisine]} `;
  const goalText = goal === "all" ? "meals" : `meals for “${GOAL_LABELS[goal]}”`;
  resultsCount.textContent = matches.length
    ? `Showing ${matches.length} ${cuisineText}${goalText}`
    : "No meals to show";
}

$$("#cuisineFilter .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    $$("#cuisineFilter .chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeCuisine = chip.dataset.cuisine;
    renderProducts();
  });
});
goalFilter.addEventListener("change", renderProducts);

/* ============================================================
   7. Meal detail modal
   ============================================================ */
const mealModal = $("#mealModal");
const modalClose = $("#modalClose");
let lastFocusedCard = null;

function openMealModal(product, trigger) {
  lastFocusedCard = trigger || null;

  $("#modalEmoji").textContent = product.emoji;
  $("#modalImage").className = `modal-image ${CUISINE_THUMBS[product.cuisine]}`;
  $("#modalCuisine").textContent = CUISINE_LABELS[product.cuisine] + " cuisine";
  $("#modalTitle").textContent = product.name;
  $("#modalDesc").textContent = product.desc;
  $("#modalIngredients").textContent = product.ingredients;
  $("#modalAllergens").textContent = product.allergens;

  $("#modalMeta").innerHTML = `
    <span class="meta-pill">🔥 ${product.kcal} kcal</span>
    <span class="meta-pill">💪 ${product.protein}g protein</span>
    <span class="meta-pill">⏱️ ${product.prep} min</span>`;

  $("#modalGoals").innerHTML = product.goals
    .map((g) => `<span class="goal-pill">${GOAL_LABELS[g]}</span>`)
    .join("");

  mealModal.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeMealModal() {
  mealModal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedCard) lastFocusedCard.focus();
}

productGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".meal-card");
  if (!card) return;
  const product = PRODUCTS.find((p) => p.id === Number(card.dataset.id));
  if (product) openMealModal(product, card);
});

productGrid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".meal-card");
  if (!card) return;
  e.preventDefault();
  const product = PRODUCTS.find((p) => p.id === Number(card.dataset.id));
  if (product) openMealModal(product, card);
});

modalClose.addEventListener("click", closeMealModal);
mealModal.addEventListener("click", (e) => {
  if (e.target === mealModal) closeMealModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mealModal.hidden) closeMealModal();
});

renderProducts();

/* ============================================================
   7. Meal Finder
   ============================================================ */
const finderForm = $("#finderForm");
const finderResult = $("#finderResult");

finderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const goal = $("#finderGoal").value;
  const cuisine = $("#finderCuisine").value;

  if (!goal || !cuisine) {
    finderResult.hidden = false;
    finderResult.innerHTML = `<p class="fr-note">Please pick both a goal and a cuisine to get a suggestion. 🙂</p>`;
    return;
  }

  let candidates = PRODUCTS.filter(
    (p) => p.goals.includes(goal) && (cuisine === "any" || p.cuisine === cuisine)
  );
  if (candidates.length === 0) {
    candidates = PRODUCTS.filter((p) => p.goals.includes(goal));
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];

  finderResult.hidden = false;
  finderResult.innerHTML = `
    <span class="fr-emoji" aria-hidden="true">${pick.emoji}</span>
    <div>
      <h3>${pick.name}</h3>
      <p>${pick.desc}</p>
    </div>
    <span class="fr-tag">${CUISINE_LABELS[pick.cuisine]}</span>
    <p class="fr-note">🔥 ${pick.kcal} kcal · 💪 ${pick.protein}g protein · ⏱️ ${pick.prep} min ·
      ${CUISINE_LABELS[pick.cuisine]} cuisine · perfect for “${GOAL_LABELS[goal]}”</p>`;
  finderResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

/* ============================================================
   8. Store search
   ============================================================ */
const storeSearch = $("#storeSearch");
const storeItems = $$("#storeList li");
const storeEmpty = $("#storeEmpty");

storeSearch.addEventListener("input", () => {
  const query = storeSearch.value.trim().toLowerCase();
  let visible = 0;
  storeItems.forEach((li) => {
    const match = li.dataset.store.includes(query) || li.textContent.toLowerCase().includes(query);
    li.hidden = !match;
    if (match) visible++;
  });
  storeEmpty.hidden = visible !== 0;
});

/* ============================================================
   9. Testimonial slider
   ============================================================ */
const track = $("#sliderTrack");
const slides = $$(".slide", track);
const dotsWrap = $("#sliderDots");
let current = 0;
let autoTimer;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to review ${i + 1}`);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dots = $$("button", dotsWrap);

function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
  restartAuto();
}
function restartAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 6000);
}

$("#prevSlide").addEventListener("click", () => goTo(current - 1));
$("#nextSlide").addEventListener("click", () => goTo(current + 1));
restartAuto();

/* ============================================================
   10. Newsletter validation
   ============================================================ */
const newsletterForm = $("#newsletterForm");
const emailInput = $("#emailInput");
const formMsg = $("#formMsg");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = emailInput.value.trim();

  if (!value) return showError("Please enter your email address.");
  if (!EMAIL_RE.test(value)) return showError("That doesn't look like a valid email. Try again!");

  emailInput.classList.remove("error");
  formMsg.classList.remove("error");
  formMsg.textContent = `🎉 You're in! Welcome to Flexity, ${value}.`;
  newsletterForm.reset();
});

function showError(message) {
  emailInput.classList.add("error");
  formMsg.classList.add("error");
  formMsg.textContent = message;
  emailInput.focus();
}
emailInput.addEventListener("input", () => {
  emailInput.classList.remove("error");
  if (formMsg.classList.contains("error")) formMsg.textContent = "";
});

/* ============================================================
   11. Footer year
   ============================================================ */
$("#year").textContent = new Date().getFullYear();
