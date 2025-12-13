const repoUrl = (process.env.NEXT_PUBLIC_GITHUB_REPO_URL || '').trim()

export default function Footer() {
  return (
    <footer className="bg-dark border-top py-3 mt-auto">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-secondary">© {new Date().getFullYear()} FundMe</span>
          <a
            className="link-light"
            href={repoUrl || '#'}
            target="_blank"
            rel="noreferrer"
            title={repoUrl ? '' : 'Configure NEXT_PUBLIC_GITHUB_REPO_URL in .env.local'}
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  )
}
