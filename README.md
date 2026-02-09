# 🌟 AI 릴레이 동화 만들기

AI를 활용한 릴레이 동화 생성 웹 애플리케이션입니다.

## 📋 기능

- **A팀/B팀** 각각의 주인공 설정과 키워드를 기반으로 동화 생성
- **키워드 표시**: 생성된 동화 상단에 사용된 5개 키워드를 태그로 표시
- **A4 1~2장 분량**의 교훈적인 어린이 동화 자동 생성
- **삽화 설명** 2개 자동 생성
- Anthropic Claude API를 사용한 고품질 콘텐츠 생성

## 🚀 Vercel 배포 방법

### 1. GitHub에 코드 업로드

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel에 배포

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (비워두기)
   - Output Directory: `public`
5. "Deploy" 클릭

### 3. 환경 변수 설정 (선택사항)

배포 후 사용자가 직접 API 키를 입력하게 되어 있습니다.

## 💻 로컬 실행 방법

```bash
# 간단한 HTTP 서버 실행
npx serve public

# 또는 Python으로 실행
cd public
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

## 🔑 API 키 발급

1. [Anthropic Console](https://console.anthropic.com/) 접속
2. API Keys 메뉴에서 새 API 키 생성
3. 웹앱에서 생성된 API 키 입력

## 📝 사용 방법

1. Anthropic API 키를 입력
2. A팀 또는 B팀 동화 생성하기 버튼 클릭
3. AI가 주인공 설정과 5개 키워드를 모두 사용하여 동화 생성
4. 생성된 동화와 삽화 설명 확인

## 🛠️ 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript
- Anthropic Claude API (claude-sonnet-4)

## 📄 라이선스

MIT License
