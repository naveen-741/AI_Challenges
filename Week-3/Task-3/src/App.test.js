import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  describe("Counter Functionality", () => {
    test("renders counter with initial value of 0", () => {
      expect(screen.getByText("Counter: 0")).toBeInTheDocument();
    });

    test("increments counter when increment button is clicked", () => {
      const incrementButton = screen.getByText("Increment");
      fireEvent.click(incrementButton);
      expect(screen.getByText("Counter: 1")).toBeInTheDocument();
    });

    test("decrements counter when decrement button is clicked", () => {
      const decrementButton = screen.getByText("Decrement");
      fireEvent.click(decrementButton);
      expect(screen.getByText("Counter: -1")).toBeInTheDocument();
    });

    test("counter can be incremented and decremented multiple times", () => {
      const incrementButton = screen.getByText("Increment");
      const decrementButton = screen.getByText("Decrement");

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(screen.getByText("Counter: 2")).toBeInTheDocument();

      fireEvent.click(decrementButton);
      expect(screen.getByText("Counter: 1")).toBeInTheDocument();
    });
  });

  describe("TicTacToe Integration", () => {
    test("renders TicTacToe game board", () => {
      expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
      const squares = screen
        .getAllByRole("button")
        .filter((button) => button.className === "square");
      expect(squares).toHaveLength(9);
    });

    test("TicTacToe game state is independent of counter", () => {
      // Play a move in TicTacToe
      const squares = screen
        .getAllByRole("button")
        .filter((button) => button.className === "square");
      fireEvent.click(squares[0]);
      expect(squares[0]).toHaveTextContent("X");

      // Increment counter
      const incrementButton = screen.getByText("Increment");
      fireEvent.click(incrementButton);
      expect(screen.getByText("Counter: 1")).toBeInTheDocument();

      // TicTacToe state should remain unchanged
      expect(squares[0]).toHaveTextContent("X");
    });
  });

  describe("Component Layout", () => {
    test("renders all main components", () => {
      expect(screen.getByText("React Legacy Template")).toBeInTheDocument();
      expect(screen.getByText("Counter: 0")).toBeInTheDocument();
      expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
    });

    test("renders all interactive elements", () => {
      expect(screen.getByText("Increment")).toBeInTheDocument();
      expect(screen.getByText("Decrement")).toBeInTheDocument();
      expect(screen.getByText("Reset Game")).toBeInTheDocument();
    });
  });
});
