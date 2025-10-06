import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BottomNav } from "./BottomNav";

// Mock di wouter per i test
const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useLocation: () => ["/", mockSetLocation],
  useRoute: () => [true, {}],
}));

describe("BottomNav", () => {
  beforeEach(() => {
    mockSetLocation.mockClear();
  });

  it("dovrebbe renderizzare le 3 voci di navigazione", () => {
    render(<BottomNav />);
    
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Articoli")).toBeInTheDocument();
    expect(screen.getByText("Ordini")).toBeInTheDocument();
  });

  it("dovrebbe evidenziare la voce attiva", () => {
    render(<BottomNav />);
    
    const homeButton = screen.getByLabelText("Vai a Home");
    expect(homeButton).toHaveAttribute("aria-current", "page");
  });

  it("dovrebbe navigare quando si clicca su una voce", () => {
    render(<BottomNav />);
    
    const articoliButton = screen.getByLabelText("Vai a Articoli");
    fireEvent.click(articoliButton);
    
    expect(mockSetLocation).toHaveBeenCalledWith("/articoli");
  });

  it("dovrebbe avere attributi di accessibilità corretti", () => {
    render(<BottomNav />);
    
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Navigazione principale");
    
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute("aria-label");
    });
  });
});
