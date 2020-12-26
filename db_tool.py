#!/usr/bin/env python3
import db.models
from flask import Flask


def main():
    app = Flask(__name__)
    db.models.init_db(app)
    db.models.db.create_all()
    print('Database initialized')


if __name__ == "__main__":
    main()
