const ValidationApi = require(".");

describe("ValidationApi", () => {
  const url = "http://api.url";

  it("should accept the Api url in the constructor", () => {
    expect(new ValidationApi(url).validationApiUrl).toEqual(url);
  });

  describe("Call external validation service", () => {
    let validationApi;
    let mockRequest;

    beforeEach(() => {
      mockRequest = {
        post: jest.fn(() => Promise.resolve())
      };

      validationApi = new ValidationApi(url, mockRequest);
    });

    it("should pass the json to validation Api", () => {
      const json = { test: "json" };
      validationApi.validate(json);

      expect(mockRequest.post).toHaveBeenCalledWith(url, {
        body: json,
        json: true
      });
    });

    it("should return valid response", () => {
      mockRequest.post.mockImplementation(() =>
        Promise.resolve({
          response: {
            body: { success: true }
          }
        })
      );
      expect(validationApi.validate({ test: "json" })).resolves.toEqual({
        response: {
          body: { success: true }
        }
      });
    });

    describe("error handling", () => {
      const errors = {
        message: "Error message",
        detail: "Error details"
      };

      it("should handle error responses", async () => {
        mockRequest.post.mockImplementation(() =>
          Promise.resolve({ success: false })
        );
        const result = validationApi.validate({ test: "json" });
        expect(await result).toEqual({ success: false });
      });

      it("should handle non-200 responses", async () => {
        mockRequest.post.mockImplementation(() =>
          Promise.reject({
            response: {
              body: {
                errors
              }
            }
          })
        );
        const result = validationApi.validate({ test: "json" });
        expect(await result).toEqual({ valid: false, errors });
      });
    });
  });
});
