import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("dovrebbe renderizzare il titolo BarNode", () => {
    render(<HomePage />);
    
    const title = screen.getByTestId("text-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("BarNode");
  });

  it("dovrebbe renderizzare la descrizione", () => {
    render(<HomePage />);
    
    const subtitle = screen.getByTestId("text-subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent(/Un'applicazione moderna e modulare/);
  });

  it("dovrebbe renderizzare il pulsante Inizia", () => {
    render(<HomePage />);
    
    const button = screen.getByTestId("button-inizia");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Inizia");
  });

  it("dovrebbe renderizzare il logo", () => {
    render(<HomePage />);
    
    const logo = screen.getByTestId("img-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("alt", "BarNode Logo");
  });
});
