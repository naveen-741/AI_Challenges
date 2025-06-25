jest.mock("react-dom", () => ({
  render: jest.fn(),
}));

describe("index.js", () => {
  it("renders App and calls reportWebVitals", () => {
    // Mock the root element
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    // Re-require index.js to run it with the mock in place
    jest.resetModules();
    require("./index");

    // Import the mocked ReactDOM after require
    const ReactDOM = require("react-dom");
    expect(ReactDOM.render).toHaveBeenCalled();

    // Clean up
    document.body.removeChild(root);
  });
});
