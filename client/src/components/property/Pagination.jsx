import { useSearchParams } from 'react-router-dom';

export default function Pagination({ pagination }) {
  const [searchParams, setSearchParams] = useSearchParams();
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="btn-secondary disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 text-sm text-gray-600">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => goToPage(page + 1)}
        className="btn-secondary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
