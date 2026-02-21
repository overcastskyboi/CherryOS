# Contributing to CherryOS

Thank you for your interest in contributing to CherryOS! We welcome contributions from the community.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/CherryOS.git
    cd CherryOS
    ```
3.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
    *Note: We use `--legacy-peer-deps` due to some React 19 peer dependency conflicts with ESLint plugins.*

## Development Workflow

1.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
3.  **Make your changes**. Ensure you follow the existing code style (Prettier/ESLint are configured).

## Testing & Quality

*   **Linting**: Run `npm run lint` to check for code quality and security issues (SonarJS/Security plugins enabled).
*   **Building**: Run `npm run build` to ensure the project compiles correctly.
*   **Security**: Do not introduce new dependencies without checking `npm audit`.

## Deployment

The project is deployed to GitHub Pages via an OCI Object Storage sync (or manual GitHub Action dispatch).
*   **Production Build**: `npm run build`
*   **Local Preview**: `npm run preview`

## Pull Request Guidelines

1.  Push your branch to your fork.
2.  Open a Pull Request against the `main` branch.
3.  Describe your changes clearly.
4.  Ensure all checks pass.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
