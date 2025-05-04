import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url("/img/fog.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Градиентный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 via-purple-500/80 to-pink-500/80 z-10"></div>

      {/* Основной контент */}
      <div className="relative z-20 text-center bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="space-y-6">
          {/* Декоративные элементы */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>

          <h1 className="text-8xl font-bold text-white mb-4 animate-bounce relative">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-white mb-4">
					Page not found
          </h2>
          <p className="text-white/90 text-lg mb-8">
					Sorry, the page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl relative group"
          >
            <span className="relative z-10">Back to Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  )
}
