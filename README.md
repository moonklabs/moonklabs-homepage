# 뭉클랩

뭉클랩은 AI 네이티브 제품과 에이전틱 시스템을 설계하고 구현하는 엔지니어링 스튜디오입니다.

우리는 기술을 보여주기 위해 제품을 만들지 않습니다.
우리는 **사람과 에이전트가 협업하는 방식**을 설계하고, 그것이 실제 업무와 운영 속에서 자연스럽게 작동하도록 시스템으로 완성합니다.

## 브랜드 원칙

- **정교함** — 기능보다 구조를 먼저 봅니다.
- **실행력** — 빠르게 만들되, 운영 가능한 형태로 끝냅니다.
- **지속성** — 한 번의 데모보다 오래 쓰이는 시스템을 설계합니다.
- **명료함** — 복잡한 문제를 단순하고 선명하게 정리합니다.
- **신뢰성** — 팀이 안심하고 맡길 수 있는 구현을 추구합니다.

## 우리가 만드는 것

- **LLM / Agentic Systems** — 업무 자동화, 멀티에이전트 오케스트레이션, 내부 도구 구축
- **RAG / Knowledge Systems** — 문서와 데이터 위에 정교한 검색·응답 경험 구축
- **Internal Tooling** — 운영, 분석, CS, 세일즈를 돕는 사내 도구 설계
- **Evaluation & Observability** — 품질 검증, 회귀 방지, 운영 가시성 체계화
- **Enterprise Delivery** — 중견·대기업·투자사와 함께하는 실전형 구현

## 톤앤매너

- 간결하지만 가볍지 않게
- 기술적으로 탄탄하지만 과시하지 않게
- 실험적이지만 운영 가능하게
- 제품은 차분하게, 메시지는 선명하게

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
