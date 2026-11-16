import math
from datetime import date, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
from recommender import recommend_yarn

app = Flask(__name__)
CORS(app)  # lets the React app on localhost:3000 call this server


def parse_date(value):
    """Turns '2026-11-15' into a date, or None if it isn't valid."""
    try:
        return date.fromisoformat(str(value)[:10])
    except ValueError:
        return None


def to_number(value):
    """Turns anything into a non-negative number (bad values become 0)."""
    try:
        return max(float(value), 0.0)
    except (TypeError, ValueError):
        return 0.0


def predict_time(total_rows, logs, today):
    """Estimates when a project will be finished from its progress logs."""
    # Add up the rows done on each date
    per_day = {}
    for log in logs:
        if not isinstance(log, dict):
            continue
        day = parse_date(log.get("date"))
        if day is None:
            continue
        per_day[day] = per_day.get(day, 0) + to_number(log.get("rowsDone"))

    rows_done = sum(per_day.values())

    if total_rows <= 0:
        return {
            "status": "needs_total_rows",
            "message": "This pattern needs a total row count before it can be predicted.",
        }
    if rows_done <= 0:
        return {
            "status": "no_progress",
            "message": "Log some progress to get a time estimate.",
        }
    if rows_done >= total_rows:
        return {
            "status": "complete",
            "message": "All rows are done. Nice work!",
        }

    # Build cumulative points: x = days since the first log, y = rows done so far
    first_day = min(per_day)
    points = []
    running = 0.0
    for day in sorted(per_day):
        running += per_day[day]
        points.append(((day - first_day).days, running))

    # If you haven't logged since, add today so a slowdown lowers the pace
    if today > max(per_day):
        points.append(((today - first_day).days, running))

    # Default: average pace since the first log
    elapsed_days = max((today - first_day).days + 1, 1)
    rows_per_day = rows_done / elapsed_days
    method = "average_pace"

    # With 3+ points, fit a line (rows vs days) and use its slope as the pace
    if len(points) >= 3:
        x_values = [[x] for x, _ in points]
        y_values = [y for _, y in points]
        model = LinearRegression().fit(x_values, y_values)
        slope = float(model.coef_[0])
        if slope > 0:
            rows_per_day = slope
            method = "linear_regression"

    remaining = total_rows - rows_done
    days_left = math.ceil(remaining / rows_per_day)
    finish_date = today + timedelta(days=days_left)

    days_logged = len(per_day)
    if days_logged < 2:
        confidence = "low"
    elif days_logged < 4:
        confidence = "medium"
    else:
        confidence = "high"

    return {
        "status": "ok",
        "rowsDone": rows_done,
        "totalRows": total_rows,
        "remainingRows": remaining,
        "rowsPerDay": round(rows_per_day, 2),
        "daysLeft": days_left,
        "estimatedCompletion": finish_date.isoformat(),
        "method": method,
        "confidence": confidence,
        "message": f"About {days_left} day(s) left at roughly {rows_per_day:.1f} rows per day.",
    }


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/predict-time")
def predict_time_route():
    data = request.get_json(silent=True) or {}
    total_rows = int(to_number(data.get("totalRows")))
    logs = data.get("logs")
    if not isinstance(logs, list):
        logs = []
    today = parse_date(data.get("today")) or date.today()  # "today" is optional, for testing
    return jsonify(predict_time(total_rows, logs, today))

@app.post("/recommend-yarn")
def recommend_yarn_route():
    data = request.get_json(silent=True) or {}
    return jsonify(recommend_yarn(data.get("pattern"), data.get("yarns")))

if __name__ == "__main__":
    app.run(debug=True, port=5000)