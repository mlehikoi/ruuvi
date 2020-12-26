from db.config import username, password, hostname, databasename
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import SMALLINT, TINYINT
from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()

_PRESSURE_OFFSET = 50000
_PRESSURE_SCALE = 100
_TEMPERATURE_SCALE = 100
_HUMIDITY_SCALE = 100


class Name(db.Model):
    name_id = db.Column(TINYINT(unsigned=True), primary_key=True)
    name = db.Column(db.String(64), unique=True)


class Tag(db.Model):
    tag_id = db.Column(TINYINT(unsigned=True), primary_key=True)
    mac = db.Column(db.CHAR(17), unique=True)


class Reading(db.Model):
    updated_at = db.Column(db.TIMESTAMP, primary_key=True)
    tag_id = db.Column(TINYINT(unsigned=True), db.ForeignKey("tag.tag_id"), primary_key=True)
    name_id = db.Column(TINYINT(unsigned=True), db.ForeignKey("name.name_id"))
    _temperature = db.Column('temperature', SMALLINT)
    _humidity = db.Column('humidity', SMALLINT(unsigned=True))
    _pressure = db.Column('pressure', SMALLINT(unsigned=True))
    battery_level = db.Column(TINYINT(unsigned=True))

    @hybrid_property
    def temperature(self):
        return self._temperature / _TEMPERATURE_SCALE

    @temperature.setter
    def temperature(self, temperature):
        self._temperature = _TEMPERATURE_SCALE * temperature

    @hybrid_property
    def humidity(self):
        return self._humidity / _HUMIDITY_SCALE

    @humidity.setter
    def humidity(self, humidity):
        self._humidity = _TEMPERATURE_SCALE * humidity

    @hybrid_property
    def pressure(self):
        return (self._pressure + _PRESSURE_OFFSET) / _PRESSURE_SCALE

    @pressure.setter
    def pressure(self, pressure):
        self._pressure = _PRESSURE_SCALE * pressure - _PRESSURE_OFFSET


def init_db(app):
    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
        username=username,
        password=password,
        hostname=hostname,
        databasename=databasename,
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    global db
    db.app = app
    db.init_app(app)
