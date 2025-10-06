import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OrdiniPage from "./OrdiniPage";

describe("OrdiniPage", () => {
  it("dovrebbe renderizzare il titolo della pagina", () => {
    render(<OrdiniPage />);
    
    const title = screen.getByTestId("page-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Ordini");
  });

  it("dovrebbe renderizzare il messaggio placeholder", () => {
    render(<OrdiniPage />);
    
    const placeholder = screen.getByText(/Sezione in preparazione/);
    expect(placeholder).toBeInTheDocument();
  });
});
