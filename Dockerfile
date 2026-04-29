# 1. 노드 이미지 가져오기 (리액트 실행 환경)
FROM node:18-alpine

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 3. 설정 파일들을 먼저 복사 (캐시 활용을 위함)
COPY package*.json ./

# 4. 필요한 라이브러리 설치
RUN npm install

# 5. 나머지 소스 코드 복사
COPY . .

# 6. 리액트 기본 포트 열기
EXPOSE 3000

# 7. 리액트 시작 명령어
CMD ["npm", "start"]