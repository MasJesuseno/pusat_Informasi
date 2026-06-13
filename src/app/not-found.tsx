import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
        Go back home
      </Link>
    </div>
  );
}
