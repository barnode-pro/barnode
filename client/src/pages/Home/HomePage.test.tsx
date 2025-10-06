import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("dovrebbe renderizzare il titolo della pagina", () => {
    render(<HomePage />);
    
    const title = screen.getByTestId("page-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("BarNode");
  });

  it("dovrebbe renderizzare la descrizione", () => {
    render(<HomePage />);
    
    const description = screen.getByText(/Dashboard principale/);
    expect(description).toBeInTheDocument();
  });

  it("dovrebbe renderizzare il messaggio placeholder", () => {
    render(<HomePage />);
    
    const placeholder = screen.getByText(/Sezione in preparazione/);
    expect(placeholder).toBeInTheDocument();
  });
});
