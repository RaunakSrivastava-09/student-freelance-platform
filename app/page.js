


"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center">
          Student Freelance Platform 
        </h1>

        <p className="text-lg md:text-xl mb-10 text-center max-w-xl text-gray-200">
          Find gigs, showcase your skills, and start earning as a student.
          Build your portfolio and connect with real clients.
        </p>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
          <Link href="/signup">
            <button className="w-full bg-white text-indigo-600 font-semibold p-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              Signup
            </button>
          </Link>

          <Link href="/login">
            <button className="w-full bg-green-500 text-white font-semibold p-4 rounded-2xl shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300">
              Login
            </button>
          </Link>

          <Link href="/gigs">
            <button className="w-full bg-purple-500 text-white font-semibold p-4 rounded-2xl shadow-lg hover:bg-purple-600 hover:scale-105 transition-all duration-300">
              View Gigs
            </button>
          </Link>

          <Link href="/gigs/create">
            <button className="w-full bg-orange-500 text-white font-semibold p-4 rounded-2xl shadow-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300">
              Create Gig
            </button>
          </Link>
        </div>

        
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">💼 Real Projects</h3>
            <p className="text-gray-200 text-sm">Work on real-world freelance gigs and build experience.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">⚡ Fast Payments</h3>
            <p className="text-gray-200 text-sm">Secure and quick payment system for students.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">🌐 Networking</h3>
            <p className="text-gray-200 text-sm">Connect with clients and other students globally.</p>
          </div>
        </div>

      
        <p className="mt-12 text-sm text-gray-300">
          © 2026 Student Freelance Platform • Built with ❤️ by me
        </p>
      </div>
    </div>
  );
}
