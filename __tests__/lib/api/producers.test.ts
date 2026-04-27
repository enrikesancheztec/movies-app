import MockAdapter from "axios-mock-adapter";
import apiClient, {
  createProducer,
  getProducerById,
  getProducers,
} from "@/lib/api/producers";
import type { Producer } from "@/types/producer";

describe("producers api service", () => {
  let mock: MockAdapter;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  const producer: Producer = {
    id: 2,
    name: "Walter Hill",
    profile: "Writer and producer.",
  };

  const createPayload: Omit<Producer, "id"> = {
    name: "Gale Anne Hurd",
    profile: "Producer known for sci-fi action films.",
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

  describe("getProducers", () => {
    test("returns response data when GET /producers succeeds", async () => {
      // GIVEN
      const producers = [producer];
      mock.onGet("/producers").reply(200, producers);

      // WHEN
      const result = await getProducers();

      // THEN
      expect(result).toEqual(producers);
    });

    test("throws an error with the expected prefix when the server returns an error", async () => {
      // GIVEN
      mock.onGet("/producers").reply(500);

      // WHEN
      const result = getProducers();

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch producers");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch producers")
      );
    });

    test("throws an error when a network failure occurs", async () => {
      // GIVEN
      mock.onGet("/producers").networkError();

      // WHEN
      const result = getProducers();

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch producers: Network Error");
    });
  });

  describe("getProducerById", () => {
    test("returns response data when GET /producers/:id succeeds", async () => {
      // GIVEN
      mock.onGet("/producers/2").reply(200, producer);

      // WHEN
      const result = await getProducerById(2);

      // THEN
      expect(result).toEqual(producer);
    });

    test("throws an error containing the requested producer id when the request fails", async () => {
      // GIVEN
      mock.onGet("/producers/99").reply(404);

      // WHEN
      const result = getProducerById(99);

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch producer with ID 99");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch producer with ID 99")
      );
    });

    test("throws an error when a network failure occurs", async () => {
      // GIVEN
      mock.onGet("/producers/7").networkError();

      // WHEN
      const result = getProducerById(7);

      // THEN
      await expect(result).rejects.toThrow("Failed to fetch producer with ID 7: Network Error");
    });
  });

  describe("createProducer", () => {
    test("returns created producer data when POST /producers succeeds", async () => {
      // GIVEN
      const createdProducer = { ...createPayload, id: 10 };
      mock.onPost("/producers").reply((config) => {
        expect(JSON.parse(config.data as string)).toEqual(createPayload);
        return [201, createdProducer];
      });

      // WHEN
      const result = await createProducer(createPayload);

      // THEN
      expect(result).toEqual(createdProducer);
    });

    test("throws an error with the expected prefix when the server returns an error", async () => {
      // GIVEN
      mock.onPost("/producers").reply(400);

      // WHEN
      const result = createProducer(createPayload);

      // THEN
      await expect(result).rejects.toThrow("Failed to create producer");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create producer")
      );
    });

    test("throws an error when a network failure occurs", async () => {
      // GIVEN
      mock.onPost("/producers").networkError();

      // WHEN
      const result = createProducer(createPayload);

      // THEN
      await expect(result).rejects.toThrow("Failed to create producer: Network Error");
    });
  });
});