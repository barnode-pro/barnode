import { useState } from 'react';
import { WineType } from '../../../hooks/useWines';
import { useAuth } from '../../../contexts/AuthContext';

export interface HomeFilters {
  wineType: string;
  supplier: string;
  showAlertsOnly: boolean;
}

export function useHomeState() {
  // Usa il nuovo AuthContext per lo stato autenticazione
  const { isAuthenticated, user, isAdmin, isMobileDevice } = useAuth();

  // Stato filtri e UI
  const [filters, setFilters] = useState<HomeFilters>({ 
    wineType: '', 
    supplier: '', 
    showAlertsOnly: false 
  });
  
  const [selectedWine, setSelectedWine] = useState<WineType | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showWineDetailsModal, setShowWineDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("TUTTI I VINI");
  const [animatingInventory, setAnimatingInventory] = useState<string | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingWine, setEditingWine] = useState<WineType | null>(null);

  return {
    // Stato autenticazione dal AuthContext
    isAuthenticated,
    user,
    isAdmin,
    isMobileDevice,
    
    // Stato filtri
    filters,
    setFilters,
    
    // Stato UI
    selectedWine,
    setSelectedWine,
    showFilterModal,
    setShowFilterModal,
    showWineDetailsModal,
    setShowWineDetailsModal,
    activeTab,
    setActiveTab,
    animatingInventory,
    setAnimatingInventory,
    showInventoryModal,
    setShowInventoryModal,
    editingWine,
    setEditingWine
  };
}
