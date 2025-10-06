import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFoundPage from "./NotFoundPage";

// Mock di wouter per i test
vi.mock("wouter", () => ({
  useLocation: () => ["/test", vi.fn()],
}));

describe("NotFoundPage", () => {
  it("dovrebbe renderizzare il titolo 404", () => {
    render(<NotFoundPage />);
    
    const title = screen.getByTestId("page-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("404");
  });

  it("dovrebbe renderizzare i pulsanti di navigazione", () => {
    render(<NotFoundPage />);
    
    const homeButton = screen.getByText("Torna alla Home");
    const articoliButton = screen.getByText("Vai agli Articoli");
    
    expect(homeButton).toBeInTheDocument();
    expect(articoliButton).toBeInTheDocument();
  });
});
