import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} KISBNB. Bootcamp graduation project.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/properties" className="hover:text-gray-900">
            Listings
          </Link>
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="hover:text-gray-900">
            Photos by Unsplash
          </a>
        </div>
      </div>
    </footer>
  );
}
