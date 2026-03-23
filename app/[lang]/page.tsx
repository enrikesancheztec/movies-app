import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";

const movies = [
  { id: 1, title: "The Godfather", year: 1972 },
  { id: 2, title: "Pulp Fiction", year: 1994 },
  { id: 3, title: "The Dark Knight", year: 2008 },
  { id: 4, title: "Inception", year: 2010 },
  { id: 5, title: "Interstellar", year: 2014 },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M8 3.25V12.75M3.25 8H12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M1.75 8C2.95 5.75 5.17 4.25 8 4.25C10.83 4.25 13.05 5.75 14.25 8C13.05 10.25 10.83 11.75 8 11.75C5.17 11.75 2.95 10.25 1.75 8Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            {dict.home.eyebrow}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {dict.home.title}
          </h1>
          <p className="text-sm text-slate-600">{dict.home.subtitle}</p>
        </div>

        <button
          type="button"
          title={dict.home.createMovieTooltip}
          aria-label={dict.home.createMovieTooltip}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <PlusIcon />
          <span>{dict.home.createMovie}</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-900">{dict.home.featuredTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">{dict.home.featuredSubtitle}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            {dict.home.responsiveHint}
          </p>
        </div>

        <div className="grid gap-4 p-4 md:hidden">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {dict.home.movieColumn}
                </p>
                <h3 className="text-base font-semibold text-slate-900">{movie.title}</h3>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {dict.home.yearColumn}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{movie.year}</p>
                </div>

                <button
                  type="button"
                  title={`${dict.home.detailsTooltip} ${movie.title}`}
                  aria-label={`${dict.home.detailsTooltip} ${movie.title}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  <EyeIcon />
                  <span>{dict.home.detailsAction}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.movieColumn}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.yearColumn}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.actionColumn}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {movies.map((movie) => (
                <tr key={movie.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 lg:px-6 lg:py-4 xl:text-base">
                    {movie.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 lg:px-6 lg:py-4 xl:text-base">
                    {movie.year}
                  </td>
                  <td className="px-4 py-3 text-right lg:px-6 lg:py-4">
                    <button
                      type="button"
                      title={`${dict.home.detailsTooltip} ${movie.title}`}
                      aria-label={`${dict.home.detailsTooltip} ${movie.title}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600 xl:px-4"
                    >
                      <EyeIcon />
                      <span>{dict.home.detailsAction}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}