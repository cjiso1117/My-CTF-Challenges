from python:3.9.4
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
ENV BACKEND=backend
CMD flask run --host 0.0.0.0
