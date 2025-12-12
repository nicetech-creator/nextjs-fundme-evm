export default function Footer() {
  return (
    <footer className="bg-light border-top py-3 mt-auto">
      <div className="container">
        <span className="text-muted">© {new Date().getFullYear()} FundMe</span>
      </div>
    </footer>
  )
}
