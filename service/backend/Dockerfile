FROM python:3.4

RUN pip install -U pip
COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt
CMD gunicorn --bind 0.0.0.0:8000 app:app