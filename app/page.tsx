'use client'
import Header from '../components/Header'
import Interact from '../components/Interact'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main>
        <Interact />
      </main>
      <Footer />
    </div>
  )
}
