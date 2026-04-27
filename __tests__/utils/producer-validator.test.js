import {
  MAX_PROFILE_LENGTH,
  validateProducerForm,
  validateProducerName,
  validateProducerProfile,
} from "@/utils/producer-validator";

describe("producer-validator", () => {
  describe("validateProducerName", () => {
    test("returns null for a valid name", () => {
      // GIVEN
      const name = "Francis Ford Coppola";

      // WHEN
      const result = validateProducerName(name);

      // THEN
      expect(result).toBeNull();
    });

    test.each(["", "   ", null, undefined])(
      "returns the required error for invalid value %p",
      (value) => {
        // GIVEN
        const name = value;

        // WHEN
        const result = validateProducerName(name);

        // THEN
        expect(result).toBe("Name is mandatory");
      }
    );
  });

  describe("validateProducerProfile", () => {
    test.each([undefined, "", "Award-winning producer."])(
      "returns null for valid optional profile %p",
      (value) => {
        // GIVEN
        const profile = value;

        // WHEN
        const result = validateProducerProfile(profile);

        // THEN
        expect(result).toBeNull();
      }
    );

    test("returns max-length error when profile exceeds the limit", () => {
      // GIVEN
      const profile = "a".repeat(MAX_PROFILE_LENGTH + 1);

      // WHEN
      const result = validateProducerProfile(profile);

      // THEN
      expect(result).toBe(
        `Profile must be at most ${MAX_PROFILE_LENGTH} characters`
      );
    });

    test.each([123, false, {}])(
      "returns type error for non-string value %p",
      (value) => {
        // GIVEN
        const profile = value;

        // WHEN
        const result = validateProducerProfile(profile);

        // THEN
        expect(result).toBe("Profile must be a string");
      }
    );
  });

  describe("validateProducerForm", () => {
    test("returns valid result for a payload without profile", () => {
      // GIVEN
      const values = { name: "Jerry Bruckheimer" };

      // WHEN
      const result = validateProducerForm(values);

      // THEN
      expect(result).toEqual({
        errors: {},
        isValid: true,
      });
    });

    test("returns valid result for a payload with valid profile", () => {
      // GIVEN
      const values = {
        name: "Jerry Bruckheimer",
        profile: "Known for blockbuster productions.",
      };

      // WHEN
      const result = validateProducerForm(values);

      // THEN
      expect(result).toEqual({
        errors: {},
        isValid: true,
      });
    });

    test("returns name error when the name is empty", () => {
      // GIVEN
      const values = { name: "", profile: "Valid profile" };

      // WHEN
      const result = validateProducerForm(values);

      // THEN
      expect(result).toEqual({
        errors: { name: "Name is mandatory" },
        isValid: false,
      });
    });

    test("returns profile error when the profile exceeds the limit", () => {
      // GIVEN
      const values = {
        name: "Jerry Bruckheimer",
        profile: "a".repeat(MAX_PROFILE_LENGTH + 1),
      };

      // WHEN
      const result = validateProducerForm(values);

      // THEN
      expect(result).toEqual({
        errors: {
          profile: `Profile must be at most ${MAX_PROFILE_LENGTH} characters`,
        },
        isValid: false,
      });
    });
  });
});