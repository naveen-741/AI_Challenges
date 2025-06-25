import reportWebVitals from "./reportWebVitals";

describe("reportWebVitals", () => {
  it("calls all web-vitals functions when onPerfEntry is a function", async () => {
    // Use a plain function instead of a Jest mock
    const onPerfEntry = function () {};
    const getCLS = jest.fn();
    const getFID = jest.fn();
    const getFCP = jest.fn();
    const getLCP = jest.fn();
    const getTTFB = jest.fn();

    // Create a mock importer that returns a promise with the web-vitals functions
    const mockImporter = () =>
      Promise.resolve({
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB,
      });

    // Call reportWebVitals and wait for it to complete
    await reportWebVitals(onPerfEntry, mockImporter);

    // Wait for all promises to resolve
    await new Promise((resolve) => setImmediate(resolve));

    // Verify that all web-vitals functions were called with onPerfEntry
    expect(getCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(getFID).toHaveBeenCalledWith(onPerfEntry);
    expect(getFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(getLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(getTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  it("does nothing if onPerfEntry is not a function", async () => {
    const mockImporter = jest.fn();
    await reportWebVitals(123, mockImporter);
    await reportWebVitals(null, mockImporter);
    await reportWebVitals(undefined, mockImporter);
    expect(mockImporter).not.toHaveBeenCalled();
  });

  it("can be called without arguments", () => {
    // Should not throw
    expect(() => reportWebVitals()).not.toThrow();
  });
});
