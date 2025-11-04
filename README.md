# Go-To-Docs

## Overview
Go-To-Docs is a centralized resource for our chapter's reusable practices, decision-making frameworks, and team knowledge. It serves as a living document that evolves based on feedback from the team, ensuring that our practices are aligned with business goals and reducing redundant questions.

This repo hosts **Band A** content, making it accessible to anyone in the organization while keeping sensitive information inside the chapter.

## Project Structure
- **docs/**: Contains markdown files for various practices and guidelines.
- **docs-v2/**: Preview version with changes or improvements.
- **scripts/**: Utility scripts for CI and content maintenance.
- **.github/**: CI workflows, templates, and issue labelers.
- **LICENSE**: MIT for code, CC BY-NC 4.0 for documentation.

## Key Features
- **Feedback System**: Allows the team to suggest improvements or flag outdated content.
- **Versioning**: Content evolves over time with minimal friction. Current version is available under `/v2/`.
- **Stale Detection**: Content marked stale if it hasn't been reviewed or updated in a predefined time.
- **Announcements**: A living log of changes and updates made to the documentation with ownership details.
  
## Usage
- **Visit**: [Go-To-Docs](https://ORG.github.io/Go-To-Docs) to view the documentation.
- **Contribute**: Fork, create a branch, and submit a PR with your changes. Make sure to update the `change_type` to either `patch`, `minor`, or `major`.
- **Feedback**: Use the "Ask KL" buttons on each page to raise issues or ask questions. Feedback is routed to GitHub Issues for traceability.

## Roadmap
1. **Pilot v1**: 60-day trial period to evaluate effectiveness in reducing repeat questions and streamlining decision-making.
2. **v2 Preview**: Introduce new structure based on feedback with soft A/B testing.
3. **Long-Term**: Scale the platform with additional resources and integrations based on usage patterns.

## Licensing
- **Documentation**: CC BY-NC 4.0
- **Code**: MIT
