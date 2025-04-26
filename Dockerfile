FROM node:18

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

WORKDIR /app

COPY . .

RUN cd backend && npm install

EXPOSE 3000

CMD ["node", "backend/app.js"]