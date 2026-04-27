import MockAdapter from "axios-mock-adapter";
import apiClient, {
  createMovie,
  getMovieById,
  getMovies,
} from "@/lib/api/movies";
import type { Movie } from "@/types/movie";

describe("movies api service", () => {
  let mock: MockAdapter;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  const movie: Movie = {
    id: 1,
    name: "Alien",
    launchDate: "1979-05-25",
    duration: 117,
    rating: "R",
    description: "Sci-fi horror classic.",
    producerId: 2,
  };

  const createPayload: Omit<Movie, "id"> = {
    name: "Aliens",
    launchDate: "1986-07-18",
    duration: 137,
    rating: "R",
    description: "Colonial marines vs xenomorphs.",
    producerId: 2,
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.reset();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  describe("getMovies", () => {
    test("returns response data when GET /movies succeeds", async () => {
      // GIVEN
      const movies = [movie];
      mock.onGet("/movies").reply(200, movies);

      // WHEN
      const result = await getMovies();

      // THEN
      expect(result).toEqual(movies);
    });

    test("throws an error with the expected prefix when the server returns an error", async () => {
      // GIVEN
      mock.onGet("/movies").reply(500);

      // WHEN
      const result = getMovies();

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch movies");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch movies")
      );
    });

    test("throws an error when a network failure occurs", async () => {
      // GIVEN
      mock.onGet("/movies").networkError();

      // WHEN
      const result = getMovies();

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch movies: Network Error");
    });
  });

  describe("getMovieById", () => {
    test("returns response data when GET /movies/:id succeeds", async () => {
      // GIVEN
      mock.onGet("/movies/1").reply(200, movie);

      // WHEN
      const result = await getMovieById(1);

      // THEN
      expect(result).toEqual(movie);
    });

    test("throws an error containing the requested movie id when the request fails", async () => {
      // GIVEN
      mock.onGet("/movies/99").reply(404);

      // WHEN
      const result = getMovieById(99);

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch movie with ID 99");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch movie with ID 99")
      );
    });

    test("throws an error when a network failure occurs", async () => {
      // GIVEN
      mock.onGet("/movies/7").networkError();

      // WHEN
      const result = getMovieById(7);

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch movie with ID 7: Network Error");
    });
  });

  describe("createMovie", () => {
    test("returns created movie data when POST /movies succeeds", async () => {
      // GIVEN
      const createdMovie = { ...createPayload, id: 10 };
      mock.onPost("/movies").reply((config) => {
        expect(JSON.parse(config.data as string)).toEqual(createPayload);
        return [201, createdMovie];
      });

      // WHEN
      const result = await createMovie(createPayload);

      // THEN
      expect(result).toEqual(createdMovie);
    });

    test("throws an error with the expected prefix when the server returns an error", async () => {
      // GIVEN
      mock.onPost("/movies").reply(400);

      // WHEN
      const result = createMovie(createPayload);

      // THEN
      await expect(result).rejects.toThrow("Failed to create movie");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create movie")
      );
    });

    test("throws an error when a network failure occurs", async () => {
      // GIVEN
      mock.onPost("/movies").networkError();

      // WHEN
      const result = createMovie(createPayload);

      // THEN
      await expect(result).rejects.toThrow("Failed to create movie: Network Error");
    });
  });
});