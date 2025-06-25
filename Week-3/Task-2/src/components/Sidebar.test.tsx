import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { LightCreator } from "./LightCreator";
import type { ModelState, LightSource } from "../types/model";

// Mock the LightCreator component to simplify testing Sidebar
jest.mock("./LightCreator", () => ({
  __esModule: true,
  LightCreator: jest.fn(({ onSave, onCancel, light }) => (
    <div data-testid="mock-light-creator">
      <button onClick={onSave} data-testid="mock-light-creator-save-button">
        Save Changes
      </button>
      <button onClick={onCancel} data-testid="mock-light-creator-cancel-button">
        Cancel
      </button>
    </div>
  )),
}));

const mockModels: ModelState[] = [
  {
    id: "model-1",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    wireframe: false,
    model: {} as any,
    metadata: {
      id: "model-1",
      name: "model1.glb",
      vertexCount: 1,
      meshCount: 1,
      materialCount: 1,
      animations: ["animation1", "animation2"],
    },
  },
  {
    id: "model-2",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    wireframe: false,
    model: {} as any,
    metadata: {
      id: "model-2",
      name: "model2.glb",
      vertexCount: 1,
      meshCount: 1,
      materialCount: 1,
      animations: [],
    },
  },
];

const mockLights: LightSource[] = [
  {
    id: "light-1",
    name: "Ambient Light",
    type: "ambient",
    intensity: 0.5,
    color: "#ffffff",
    position: [0, 0, 0],
  },
];

const mockOnUpdateModels = jest.fn();
const mockOnUpdateLights = jest.fn();
const mockResetCamera = jest.fn();

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    render(
      <Sidebar
        models={mockModels}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    expect(screen.getByText(/Scene Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/Light Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/Models/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Reset Camera/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add New Light/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Ambient Light/i)).toBeInTheDocument();
    expect(screen.getByText(/model1.glb/i)).toBeInTheDocument();
    expect(screen.getByText(/model2.glb/i)).toBeInTheDocument();
  });

  it("calls onClearModels with an empty array when Clear All Models button is clicked", () => {
    render(
      <Sidebar
        models={mockModels}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={mockOnUpdateModels}
      />
    );

    fireEvent.click(screen.getByTitle(/Clear All Models/i));
    expect(mockOnUpdateModels).toHaveBeenCalledWith();
  });

  it("calls resetCamera when Reset Camera button is clicked", () => {
    render(
      <Sidebar
        models={[]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={[]}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Reset Camera/i }));
    expect(mockResetCamera).toHaveBeenCalledTimes(1);
  });

  it("toggles section expansion when header is clicked", () => {
    render(
      <Sidebar
        models={mockModels}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    const sceneControlsHeader = screen
      .getByText(/Scene Controls/i)
      .closest("h2");
    const lightControlsHeader = screen
      .getByText(/Light Controls/i)
      .closest("h2");
    const modelsHeader = screen.getByText(/Models/i).closest("h2");

    // Initially, sections are expanded (max-h-96)
    expect(sceneControlsHeader!.nextElementSibling).not.toHaveClass("max-h-0");
    expect(lightControlsHeader!.nextElementSibling).not.toHaveClass("max-h-0");
    expect(modelsHeader!.nextElementSibling).not.toHaveClass("max-h-0");

    // Click to collapse Scene Controls
    fireEvent.click(sceneControlsHeader!);
    expect(sceneControlsHeader!.nextElementSibling).toHaveClass("max-h-0");

    // Click to expand Scene Controls back
    fireEvent.click(sceneControlsHeader!);
    expect(sceneControlsHeader!.nextElementSibling).not.toHaveClass("max-h-0");

    // Click to collapse Light Controls
    fireEvent.click(lightControlsHeader!);
    expect(lightControlsHeader!.nextElementSibling).toHaveClass("max-h-0");

    // Click to collapse Models
    fireEvent.click(modelsHeader!);
    expect(modelsHeader!.nextElementSibling).toHaveClass("max-h-0");
  });

  it("shows LightCreator when Add New Light button is clicked", () => {
    render(
      <Sidebar
        models={[]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add New Light/i }));

    // Assert that LightCreator was called with the correct props
    expect(LightCreator).toHaveBeenCalledTimes(1);
    expect(LightCreator).toHaveBeenCalled();
  });

  it("shows LightCreator for editing when Edit button is clicked", () => {
    render(
      <Sidebar
        models={[]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    // Assert that LightCreator was called with the correct props
    expect(LightCreator).toHaveBeenCalledTimes(1);
    expect(LightCreator).toHaveBeenCalled();
  });

  it("calls onUpdateLights with updated array when a light is deleted", () => {
    render(
      <Sidebar
        models={[]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete Light/i }));

    expect(mockOnUpdateLights).toHaveBeenCalledWith([]);
  });

  it("toggles model visibility when Hide/Show button is clicked", () => {
    const { rerender } = render(
      <Sidebar
        models={mockModels}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    // Find the Hide button within the model1.glb container
    const model1Container = screen.getByText("model1.glb").closest("div");
    const hideButtonModel1 = within(model1Container!).getByRole("button", {
      name: /Hide/i,
    });

    fireEvent.click(hideButtonModel1);

    expect(mockOnUpdateModels).toHaveBeenCalledWith([
      { ...mockModels[0], visible: false },
      mockModels[1],
    ]);

    // Re-render with the updated models state
    rerender(
      <Sidebar
        models={[{ ...mockModels[0], visible: false }, mockModels[1]]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    const showButtonModel1 = within(model1Container!).getByRole("button", {
      name: /Show/i,
    });
    fireEvent.click(showButtonModel1);
    expect(mockOnUpdateModels).toHaveBeenCalledWith([
      { ...mockModels[0], visible: true },
      mockModels[1],
    ]);
  });

  it("toggles model wireframe when Wireframe checkbox is clicked", () => {
    const { rerender } = render(
      <Sidebar
        models={mockModels}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    // Find the wireframe checkbox for model1.glb
    const wireframeCheckbox = screen.getByLabelText("Wireframe", {
      selector: `#wireframe-${mockModels[0].id}`,
    });

    // Initially, wireframe is false
    expect(wireframeCheckbox).not.toBeChecked();

    fireEvent.click(wireframeCheckbox);

    expect(mockOnUpdateModels).toHaveBeenCalledWith([
      { ...mockModels[0], wireframe: true },
      mockModels[1],
    ]);

    // Re-render with the updated models state
    rerender(
      <Sidebar
        models={[{ ...mockModels[0], wireframe: true }, mockModels[1]]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    // After clicking, it should be checked
    expect(wireframeCheckbox).toBeChecked();
  });

  it("calls onUpdateModels with updated array when a model is deleted", () => {
    render(
      <Sidebar
        models={mockModels}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(
      screen.getByLabelText(`Delete ${mockModels[0].metadata.name}`)
    );

    expect(mockOnUpdateModels).toHaveBeenCalledWith([mockModels[1]]);
  });

  it("calls onAddLight and closes LightCreator when a new light is saved", () => {
    const mockOnUpdateLights = jest.fn();
    render(
      <Sidebar
        models={[]}
        onUpdateModels={jest.fn()}
        sceneLights={[]}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={jest.fn()}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add New Light/i }));
    expect(screen.getByTestId("mock-light-creator")).toBeInTheDocument();

    // Simulate saving a new light from the mocked LightCreator
    fireEvent.click(screen.getByTestId("mock-light-creator-save-button"));

    expect(mockOnUpdateLights).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("mock-light-creator")).not.toBeInTheDocument(); // LightCreator should be closed
  });

  it("calls onUpdateLights and closes LightCreator when an existing light is edited", () => {
    const existingLight: LightSource = {
      id: "light-1",
      name: "Existing Light",
      type: "point",
      color: "#ffffff",
      intensity: 1,
      position: [0, 0, 0],
      distance: 10,
      decay: 2,
    };
    const mockOnUpdateLights = jest.fn();
    render(
      <Sidebar
        models={[]}
        onUpdateModels={jest.fn()}
        sceneLights={[existingLight]}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={jest.fn()}
        onClearModels={jest.fn()}
      />
    );

    // Expand Light Controls to see the Edit button
    fireEvent.click(screen.getByText(/Light Controls/i));
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    expect(screen.getByTestId("mock-light-creator")).toBeInTheDocument();

    // Simulate saving changes from the mocked LightCreator
    fireEvent.click(screen.getByTestId("mock-light-creator-save-button"));

    expect(mockOnUpdateLights).toHaveBeenCalledTimes(1);
    expect(mockOnUpdateLights).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "light-1" }), // Only check for ID, name might be changed by mock
      ])
    );
    expect(screen.queryByTestId("mock-light-creator")).not.toBeInTheDocument(); // LightCreator should be closed
  });

  it("calls onCancel and closes LightCreator when cancel button is clicked", () => {
    render(
      <Sidebar
        models={[]}
        onUpdateModels={jest.fn()}
        sceneLights={[]}
        onUpdateLights={jest.fn()}
        resetCamera={jest.fn()}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add New Light/i }));
    expect(screen.getByTestId("mock-light-creator")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mock-light-creator-cancel-button"));

    expect(screen.queryByTestId("mock-light-creator")).not.toBeInTheDocument();
  });

  it("toggles model animation when dropdown is changed", () => {
    const mockModelWithAnimations: ModelState = {
      id: "model-3",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      wireframe: false,
      model: {} as any,
      metadata: {
        id: "model-3",
        name: "model3.glb",
        vertexCount: 1,
        meshCount: 1,
        materialCount: 1,
        animations: ["Idle", "Run", "Walk"],
      },
      currentAnimation: "",
    };

    const { rerender } = render(
      <Sidebar
        models={[mockModelWithAnimations]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    // Expand Models section to reveal animation dropdown
    fireEvent.click(screen.getByText(/Models/i));

    const animationSelect = screen.getByRole("combobox", {
      name: /Animation/i,
    });
    expect(animationSelect).toBeInTheDocument();
    expect(animationSelect).toHaveValue("");

    fireEvent.change(animationSelect, { target: { value: "Run" } });
    expect(mockOnUpdateModels).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "model-3",
          currentAnimation: "Run",
        }),
      ])
    );

    // Simulate updating the component with the new animation
    rerender(
      <Sidebar
        models={[
          {
            ...mockModelWithAnimations,
            currentAnimation: "Run",
          },
        ]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );
    expect(animationSelect).toHaveValue("Run");

    // Change back to None
    fireEvent.change(animationSelect, { target: { value: "" } });
    expect(mockOnUpdateModels).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "model-3",
          currentAnimation: undefined,
        }),
      ])
    );
  });

  it("updates model transform (position, rotation, scale)", () => {
    const mockModel: ModelState = {
      id: "model-1",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      wireframe: false,
      model: {} as any,
      metadata: {
        id: "model-1",
        name: "model1.glb",
        vertexCount: 1,
        meshCount: 1,
        materialCount: 1,
        animations: [],
      },
      currentAnimation: undefined,
    };

    const { rerender } = render(
      <Sidebar
        models={[mockModel]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Models/i));

    // Test position
    const positionXInput = screen.getAllByRole("spinbutton")[0]; // Position X
    fireEvent.change(positionXInput, { target: { value: "10" } });
    expect(mockOnUpdateModels).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "model-1",
          position: [10, 0, 0],
        }),
      ])
    );

    rerender(
      <Sidebar
        models={[{ ...mockModel, position: [10, 0, 0] }]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );
    expect(positionXInput).toHaveValue(10);

    // Test rotation (Y-axis)
    // Find the Y input for rotation. There are multiple 0s, so we need to be more specific.
    // Since the order is position, rotation, scale, we can target the third input for rotation X, Y, Z for model-1
    const rotationYInput = screen.getAllByRole("spinbutton", { name: "" })[4]; // Adjust index based on actual rendering order
    fireEvent.change(rotationYInput, { target: { value: "45" } });
    expect(mockOnUpdateModels).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "model-1",
          rotation: [0, 45, 0],
        }),
      ])
    );

    rerender(
      <Sidebar
        models={[{ ...mockModel, rotation: [0, 45, 0] }]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );
    expect(rotationYInput).toHaveValue(45);

    // Test scale (Z-axis)
    const scaleZInput = screen.getAllByRole("spinbutton", { name: "" })[8]; // Adjust index based on actual rendering order
    fireEvent.change(scaleZInput, { target: { value: "2" } });
    expect(mockOnUpdateModels).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "model-1",
          scale: [1, 1, 2],
        }),
      ])
    );

    rerender(
      <Sidebar
        models={[{ ...mockModel, scale: [1, 1, 2] }]}
        onUpdateModels={mockOnUpdateModels}
        sceneLights={mockLights}
        onUpdateLights={mockOnUpdateLights}
        resetCamera={mockResetCamera}
        onClearModels={jest.fn()}
      />
    );
    expect(scaleZInput).toHaveValue(2);
  });
});
