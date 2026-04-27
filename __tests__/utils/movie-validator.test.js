import {
  MAX_DESCRIPTION_LENGTH,
  VALID_RATINGS,
  validateDescription,
  validateDuration,
  validateLaunchDate,
  validateMovieForm,
  validateMovieName,
  validateProducerId,
  validateRating,
} from "@/utils/movie-validator";

describe("movie-validator", () => {
  describe("validateMovieName", () => {
    test("returns null for a valid non-empty string", () => {
      // GIVEN
      const name = "The Godfather";

      // WHEN
      const result = validateMovieName(name);

      // THEN
      expect(result).toBeNull();
    });

    test.each(["", "   ", null, undefined, 123])(
      "returns the required error for invalid value %p",
      (value) => {
        // GIVEN
        const name = value;

        // WHEN
        const result = validateMovieName(name);

        // THEN
        expect(result).toBe("Title is required");
      }
    );
  });

  describe("validateLaunchDate", () => {
    test("returns null for a valid ISO date string", () => {
      // GIVEN
      const launchDate = "2024-01-15";

      // WHEN
      const result = validateLaunchDate(launchDate);

      // THEN
      expect(result).toBeNull();
    });

    test.each(["", "   ", null, undefined])(
      "returns the required error for invalid value %p",
      (value) => {
        // GIVEN
        const launchDate = value;

        // WHEN
        const result = validateLaunchDate(launchDate);

        // THEN
        expect(result).toBe("Release date is required");
      }
    );
  });

  describe("validateDuration", () => {
    test.each([120, "90"])('returns null for valid duration %p', (value) => {
      // GIVEN
      const duration = value;

      // WHEN
      const result = validateDuration(duration);

      // THEN
      expect(result).toBeNull();
    });

    test("returns the required error for empty string", () => {
      // GIVEN
      const duration = "";

      // WHEN
      const result = validateDuration(duration);

      // THEN
      expect(result).toBe("Duration is required");
    });

    test.each([0, -5, "abc"])('returns the positive-number error for invalid numeric value %p', (value) => {
      // GIVEN
      const duration = value;

      // WHEN
      const result = validateDuration(duration);

      // THEN
      expect(result).toBe("Duration must be a positive number");
    });

    test.each([null, undefined])(
      "returns the required error for missing value %p",
      (value) => {
        // GIVEN
        const duration = value;

        // WHEN
        const result = validateDuration(duration);

        // THEN
        expect(result).toBe("Duration is required");
      }
    );
  });

  describe("validateRating", () => {
    test.each(VALID_RATINGS)("returns null for valid rating %p", (rating) => {
      // GIVEN
      const input = rating;

      // WHEN
      const result = validateRating(input);

      // THEN
      expect(result).toBeNull();
    });

    test.each(["X", "", null])("returns the selection error for invalid rating %p", (rating) => {
      // GIVEN
      const input = rating;

      // WHEN
      const result = validateRating(input);

      // THEN
      expect(result).toBe("Please select a rating");
    });
  });

  describe("validateProducerId", () => {
    test("returns null for a numeric id string", () => {
      // GIVEN
      const producerId = "3";

      // WHEN
      const result = validateProducerId(producerId);

      // THEN
      expect(result).toBeNull();
    });

    test.each(["", null, undefined])(
      "returns the selection error for missing producer %p",
      (value) => {
        // GIVEN
        const producerId = value;

        // WHEN
        const result = validateProducerId(producerId);

        // THEN
        expect(result).toBe("Please select a producer");
      }
    );
  });

  describe("validateDescription", () => {
    test.each([undefined, "", "Short synopsis"])(
      "returns null for valid optional description %p",
      (value) => {
        // GIVEN
        const description = value;

        // WHEN
        const result = validateDescription(description);

        // THEN
        expect(result).toBeNull();
      }
    );

    test("returns max-length error when description exceeds the limit", () => {
      // GIVEN
      const description = "a".repeat(MAX_DESCRIPTION_LENGTH + 1);

      // WHEN
      const result = validateDescription(description);

      // THEN
      expect(result).toBe(
        `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`
      );
    });
  });

  describe("validateMovieForm", () => {
    test("returns an empty errors object for a valid payload", () => {
      // GIVEN
      const values = {
        name: "Alien",
        launchDate: "1979-05-25",
        duration: "117",
        rating: "R",
        producerId: "1",
        description: "Sci-fi horror classic.",
      };

      // WHEN
      const result = validateMovieForm(values);

      // THEN
      expect(result).toEqual({ errors: {}, isValid: true });
    });

    test("returns the correct single error key when one field is invalid", () => {
      // GIVEN
      const values = {
        name: "Alien",
        launchDate: "1979-05-25",
        duration: "117",
        rating: "R",
        producerId: "",
        description: "Sci-fi horror classic.",
      };

      // WHEN
      const result = validateMovieForm(values);

      // THEN
      expect(result).toEqual({
        errors: { producerId: "Please select a producer" },
        isValid: false,
      });
    });

    test("returns multiple errors when several fields are invalid", () => {
      // GIVEN
      const values = {
        name: "",
        launchDate: "",
        duration: "0",
        rating: "X",
        producerId: "",
        description: "a".repeat(MAX_DESCRIPTION_LENGTH + 1),
      };

      // WHEN
      const result = validateMovieForm(values);

      // THEN
      expect(result).toEqual({
        errors: {
          name: "Title is required",
          launchDate: "Release date is required",
          duration: "Duration must be a positive number",
          rating: "Please select a rating",
          producerId: "Please select a producer",
          description: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
        },
        isValid: false,
      });
    });
  });
});