WEIGHT_NAMES = {
    0: "Lace (0)",
    1: "Super Fine (1)",
    2: "Fine (2)",
    3: "Light (3)",
    4: "Medium / Worsted (4)",
    5: "Bulky (5)",
    6: "Super Bulky (6)",
    7: "Jumbo (7)",
}


def to_weight(value):
    """Turns '4' (or 4) into the number 4. Returns None if it isn't a valid weight."""
    try:
        weight = int(float(value))
    except (TypeError, ValueError):
        return None
    return weight if weight in WEIGHT_NAMES else None


def to_number(value):
    """Turns anything into a non-negative number (bad values become 0)."""
    try:
        return max(float(value), 0.0)
    except (TypeError, ValueError):
        return 0.0


def normalize(text):
    return str(text or "").strip().lower()


def matches_called_for(yarn, called_for):
    """True if the yarn's name matches the yarn the pattern says to use."""
    name = normalize(yarn.get("name"))
    if not name or not called_for:
        return False
    return name in called_for or called_for in name


def score_yarn(yarn, wanted_weight, needed_yards, called_for):
    """Scores one yarn out of 100. Returns None if its weight can't work."""
    weight = to_weight(yarn.get("weight"))
    if weight is None:
        return None

    gap = abs(weight - wanted_weight)
    if gap > 1:
        return None  # too far from the weight the pattern needs

    yards = to_number(yarn.get("yards"))
    reasons = []
    warnings = []
    score = 0

    # Weight (up to 50)
    if gap == 0:
        score += 50
        reasons.append(f"Right yarn weight ({WEIGHT_NAMES[weight]})")
    else:
        score += 20
        warnings.append(
            f"One weight off ({WEIGHT_NAMES[weight]}). Swatch first to check gauge"
        )

    # Yardage (up to 40)
    if needed_yards > 0:
        if yards >= needed_yards:
            ratio = yards / needed_yards
            score += 30 + (10 if ratio <= 2 else 5 if ratio <= 4 else 0)
            reasons.append(
                f"Enough yardage ({round(yards)} yd, need {round(needed_yards)})"
            )
        else:
            score += round(30 * yards / needed_yards)
            warnings.append(
                f"Short by {round(needed_yards - yards)} yd "
                f"(you have {round(yards)}, need {round(needed_yards)})"
            )
    else:
        score += 20  # yardage unknown, so give a neutral score

    # Matches the yarn the pattern calls for (10)
    if matches_called_for(yarn, called_for):
        score += 10
        reasons.append("Matches the yarn the pattern calls for")

    score = min(score, 100)
    fit = "Great match" if score >= 85 else "Good match" if score >= 60 else "Possible match"

    return {
        "id": yarn.get("id"),
        "name": yarn.get("name") or "Unnamed yarn",
        "brand": yarn.get("brand") or "",
        "color": yarn.get("color") or "",
        "weight": str(weight),
        "weightLabel": WEIGHT_NAMES[weight],
        "yards": round(yards),
        "score": score,
        "fit": fit,
        "reasons": reasons,
        "warnings": warnings,
    }


def recommend_yarn(pattern, yarns):
    """Ranks the user's stash for one pattern."""
    pattern = pattern if isinstance(pattern, dict) else {}
    yarns = [y for y in yarns if isinstance(y, dict)] if isinstance(yarns, list) else []

    wanted_weight = to_weight(pattern.get("yarnWeight"))
    needed_yards = to_number(pattern.get("yardageNeeded"))
    called_for = normalize(pattern.get("yarnUsed"))

    if wanted_weight is None:
        return {
            "status": "needs_pattern_info",
            "message": "Set a yarn weight for this pattern (Edit Pattern, then Yarn Weight Needed) to get a recommendation.",
        }
    if not yarns:
        return {
            "status": "empty_stash",
            "message": "Your yarn stash is empty. Add some yarn to get a recommendation.",
        }

    scored = [
        s for s in (score_yarn(y, wanted_weight, needed_yards, called_for) for y in yarns)
        if s is not None
    ]
    if not scored:
        return {
            "status": "no_match",
            "message": f"None of your yarn is {WEIGHT_NAMES[wanted_weight]} or one weight away from it.",
        }

    scored.sort(key=lambda s: (-s["score"], -s["yards"], s["name"]))

    notes = []
    if needed_yards <= 0:
        notes.append("This pattern has no yardage set, so yardage wasn't checked.")

    return {
        "status": "ok",
        "patternWeight": WEIGHT_NAMES[wanted_weight],
        "yardageNeeded": round(needed_yards),
        "recommendations": scored[:3],
        "notes": notes,
        "message": f"Best match from your stash: {scored[0]['name']}",
    }