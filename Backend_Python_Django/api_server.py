"""
========================================================
AMS SYSTEM - PYTHON FLASK / FASTAPI BACKEND API
========================================================
Run command: python api_server.py
"""

from flask import Flask, request, jsonify, send_file
import time
import io

app = Flask(__name__)

TOTAL_RECORDS = 500000
db_records = []

print(f"⚡ Initializing Python AMS System Index Engine ({TOTAL_RECORDS:,} records)...")
start_time = time.time()

for i in range(TOTAL_RECORDS):
    num = f"{i + 1:06d}"
    phone_tail = str(1000 + (i % 9000))
    phone = f"98765{phone_tail}"
    pass_code = f"VP-2026-{phone_tail}"
    
    statuses = ['Approved', 'Pending', 'In Premise', 'Visited', 'Rejected']
    status = statuses[i % len(statuses)]
    
    hosts = ['Dhaval Sir', 'Mahesh Sir', 'Jaydeep Sir', 'Smit', 'Aashis']
    host_name = hosts[i % len(hosts)]
    
    db_records.append({
        "id": f"VIS-{num}",
        "passCode": pass_code,
        "fullName": f"Visitor {num}",
        "phone": phone,
        "email": f"visitor{num}@example.com",
        "purpose": "Guest" if i % 2 == 0 else "Vendor",
        "company": "Tech Innovations" if i % 3 == 0 else "Enterprise HQ",
        "hostName": host_name,
        "department": "IT" if i % 2 == 0 else "Medical",
        "inTime": "10:00 AM",
        "outTime": "05:00 PM",
        "status": status,
        "actionTakenBy": "Aashis (Employee)" if status == 'Approved' else None
    })

print(f"✅ Indexed {TOTAL_RECORDS:,} records in {time.time() - start_time:.2f} seconds.")

@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    search = request.args.get('search', '').lower().strip()
    status = request.args.get('status', 'All')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 25))

    req_start = time.time()
    results = db_records

    if status != 'All':
        results = [r for r in results if r['status'] == status]

    if search:
        results = [
            r for r in results
            if search in r['fullName'].lower()
            or search in r['phone']
            or search in r['passCode'].lower()
            or search in r['company'].lower()
            or search in r['hostName'].lower()
        ]

    total_count = len(results)
    start_idx = (page - 1) * limit
    paginated = results[start_idx:start_idx + limit]

    query_time_ms = int((time.time() - req_start) * 1000)

    return jsonify({
        "totalRecords": TOTAL_RECORDS,
        "filteredCount": total_count,
        "totalPages": (total_count + limit - 1) // limit,
        "currentPage": page,
        "limit": limit,
        "queryTimeMs": query_time_ms,
        "visitors": paginated
    })

if __name__ == '__main__':
    print("🚀 Python AMS System API running at http://localhost:5000")
    app.run(port=5000, debug=True)
