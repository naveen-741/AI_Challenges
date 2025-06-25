import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TicTacToe from "./TicTacToe";

describe("TicTacToe Component", () => {
  beforeEach(() => {
    render(<TicTacToe />);
  });

  test("renders game board with 9 squares", () => {
    const squares = screen
      .getAllByRole("button")
      .filter((button) => button.className === "square");
    expect(squares).toHaveLength(9);
  });

  test("shows X as first player", () => {
    expect(screen.getByText("Next player: X")).toBeInTheDocument();
  });

  test("alternates between X and O players", () => {
    const squares = screen
      .getAllByRole("button")
      .filter((button) => button.className === "square");

    // First move - X
    fireEvent.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X");
    expect(screen.getByText("Next player: O")).toBeInTheDocument();

    // Second move - O
    fireEvent.click(squares[1]);
    expect(squares[1]).toHaveTextContent("O");
    expect(screen.getByText("Next player: X")).toBeInTheDocument();
  });

  test("prevents playing on already filled squares", () => {
    const squares = screen
      .getAllByRole("button")
      .filter((button) => button.className === "square");

    // First move - X
    fireEvent.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X");

    // Try to play on same square
    fireEvent.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X"); // Should not change
  });

  test("detects winner correctly", () => {
    const squares = screen
      .getAllByRole("button")
      .filter((button) => button.className === "square");

    // X wins with first row
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X

    expect(screen.getByText("Winner: X")).toBeInTheDocument();
  });

  test("detects draw correctly", () => {
    const squares = screen
      .getAllByRole("button")
      .filter((button) => button.className === "square");

    // Play moves that result in a draw
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[1]); // O
    fireEvent.click(squares[2]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[4]); // X
    fireEvent.click(squares[6]); // O
    fireEvent.click(squares[5]); // X
    fireEvent.click(squares[8]); // O
    fireEvent.click(squares[7]); // X

    expect(screen.getByText("Game Draw!")).toBeInTheDocument();
  });

  test("reset button clears the board", () => {
    const squares = screen
      .getAllByRole("button")
      .filter((button) => button.className === "square");
    const resetButton = screen.getByText("Reset Game");

    // Make some moves
    fireEvent.click(squares[0]);
    fireEvent.click(squares[1]);

    // Reset the game
    fireEvent.click(resetButton);

    // Check if board is cleared
    squares.forEach((square) => {
      expect(square).toHaveTextContent("");
    });
    expect(screen.getByText("Next player: X")).toBeInTheDocument();
  });
});
