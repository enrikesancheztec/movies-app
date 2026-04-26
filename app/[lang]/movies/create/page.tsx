"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCreateMovie } from "@/hooks/useCreateMovie";
import { useProducers } from "@/hooks/useProducers";
import { MOVIE_RATINGS } from "@/types/movie-rating";

export default function CreateMoviePage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const { values, isSubmitting, setField, submit } = useCreateMovie();
  const { producers, loading: producersLoading } = useProducers();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const movie = await submit();
    if (movie) {
      router.push(`/${lang}`);
    }
  }

  return (
    <main>
      <h1>Create Movie</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="name">Title</label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="launchDate">Release Date</label>
          <input
            id="launchDate"
            type="date"
            value={values.launchDate}
            onChange={(e) => setField("launchDate", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="duration">Duration (min)</label>
          <input
            id="duration"
            type="number"
            min={1}
            value={values.duration}
            onChange={(e) => setField("duration", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={values.rating}
            onChange={(e) => setField("rating", e.target.value)}
          >
            <option value="">-- Select rating --</option>
            {MOVIE_RATINGS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="producerId">Producer</label>
          <select
            id="producerId"
            value={values.producerId}
            disabled={producersLoading}
            onChange={(e) => setField("producerId", e.target.value)}
          >
            <option value="">
              {producersLoading ? "Loading producers..." : "-- Select producer --"}
            </option>
            {producers.map((p) => (
              <option key={p.id} value={String(p.id)}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => router.push(`/${lang}`)}>
            Cancel
          </button>
        </div>

      </form>
    </main>
  );
}
