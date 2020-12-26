# ruuvi
A cloud-based solution for storing and presenting Ruuvi tag readings

## Introduction
Ruuvi tag is a small sensor for collecting environment data [Ruuvi](www.ruuvi.com).
The tags broadcast measurement readings by Bluetooth.
The readings can be shown by Ruuvi Station app, which is available for Android and iPhone.
The Android app can be configured to forward the data to cloud.
This project provides tools for storing the data and showing it.

## Ingredients
- ruuvi tag - the sensor for measuring
- a gateway to forward the data to cloud. This can be an Android phone with Ruuvi State app.
- a REST server for receiving the measurement. We'll be using Python and Flask.
- a database (or a flat file) for storing the measurements. We'll be using MySQL.
- a web service for showing the data. We'll be using Flask for backend, nginx as webserver and Charts.js and Google Charts for showing the measurements.

## Cookbook
This is a step-by-step guide for installing the service on pythonanywhere. We are using pythonanywhere because it has all the tools needed and it's free.

### Pythonanywhere account
Register at pythonanywhere.com.

### Create a database
After creating an account, go to ***Databases*** and select ***Initialize MySQL***. Write down the **password**, **username**, **database host address**

python3 -m venv flask_app

### Create a web application
Go to ***Web*** and click ***Add a new web app***.
Select **Flask** as the framework and **Python 3.8** as the Python version.
Use the suggested name for your app: **/home/yourname/mysite/flask_app.py**.
You can now test your web site by browsing to yourname.pythonanywhere.com.

### Install virtual environment for Python
Python virtual environment make it possible to install different versions of python packages.
For this project, it's required on pythonanywhere because we need to install newer version of  
```bash
~ $ cd  mysite/
~/mysite $ python3 -m venv venv
~/mysite $ . venv/bin/activate
(venv) ~/mysite $ pip install python-dateutil
```

### Configure your web app to use the virtual environment
Go to ***Web*** and ***Virtual env: Enter path to a virtualenv, if desired***.
Enter `/home/yourname/mysite/venv`

### Get the code
Click **Start a console in this virtualenv**.
```bash
(venv) 14:14 ~/mysite $ git init
Initialized empty Git repository in /home/ruuvi/mysite/.git/
(venv) 14:17 ~/mysite $ git remote add origin https://github.com/mlehikoi/ruuvi.git
(venv) 14:18 ~/mysite $ rm flask_app.py                                                  
(venv) 14:19 ~/mysite $ git pull origin master
From https://github.com/mlehikoi/ruuvi
 * branch            master     -> FETCH_HEAD
```

### Configure the database
```bash
(venv) 14:20 ~/mysite (master)$ cp db/config_template.py db/config.py
(venv) 14:26 ~/mysite (master)$ nano db/config.py
```
This is what the configuration could look like:
```python
username='ruuvi'
password='*********'
hostname='ruuvi.mysql.pythonanywhere-services.com'
databasename='ruuvi$default'
```
```bash
(venv) 15:23 ~/mysite (master)$ pip install Flask-SQLAlchemy

(venv) 15:44 ~/mysite (master)$ pip install mysql-connector-python

(venv) 15:33 ~/mysite (master)$ python3 db_tool.py 
Database initialized
```



