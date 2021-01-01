from dateutil.parser import isoparse
from dateutil.tz import UTC
from db.models import Reading, Name, Tag, init_db, db
from flask import Flask
import sqlalchemy
import sqlalchemy.exc
def insert_name(name):
    name_id = db.session.query(Name.name_id).filter_by(name=name).scalar()
    if name_id:
        return name_id

    name = Name(name=name)
    db.session.add(name)
    db.session.commit()
    return name.name_id


def insert_tag(mac):
    tag_id = db.session.query(Tag.tag_id).filter_by(mac=mac).scalar()
    if tag_id:
        return tag_id

    tag = Tag(mac=mac)
    db.session.add(tag)
    db.session.commit()
    return tag.tag_id


def insert_reading(mac, name, updated_at, temperature, humidity, pressure, battery_level, commit):
    tag_id = insert_tag(mac)
    name_id = insert_name(name)
    reading = Reading(
        updated_at=updated_at,
        tag_id=tag_id,
        name_id=name_id,
        temperature=temperature,
        humidity=humidity,
        pressure=pressure,
        battery_level=battery_level
    )
    db.session.add(reading)
    if commit:
        db.session.commit()


def get_readings(begin=None, end=None, name=None, limit=None):
    q = Reading.query
    if name:
        sq = db.session.query(Name.name_id).filter_by(name=name).subquery()
        q = q.join(sq)
    if begin:
        q = q.filter(Reading.updated_at >= begin)
    if end:
        q = q.filter(Reading.updated_at <= end)
    q = q.order_by(Reading.updated_at.desc())
    if limit:
        q = q.limit(limit)
    #print(str(q))
    return q.all()
