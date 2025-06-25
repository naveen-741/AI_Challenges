import { render, screen, fireEvent } from "@testing-library/react";
import { LightCreator } from "./LightCreator";
import type { LightSource, LightType } from "../types/model";

// Removed jest.mock for LightCreator to test the actual component

describe("LightCreator", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default values", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText("Name")).toHaveValue("New Light");
    expect(screen.getByLabelText("Type")).toHaveValue("directional");
    expect(screen.getByLabelText("Color")).toHaveValue("#ffffff");
    expect(screen.getByLabelText("Intensity")).toHaveValue(1);
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Light" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("renders in edit mode with provided light values", () => {
    const mockLight: LightSource = {
      id: "light-1",
      name: "Edited Light",
      type: "point" as LightType,
      color: "#ff0000",
      intensity: 0.8,
      position: [1, 2, 3],
      distance: 10,
      decay: 2,
    };
    render(
      <LightCreator
        light={mockLight}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Edit Light Source")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Edited Light");
    expect(screen.getByLabelText("Type")).toHaveValue("point");
    expect(screen.getByLabelText("Color")).toHaveValue("#ff0000");
    expect(screen.getByLabelText("Intensity")).toHaveValue(0.8);
    expect(screen.getByLabelText("Distance")).toHaveValue(10);
    expect(screen.getByLabelText("Decay")).toHaveValue(2);
  });

  it("updates input values correctly", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "My Custom Light" },
    });
    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "spot" },
    });
    fireEvent.change(screen.getByLabelText("Color"), {
      target: { value: "#00ff00" },
    });
    fireEvent.change(screen.getByLabelText("Intensity"), {
      target: { value: "0.5" },
    });

    expect(screen.getByLabelText("Name")).toHaveValue("My Custom Light");
    expect(screen.getByLabelText("Type")).toHaveValue("spot");
    expect(screen.getByLabelText("Color")).toHaveValue("#00ff00");
    expect(screen.getByLabelText("Intensity")).toHaveValue(0.5);
  });

  it("calls onSave when Add Light button is clicked", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test Create Light" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Light" }));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Create Light",
        type: "directional",
        color: "#ffffff",
        intensity: 1,
        position: [0, 0, 0],
        target: [0, 0, 0],
      })
    );
  });

  it("calls onSave when Save Changes button is clicked", () => {
    const mockLight: LightSource = {
      id: "light-1",
      name: "Existing Light",
      type: "point" as LightType,
      color: "#ff0000",
      intensity: 0.8,
      position: [1, 2, 3],
      distance: 10,
      decay: 2,
    };
    render(
      <LightCreator
        light={mockLight}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated Edited Light" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockLight,
        name: "Updated Edited Light",
      })
    );
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("conditionally renders distance and decay for point light", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "point" },
    });

    expect(screen.getByLabelText("Distance")).toBeInTheDocument();
    expect(screen.getByLabelText("Decay")).toBeInTheDocument();
    expect(screen.queryByLabelText("Target Position")).not.toBeInTheDocument();
  });

  it("conditionally renders angle, penumbra, and target for spot light", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "spot" },
    });

    expect(screen.getByLabelText("Angle")).toBeInTheDocument();
    expect(screen.getByLabelText("Penumbra")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Y")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Z")).toBeInTheDocument();
  });

  it("conditionally renders target for directional light", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Default type is directional, so target should be present initially
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "ambient" },
    });
    expect(
      screen.queryByLabelText("Target Position X")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "directional" },
    });
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();
  });

  it("conditionally renders position inputs for non-ambient lights", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Default type is directional, so position should be present initially
    expect(screen.getByLabelText("Position X")).toBeInTheDocument();
    expect(screen.getByLabelText("Position Y")).toBeInTheDocument();
    expect(screen.getByLabelText("Position Z")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "ambient" },
    });
    expect(screen.queryByLabelText("Position X")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Position Y")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Position Z")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "point" },
    });
    expect(screen.getByLabelText("Position X")).toBeInTheDocument();
    expect(screen.getByLabelText("Position Y")).toBeInTheDocument();
    expect(screen.getByLabelText("Position Z")).toBeInTheDocument();
  });

  it("updates position values correctly", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);
    const positionInputs = [
      screen.getByLabelText("Position X"),
      screen.getByLabelText("Position Y"),
      screen.getByLabelText("Position Z"),
    ];

    fireEvent.change(positionInputs[0], { target: { value: "10" } });
    expect(positionInputs[0]).toHaveValue(10);

    fireEvent.change(positionInputs[1], { target: { value: "20" } });
    expect(positionInputs[1]).toHaveValue(20);

    fireEvent.change(positionInputs[2], { target: { value: "30" } });
    expect(positionInputs[2]).toHaveValue(30);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Light|Save Changes/i })
    );
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ position: [10, 20, 30] })
    );
  });

  it("conditionally renders target for directional and spot light", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Default type is directional, so target should be present initially
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Y")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Z")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "ambient" },
    });
    expect(
      screen.queryByLabelText("Target Position X")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Target Position Y")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Target Position Z")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "point" },
    });
    expect(
      screen.queryByLabelText("Target Position X")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Target Position Y")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Target Position Z")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "directional" },
    });
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Y")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Z")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "spot" },
    });
    expect(screen.getByLabelText("Target Position X")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Y")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Position Z")).toBeInTheDocument();
  });

  it("updates target position values correctly", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Ensure directional light is selected to show target inputs
    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "directional" },
    });

    const targetInputs = [
      screen.getByLabelText("Target Position X"),
      screen.getByLabelText("Target Position Y"),
      screen.getByLabelText("Target Position Z"),
    ];

    fireEvent.change(targetInputs[0], { target: { value: "1" } });
    expect(targetInputs[0]).toHaveValue(1);

    fireEvent.change(targetInputs[1], { target: { value: "2" } });
    expect(targetInputs[1]).toHaveValue(2);

    fireEvent.change(targetInputs[2], { target: { value: "3" } });
    expect(targetInputs[2]).toHaveValue(3);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Light|Save Changes/i })
    );
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ target: [1, 2, 3] })
    );
  });

  it("conditionally renders distance and decay for point and spot light", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Default type is directional, so distance and decay should not be present
    expect(screen.queryByLabelText("Distance")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Decay")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "ambient" },
    });
    expect(screen.queryByLabelText("Distance")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Decay")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "directional" },
    });
    expect(screen.queryByLabelText("Distance")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Decay")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "point" },
    });
    expect(screen.getByLabelText("Distance")).toBeInTheDocument();
    expect(screen.getByLabelText("Decay")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "spot" },
    });
    expect(screen.getByLabelText("Distance")).toBeInTheDocument();
    expect(screen.getByLabelText("Decay")).toBeInTheDocument();
  });

  it("updates distance and decay values correctly", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Ensure point light is selected to show distance and decay inputs
    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "point" },
    });

    fireEvent.change(screen.getByLabelText("Distance"), {
      target: { value: "5" },
    });
    expect(screen.getByLabelText("Distance")).toHaveValue(5);

    fireEvent.change(screen.getByLabelText("Decay"), {
      target: { value: "0.5" },
    });
    expect(screen.getByLabelText("Decay")).toHaveValue(0.5);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Light|Save Changes/i })
    );
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ distance: 5, decay: 0.5 })
    );
  });

  it("conditionally renders angle and penumbra for spot light", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Default type is directional, so angle and penumbra should not be present
    expect(screen.queryByLabelText("Angle")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Penumbra")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "ambient" },
    });
    expect(screen.queryByLabelText("Angle")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Penumbra")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "directional" },
    });
    expect(screen.queryByLabelText("Angle")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Penumbra")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "point" },
    });
    expect(screen.queryByLabelText("Angle")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Penumbra")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "spot" },
    });
    expect(screen.getByLabelText("Angle")).toBeInTheDocument();
    expect(screen.getByLabelText("Penumbra")).toBeInTheDocument();
  });

  it("updates angle and penumbra values correctly", () => {
    render(<LightCreator onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Ensure spot light is selected to show angle and penumbra inputs
    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "spot" },
    });

    fireEvent.change(screen.getByLabelText("Angle"), {
      target: { value: "0.5" },
    });
    expect(screen.getByLabelText("Angle")).toHaveValue(0.5);

    fireEvent.change(screen.getByLabelText("Penumbra"), {
      target: { value: "0.1" },
    });
    expect(screen.getByLabelText("Penumbra")).toHaveValue(0.1);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Light|Save Changes/i })
    );
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ angle: 0.5, penumbra: 0.1 })
    );
  });
});
