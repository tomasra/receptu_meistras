FROM python:3.4

RUN pip install -U pip
RUN mkdir /code
WORKDIR /code

ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/