import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ArticoliPage from "./ArticoliPage";

describe("ArticoliPage", () => {
  it("dovrebbe renderizzare il titolo della pagina", () => {
    render(<ArticoliPage />);
    
    const title = screen.getByTestId("page-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Articoli");
  });

  it("dovrebbe renderizzare il messaggio placeholder", () => {
    render(<ArticoliPage />);
    
    const placeholder = screen.getByText(/Sezione in preparazione/);
    expect(placeholder).toBeInTheDocument();
  });
});
