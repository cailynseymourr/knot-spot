from app import app

client = app.test_client()

pattern = {"yarnWeight": "4", "yardageNeeded": 900, "yarnUsed": "Red Heart Super Saver"}
yarns = [
    {"id": "1", "name": "Red Heart Super Saver", "brand": "Red Heart", "weight": "4", "yards": 364},
    {"id": "2", "name": "Simply Soft", "brand": "Caron", "weight": "4", "yards": 1000},
    {"id": "3", "name": "Cotton Fine", "brand": "Lion Brand", "weight": "3", "yards": 1200},
    {"id": "4", "name": "Lace Silk", "brand": "Misc", "weight": "0", "yards": 2000},
]

result = client.post("/recommend-yarn", json={"pattern": pattern, "yarns": yarns}).get_json()
print(result["status"], "-", result["message"])
for rec in result["recommendations"]:
    print(f"  {rec['score']:>3}  {rec['name']}  ({rec['fit']})")
    for line in rec["reasons"]:
        print("       +", line)
    for line in rec["warnings"]:
        print("       !", line)

# Edge cases
print(client.post("/recommend-yarn", json={"pattern": {}, "yarns": yarns}).get_json()["status"])
print(client.post("/recommend-yarn", json={"pattern": pattern, "yarns": []}).get_json()["status"])