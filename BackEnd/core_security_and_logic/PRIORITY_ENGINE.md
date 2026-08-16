# Priority Engine

How ResQGrid decides which SOS request gets helped first.

> **It is a keyword scoring table, not machine learning.** The project brief calls it the
> "AI Priority Engine", so be precise if asked: it is a deterministic, rule-based scorer.
> That is a defensible design choice — it is fast, needs no training data, and every score
> can be explained to the person it affects — but it is not a model.

---

## How a request gets its score

1. **The victim submits the form.** The fields are joined into one description string:

   ```
   Emergency: Earthquake
   People needing help: 3
   Reported location: MG Road
   My child is trapped under a wall and bleeding
   ```

2. **The backend scores it once, at creation** — `routers/sos.py` calls
   `calculate_priority(payload.description)` and stores the result in `priority_score`.

3. **The score never changes afterwards.** Editing nothing re-runs it; a request scored
   before a rule was added keeps its old score.

4. **The frontend turns the score into a tier** for the coloured badge
   (`FrontEnd/src/utils/sos.js` → `scoreToPriorityTier`, mirroring `priority_category` here).

The scorer lowercases the description and adds the points of **every** keyword it finds
anywhere in the text. The total is capped at 100.

---

## Points per keyword

| Points | Keywords |
|-------:|----------|
| **40** | `trapped`, `critical`, `unconscious`, `earthquake`, `landslide`, `collapse`, `tsunami` |
| **35** | `bleeding`, `gas leak` |
| **30** | `medical`, `injured`, `drowning`, `fire`, `flood`, `cyclone` |
| **25** | `stranded`, `pregnant`, `child` |
| **20** | `elderly` |
| **10** | `food`, `water`, `shelter` |

## Score to tier

| Score | Tier |
|------:|------|
| 70–100 | `CRITICAL` |
| 40–69 | `HIGH` |
| 20–39 | `MEDIUM` |
| 0–19 | `LOW` |
| `null` | `PENDING` — created before scoring existed, never scored |

---

## Worked example

For the description at the top of this file:

| Matched keyword | Points | Running total |
|-----------------|-------:|--------------:|
| `trapped`       | +40 | 40 |
| `bleeding`      | +35 | 75 |
| `child`         | +25 | 100 *(capped)* |
| `earthquake`    | +40 | 100 |

**Final score: 100 → `CRITICAL`**

---

## Three things that catch people out

- **Points stack.** A single keyword rarely reaches `CRITICAL` — `trapped` alone is 40, which
  is only `HIGH`. It takes roughly two serious keywords to clear 70. This is deliberate: one
  alarming word shouldn't outrank a genuinely compound emergency.
- **The whole description is scanned, including the victim's free-text notes.** What someone
  types matters as much as the dropdown they pick.
- **Matching is substring-based, not word-based.** `children` matches `child` for 25;
  `floodwater` matches both `flood` and `water` for 40. Convenient, but it also means a rule
  like `ice` would match `police` — keep any new keyword distinctive enough not to appear
  inside an unrelated word.

### What each dropdown option scores on its own

| Emergency type | Score | Tier |
|----------------|------:|------|
| Earthquake     | 40 | `HIGH` |
| Medical        | 30 | `MEDIUM` |
| Fire           | 30 | `MEDIUM` |
| Flood          | 30 | `MEDIUM` |
| Food & Water   | 20 | `MEDIUM` |
| Shelter Needed | 10 | `LOW` |

---

## Where the score is used

- **`GET /sos/` returns requests ordered by score, highest first**, with unscored ones last
  (`routers/sos.py`). The admin table is therefore already triaged top to bottom — no
  client-side sorting involved.
- It drives the priority badge and the "Critical Cases" counter on the admin dashboard.
- The volunteer dashboard re-sorts the pending list by distance once it knows the
  volunteer's own position, so ordering there is proximity, not priority.

---

## A note on the two copies of this engine

`priority_engine.py` exists twice:

- `BackEnd/core_security_and_logic/priority_engine.py` — **the one the API actually imports**,
  because the server runs with `BackEnd/` as its working directory.
- `core_security_and_logic/priority_engine.py` at the repository root.

Keep them in step when editing rules, and remember that only the `BackEnd/` copy changes
behaviour at runtime.
