# 뭉클랩

뭉클랩은 AI 네이티브 제품과 에이전틱 시스템을 설계하고 구현하는 엔지니어링 스튜디오입니다.

우리는 단순히 기능을 추가하는 팀이 아니라,
**사람과 에이전트가 함께 일하는 방식**을 정교하게 설계해 실제 운영 가능한 시스템으로 완성합니다.

## 우리가 만드는 것

- **LLM / Agentic Systems** — 업무 자동화, 멀티에이전트 오케스트레이션, 내부 도구 구축
- **RAG / Knowledge Systems** — 문서와 데이터 위에 정교한 검색·응답 경험 구축
- **Internal Tooling** — 운영, 분석, CS, 세일즈를 돕는 사내 도구 설계
- **Evaluation & Observability** — 품질 검증, 회귀 방지, 운영 가시성 체계화
- **Enterprise Delivery** — 중견·대기업·투자사와 함께하는 실전형 구현

## 뭉클랩이 추구하는 방식

- 빠르게 시도하되, 구조는 단단하게 만듭니다.
- 보여주기 위한 데모보다, 오래 쓰는 시스템을 설계합니다.
- 반복 업무를 줄이고, 팀이 더 중요한 판단에 집중하도록 돕습니다.

## 연락처

- 웹사이트: https://moonklabs.com
- 이메일: hello@moonklabs.com
- GitHub: https://github.com/moonklabs

## 배포

이 홈페이지는 GitHub Actions를 통해 AWS Amplify에 배포됩니다.

### GitHub 설정
- Repository secret: `AWS_ACCESS_KEY_ID`
- Repository secret: `AWS_SECRET_ACCESS_KEY`
- Repository variable: `AWS_REGION`
- Repository variable: `AMPLIFY_APP_ID`
- Repository variable: `AMPLIFY_BRANCH`

### 배포 흐름
1. `main` 브랜치 푸시 또는 수동 실행 시 GitHub Actions가 시작됩니다.
2. 의존성을 설치하고, lint와 정적 빌드를 수행합니다.
3. 생성된 `site.zip`을 Amplify의 `create-deployment` / `start-deployment`로 업로드합니다.
4. Amplify가 설정된 브랜치 URL로 사이트를 제공합니다.
