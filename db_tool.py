#!/usr/bin/env python3
import db.models
from flask import Flask
from db.util import get_readings
import timeit


def read_all():
    r = get_readings(limit=100000)
    # print('Database initialized', len(r))


def main():
    app = Flask(__name__)
    db.models.init_db(app)
    #db.models.db.create_all()
    print (timeit.timeit(
        stmt = read_all,
        number = 2))


if __name__ == "__main__":
    main()
