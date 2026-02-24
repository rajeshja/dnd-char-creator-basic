const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const roundKey = (value) => Math.round(value * 10) / 10;

const defaultPc = () => ({
  name: "PC",
  hp: 32,
  ac: 16,
  attackBonus: 6,
  attacks: 1,
  damage: "1d8+4",
  mode: "normal"
});

const defaultMonster = () => ({
  name: "Monster",
  hp: 120,
  ac: 17,
  attackBonus: 7,
  attacks: 2,
  damage: "2d8+4",
  legendaryActions: 0,
  legendaryDamage: "1d8+4",
  mode: "normal"
});

let partyActors = [defaultPc(), defaultPc(), defaultPc(), defaultPc()];
partyActors = partyActors.map((pc, i) => ({ ...pc, name: `PC ${i + 1}` }));
let monsterActors = [{ ...defaultMonster(), name: "Boss Monster", legendaryActions: 1, hp: 135, ac: 18, attackBonus: 8 }];

const parseDamageExpression = (expression) => {
  const clean = String(expression).trim().toLowerCase();
  if (/^\d+$/.test(clean)) {
    return { diceCount: 0, sides: 0, modifier: Number(clean) };
  }
  const match = clean.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) throw new Error(`Invalid damage expression: ${expression}`);
  return { diceCount: Number(match[1]), sides: Number(match[2]), modifier: Number(match[3] ?? 0) };
};

const normalizeDistribution = (dist) => {
  const total = [...dist.values()].reduce((sum, p) => sum + p, 0);
  if (total <= 0) return new Map([[0, 1]]);
  const out = new Map();
  dist.forEach((p, d) => {
    if (p > 0) out.set(Number(d), p / total);
  });
  return out;
};

const convolve = (a, b) => {
  const out = new Map();
  a.forEach((pA, dA) => {
    b.forEach((pB, dB) => {
      const key = roundKey(Number(dA) + Number(dB));
      out.set(key, (out.get(key) ?? 0) + pA * pB);
    });
  });
  return normalizeDistribution(out);
};

const cappedDistribution = (dist, maxEntries = 300) => {
  if (dist.size <= maxEntries) return dist;
  const entries = [...dist.entries()].sort((a, b) => a[0] - b[0]);
  const min = entries[0][0];
  const max = entries[entries.length - 1][0];
  const binWidth = Math.max(1, (max - min) / maxEntries);
  const binned = new Map();
  entries.forEach(([damage, prob]) => {
    const bin = min + Math.floor((damage - min) / binWidth) * binWidth;
    const key = roundKey(bin);
    binned.set(key, (binned.get(key) ?? 0) + prob);
  });
  return normalizeDistribution(binned);
};

const singleDieDistribution = (sides) => {
  const out = new Map();
  for (let i = 1; i <= sides; i += 1) out.set(i, 1 / sides);
  return out;
};

const buildDamageDistribution = (expression, crit = false) => {
  const parsed = parseDamageExpression(expression);
  const diceCount = crit ? parsed.diceCount * 2 : parsed.diceCount;
  let dist = new Map([[0, 1]]);
  for (let i = 0; i < diceCount; i += 1) dist = convolve(dist, singleDieDistribution(parsed.sides));
  const shifted = new Map();
  dist.forEach((p, d) => shifted.set(Math.max(0, d + parsed.modifier), p));
  return normalizeDistribution(shifted);
};

const repeatConvolve = (dist, times) => {
  let result = new Map([[0, 1]]);
  for (let i = 0; i < times; i += 1) result = cappedDistribution(convolve(result, dist));
  return result;
};

const getHitRates = (attackBonus, targetAC, mode = "normal", baseCrit = 0.05) => {
  const baseHit = clamp((21 + attackBonus - targetAC) / 20, 0.05, 0.95);
  const hit = mode === "advantage" ? 1 - (1 - baseHit) ** 2 : mode === "disadvantage" ? baseHit ** 2 : baseHit;
  const crit = mode === "advantage" ? 1 - (1 - baseCrit) ** 2 : mode === "disadvantage" ? baseCrit ** 2 : baseCrit;
  return { hit: clamp(hit, 0.05, 0.9975), crit: clamp(crit, 0.0025, 0.5) };
};

const buildAttackDistribution = ({ attackBonus, targetAC, damageExpr, mode }) => {
  const { hit, crit } = getHitRates(attackBonus, targetAC, mode);
  const critRate = Math.min(hit, crit);
  const normalRate = Math.max(0, hit - critRate);
  const missRate = Math.max(0, 1 - normalRate - critRate);
  const out = new Map([[0, missRate]]);

  buildDamageDistribution(damageExpr, false).forEach((p, d) => out.set(d, (out.get(d) ?? 0) + p * normalRate));
  buildDamageDistribution(damageExpr, true).forEach((p, d) => out.set(d, (out.get(d) ?? 0) + p * critRate));

  return cappedDistribution(normalizeDistribution(out));
};

const scaleDistribution = (dist, scalar) => {
  const scaled = new Map();
  dist.forEach((p, d) => {
    const key = roundKey(Math.max(0, d * scalar));
    scaled.set(key, (scaled.get(key) ?? 0) + p);
  });
  return normalizeDistribution(scaled);
};

const updateHpPmf = (hpPmf, damageDist, capHp) => {
  const next = new Map();
  hpPmf.forEach((hpProb, hp) => {
    damageDist.forEach((dProb, damage) => {
      const remaining = clamp(roundKey(hp - damage), 0, capHp);
      next.set(remaining, (next.get(remaining) ?? 0) + hpProb * dProb);
    });
  });
  return cappedDistribution(normalizeDistribution(next), 320);
};

const probabilityZeroHp = (pmf) => pmf.get(0) ?? 0;
const probabilityAlive = (pmf) => 1 - probabilityZeroHp(pmf);

const distributionStats = (dist) => {
  let mean = 0;
  dist.forEach((p, d) => {
    mean += d * p;
  });
  let variance = 0;
  dist.forEach((p, d) => {
    variance += ((d - mean) ** 2) * p;
  });
  return { mean, variance };
};

const calcDifficultyBand = (partyWinChance) => {
  if (partyWinChance >= 0.8) return "Easy";
  if (partyWinChance >= 0.62) return "Medium";
  if (partyWinChance >= 0.45) return "Hard";
  return "Deadly";
};

const actorCard = (actor, type, index) => {
  const isMonster = type === "monster";
  return `
    <article class="actor-card" data-type="${type}" data-index="${index}">
      <div class="actor-card-header">
        <h4>${isMonster ? "Monster" : "PC"} ${index + 1}</h4>
        <button class="ghost-button remove-actor" type="button" ${type === "party" && partyActors.length <= 1 ? "disabled" : ""} ${type === "monster" && monsterActors.length <= 1 ? "disabled" : ""}>Remove</button>
      </div>
      <div class="form-grid">
        <label>Name<input data-field="name" value="${actor.name}" /></label>
        <label>HP<input data-field="hp" type="number" min="1" value="${actor.hp}" /></label>
        <label>AC<input data-field="ac" type="number" min="1" value="${actor.ac}" /></label>
        <label>Attack bonus<input data-field="attackBonus" type="number" value="${actor.attackBonus}" /></label>
        <label>Attacks/round<input data-field="attacks" type="number" min="1" value="${actor.attacks}" /></label>
        <label>Damage<input data-field="damage" value="${actor.damage}" /></label>
        <label>Attack mode
          <select data-field="mode">
            <option value="normal" ${actor.mode === "normal" ? "selected" : ""}>Normal</option>
            <option value="advantage" ${actor.mode === "advantage" ? "selected" : ""}>Advantage</option>
            <option value="disadvantage" ${actor.mode === "disadvantage" ? "selected" : ""}>Disadvantage</option>
          </select>
        </label>
        ${isMonster ? `<label>Legendary actions<input data-field="legendaryActions" type="number" min="0" value="${actor.legendaryActions}" /></label>
        <label>Legendary damage<input data-field="legendaryDamage" value="${actor.legendaryDamage}" /></label>` : ""}
      </div>
    </article>
  `;
};

const syncActorInputs = () => {
  document.querySelectorAll(".actor-card").forEach((card) => {
    const type = card.dataset.type;
    const idx = Number(card.dataset.index);
    const source = type === "party" ? partyActors : monsterActors;

    card.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        if (!field) return;
        const value = input.type === "number" ? Number(input.value) : input.value;
        source[idx][field] = value;
      });
    });

    card.querySelector(".remove-actor")?.addEventListener("click", () => {
      if (type === "party" && partyActors.length > 1) partyActors.splice(idx, 1);
      if (type === "monster" && monsterActors.length > 1) monsterActors.splice(idx, 1);
      renderActors();
    });
  });
};

const renderActors = () => {
  const partyList = document.getElementById("party-list");
  const monsterList = document.getElementById("monster-list");
  partyList.innerHTML = partyActors.map((actor, i) => actorCard(actor, "party", i)).join("");
  monsterList.innerHTML = monsterActors.map((actor, i) => actorCard(actor, "monster", i)).join("");
  syncActorInputs();
};

const renderDistChart = (containerId, dist) => {
  const el = document.getElementById(containerId);
  const sorted = [...dist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxProb = sorted[0]?.[1] ?? 1;
  el.innerHTML = "";
  sorted.forEach(([damage, prob]) => {
    const label = document.createElement("div");
    label.className = "chart-label";
    label.innerHTML = `<span>${damage.toFixed(1)} dmg</span><span>${(prob * 100).toFixed(1)}%</span>`;
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.width = `${(prob / maxProb) * 100}%`;
    el.appendChild(label);
    el.appendChild(bar);
  });
};

const aggregatePartyDistribution = (targetAc) => {
  let total = new Map([[0, 1]]);
  partyActors.forEach((pc) => {
    const attack = buildAttackDistribution({ attackBonus: pc.attackBonus, targetAC: targetAc, damageExpr: pc.damage, mode: pc.mode });
    total = convolve(total, repeatConvolve(attack, Math.max(1, pc.attacks)));
    total = cappedDistribution(total);
  });
  return total;
};

const aggregateMonsterDistribution = (targetAc) => {
  let total = new Map([[0, 1]]);
  monsterActors.forEach((m) => {
    const base = repeatConvolve(
      buildAttackDistribution({ attackBonus: m.attackBonus, targetAC: targetAc, damageExpr: m.damage, mode: m.mode }),
      Math.max(1, m.attacks)
    );
    const legendary = Number(m.legendaryActions) > 0
      ? repeatConvolve(
          buildAttackDistribution({ attackBonus: m.attackBonus, targetAC: targetAc, damageExpr: m.legendaryDamage, mode: m.mode }),
          Number(m.legendaryActions)
        )
      : new Map([[0, 1]]);
    total = convolve(total, convolve(base, legendary));
    total = cappedDistribution(total);
  });
  return total;
};

const calculateEncounter = () => {
  const avgMonsterAc = monsterActors.reduce((sum, m) => sum + Number(m.ac), 0) / monsterActors.length;
  const avgPartyAc = partyActors.reduce((sum, p) => sum + Number(p.ac), 0) / partyActors.length;

  const focusFire = document.getElementById("focus-fire").checked;
  const frontlinerBias = document.getElementById("frontliner-bias").checked;
  const lairDamage = document.getElementById("lair-damage").value;
  const lairFrequency = Math.max(0, Number(document.getElementById("lair-frequency").value));
  const lairControl = clamp(Number(document.getElementById("lair-control").value), 0.4, 1.2);

  const partyRoundDist = scaleDistribution(aggregatePartyDistribution(avgMonsterAc), (focusFire ? 1 : 0.85) * lairControl);
  const monsterBaseDist = aggregateMonsterDistribution(avgPartyAc);
  const lairDist = scaleDistribution(buildDamageDistribution(lairDamage, false), lairFrequency);
  const monsterRoundDist = scaleDistribution(convolve(monsterBaseDist, lairDist), frontlinerBias ? 1.15 : 1);

  const totalPartyHp = partyActors.reduce((sum, p) => sum + Number(p.hp), 0);
  const totalMonsterHp = monsterActors.reduce((sum, m) => sum + Number(m.hp), 0);

  let partyHpPmf = new Map([[totalPartyHp, 1]]);
  let monsterHpPmf = new Map([[totalMonsterHp, 1]]);

  const maxRounds = 20;
  let unresolvedProb = 1;
  let partyWinProb = 0;
  let monsterWinProb = 0;
  let mutualWipeProb = 0;
  let expectedRounds = 0;

  for (let round = 1; round <= maxRounds; round += 1) {
    const incomingToMonster = scaleDistribution(partyRoundDist, probabilityAlive(partyHpPmf));
    const incomingToParty = scaleDistribution(monsterRoundDist, probabilityAlive(monsterHpPmf));

    monsterHpPmf = updateHpPmf(monsterHpPmf, incomingToMonster, totalMonsterHp);
    partyHpPmf = updateHpPmf(partyHpPmf, incomingToParty, totalPartyHp);

    const pMonDead = probabilityZeroHp(monsterHpPmf);
    const pPartyDead = probabilityZeroHp(partyHpPmf);
    const cumulativePartyWin = pMonDead * (1 - pPartyDead);
    const cumulativeMonsterWin = pPartyDead * (1 - pMonDead);
    const cumulativeMutual = pPartyDead * pMonDead;
    const cumulativeResolved = cumulativePartyWin + cumulativeMonsterWin + cumulativeMutual;

    const resolvedThisRound = Math.max(0, cumulativeResolved - (1 - unresolvedProb));
    expectedRounds += round * resolvedThisRound;
    unresolvedProb = Math.max(0, 1 - cumulativeResolved);

    partyWinProb = cumulativePartyWin;
    monsterWinProb = cumulativeMonsterWin;
    mutualWipeProb = cumulativeMutual;
  }

  expectedRounds += maxRounds * unresolvedProb;

  const partyStats = distributionStats(partyRoundDist);
  const monsterStats = distributionStats(monsterRoundDist);
  const swinginess = Math.sqrt((partyStats.variance + monsterStats.variance) / 2);

  const metrics = [
    ["Party win chance", `${(partyWinProb * 100).toFixed(1)}%`],
    ["Monster win chance", `${(monsterWinProb * 100).toFixed(1)}%`],
    ["Mutual wipe", `${(mutualWipeProb * 100).toFixed(2)}%`],
    ["Expected rounds", expectedRounds.toFixed(2)],
    ["Difficulty", calcDifficultyBand(partyWinProb)],
    ["Swinginess", `${swinginess.toFixed(2)} dmg σ`],
    ["Party EDPR", partyStats.mean.toFixed(2)],
    ["Monster EDPR", monsterStats.mean.toFixed(2)]
  ];

  const metricsEl = document.getElementById("encounter-metrics");
  metricsEl.innerHTML = "";
  metrics.forEach(([label, value]) => {
    const item = document.createElement("li");
    item.className = "summary-item";
    item.innerHTML = `<strong>${label}</strong><span>${value}</span>`;
    metricsEl.appendChild(item);
  });

  document.getElementById("encounter-summary").textContent = `Estimated ${calcDifficultyBand(partyWinProb)} encounter: party win chance ${(partyWinProb * 100).toFixed(1)}%, monster win chance ${(monsterWinProb * 100).toFixed(1)}%.`;
  document.getElementById("encounter-result").hidden = false;

  renderDistChart("party-chart", partyRoundDist);
  renderDistChart("monster-chart", monsterRoundDist);

  document.getElementById("rules-note").innerHTML = `
    <strong>Model assumptions:</strong> P(hit) = clamp((21 + attackBonus - targetAC) / 20) with natural 1/20 bounds, critical hits default to 5% (adjusted for advantage/disadvantage), damage distributions are convolved per attack and per round, lair and legendary effects are folded into monster round damage, and HP is tracked as probability mass across rounds.<br>
    <strong>Important:</strong> This is a statistical estimate, not a tactical simulator. Initiative order, spell choice, battlefield control, and player decisions can materially change outcomes.
  `;
};

const saveEncounter = () => {
  const payload = {
    partyActors,
    monsterActors,
    lairDamage: document.getElementById("lair-damage").value,
    lairFrequency: document.getElementById("lair-frequency").value,
    lairControl: document.getElementById("lair-control").value,
    focusFire: document.getElementById("focus-fire").checked,
    frontlinerBias: document.getElementById("frontliner-bias").checked
  };
  localStorage.setItem("encounter-calc-v2", JSON.stringify(payload));
};

const loadEncounter = () => {
  const raw = localStorage.getItem("encounter-calc-v2");
  if (!raw) return;
  const data = JSON.parse(raw);
  partyActors = data.partyActors?.length ? data.partyActors : [defaultPc()];
  monsterActors = data.monsterActors?.length ? data.monsterActors : [defaultMonster()];
  document.getElementById("lair-damage").value = data.lairDamage ?? "0";
  document.getElementById("lair-frequency").value = data.lairFrequency ?? "1";
  document.getElementById("lair-control").value = data.lairControl ?? "0.9";
  document.getElementById("focus-fire").checked = Boolean(data.focusFire);
  document.getElementById("frontliner-bias").checked = Boolean(data.frontlinerBias);
  renderActors();
};

document.getElementById("add-party-member").addEventListener("click", () => {
  partyActors.push({ ...defaultPc(), name: `PC ${partyActors.length + 1}` });
  renderActors();
});

document.getElementById("add-monster").addEventListener("click", () => {
  monsterActors.push({ ...defaultMonster(), name: `Monster ${monsterActors.length + 1}` });
  renderActors();
});

document.getElementById("calculate-encounter").addEventListener("click", () => {
  try {
    calculateEncounter();
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("save-encounter").addEventListener("click", saveEncounter);
document.getElementById("load-encounter").addEventListener("click", loadEncounter);

renderActors();
