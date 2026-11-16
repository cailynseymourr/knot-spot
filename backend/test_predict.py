from app import app

client = app.test_client()

response = client.post(
    "/predict-time",
    json={
        "totalRows": 70,
        "today": "2026-11-15",
        "logs": [
            {"date": "2026-11-10", "rowsDone": 8},
            {"date": "2026-11-12", "rowsDone": 10},
            {"date": "2026-11-14", "rowsDone": 12},
        ],
    },
)
print(response.get_json())

# Edge cases
print(client.post("/predict-time", json={"totalRows": 70, "logs": []}).get_json())
print(client.post("/predict-time", json={"logs": []}).get_json())