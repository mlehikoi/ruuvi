from datetime import timedelta
from dateutil.parser import isoparse
from dateutil.tz import UTC
from db.models import init_db
from db.util import get_readings, insert_reading
from flask import Flask, jsonify, request, redirect
import json


app = Flask(__name__)
app.config['DEBUG'] = True
init_db(app)


@app.route('/')
def get_main_page():
    return redirect('/static/index.html')


@app.route('/api/v1/ruuvi', methods=['POST'])
def log_measurement():
    try:
        if len(request.json['tags']) == 0:
            return('OK')

        insert_reading(
            mac=request.json['tags'][0]['id'],
            name=request.json['tags'][0]['name'],
            updated_at=isoparse(request.json['time']).astimezone(UTC),
            temperature=request.json['tags'][0]['temperature'],
            humidity=request.json['tags'][0]['humidity'],
            pressure=request.json['tags'][0]['pressure'] / 100.0,
            battery_level=request.json['batteryLevel'],
            commit=True)
    except:
        print(json.dumps(request.json))
    return jsonify('Inserted')


@app.route('/api/v1/ruuvi', methods=['GET'])
def fetch_readings():
    name = request.args.get('name')
    begin = None
    end = None
    try:
        begin = isoparse(request.args.get('begin'))
        end = isoparse(request.args.get('end'))
    except:
        pass

    readings = get_readings(name=name, begin=begin, end=end)
    if len(readings) <= 1:
        return 'Too small range', 404

    begin = readings[-1].updated_at
    end = readings[0].updated_at
    print(begin, end, len(readings))
    response = []
    time_span = end - begin
    min_distance = time_span / 1000
    prev = end + timedelta(days=1)
    for reading in readings:
        dist = prev - reading.updated_at
        if dist > min_distance:
            prev = reading.updated_at
            response.append({
                'updatedAt': reading.updated_at.replace(tzinfo=UTC).isoformat(),
                'temperature': reading.temperature,
                'humidity': reading.humidity,
                'pressure': reading.pressure,
                'batteryLevel': reading.battery_level
            })
    return jsonify(response)
