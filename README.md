# 뭉클랩 · Moonklabs

AI 네이티브 제품과 에이전틱 시스템을 설계하고 구축하는 엔지니어링 스튜디오입니다.

우리는 단순히 기능을 만드는 팀이 아니라,
**사람과 에이전트가 함께 일하는 방식**을 제품과 시스템으로 구현합니다.

## What we do

- **LLM / Agentic Systems** — 업무 자동화, 멀티에이전트 오케스트레이션, 내부 도구 구축
- **RAG / Knowledge Systems** — 문서·데이터 기반 검색/응답 시스템 설계
- **Internal Tooling** — 운영, 분석, CS, 세일즈를 돕는 사내 도구 개발
- **Evaluation & Observability** — 품질 검증, 회귀 방지, 운영 가시성 설계
- **Enterprise Delivery** — 중견·대기업·투자사와 함께하는 실전형 구현

## Why Moonklabs

- 빠르게 프로토타입을 만들고,
- 실제 운영 환경에서 안정적으로 돌리고,
- 팀이 반복 업무 대신 핵심 의사결정에 집중하도록 만듭니다.

## Contact

- Website: https://moonklabs.com
- Email: hello@moonklabs.com
- GitHub: https://github.com/moonklabs

## Deployment

이 홈페이지는 GitHub Actions를 통해 AWS Amplify로 배포됩니다.

### Required GitHub configuration
- Repository secret: `AWS_ACCESS_KEY_ID`
- Repository secret: `AWS_SECRET_ACCESS_KEY`
- Repository variable: `AWS_REGION`
- Repository variable: `AMPLIFY_APP_ID`
- Repository variable: `AMPLIFY_BRANCH`

### Deployment flow
1. GitHub Actions runs on pushes to `main` or manual dispatch.
2. The workflow installs dependencies, runs lint, and builds the static Next.js export.
3. The workflow uploads `site.zip` to Amplify using `create-deployment` / `start-deployment`.
4. Amplify serves the site from the configured branch URL.
