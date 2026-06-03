import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-500">{description}</p>
      <Link to="/" className="btn-primary mt-8 inline-block">
        Back home
      </Link>
    </div>
  );
}
