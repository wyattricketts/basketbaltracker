import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [shots, setShots] = useState([]);
  const [customParameters, setCustomParameters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced data loading with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load shots
        const savedShots = localStorage.getItem('basketballShots');
        if (savedShots) {
          const parsedShots = JSON.parse(savedShots);
          // Validate data structure
          if (Array.isArray(parsedShots)) {
            setShots(parsedShots);
          }
        }
        
        // Load custom parameters
        const savedParams = localStorage.getItem('customParameters');
        if (savedParams) {
          const parsedParams = JSON.parse(savedParams);
          if (Array.isArray(parsedParams)) {
            setCustomParameters(parsedParams);
          }
        }

        // Load app version for migration handling
        const appVersion = localStorage.getItem('appVersion');
        if (!appVersion) {
          localStorage.setItem('appVersion', '1.0.0');
        }
        
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // If data is corrupted, clear it
        localStorage.removeItem('basketballShots');
        localStorage.removeItem('customParameters');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save with debouncing to prevent excessive writes
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('basketballShots', JSON.stringify(shots));
          localStorage.setItem('lastSaved', new Date().toISOString());
        } catch (error) {
          console.error('Error saving shots:', error);
          // Handle storage quota exceeded
          if (error.name === 'QuotaExceededError') {
            alert('Storage quota exceeded. Consider exporting your data.');
          }
        }
      }, 500); // Debounce saves by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [shots, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('customParameters', JSON.stringify(customParameters));
        } catch (error) {
          console.error('Error saving parameters:', error);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [customParameters, isLoading]);

  // Data management functions
  const addShot = (shotData) => {
    const newShot = { ...shotData, id: Date.now(), timestamp: new Date().toISOString() };
    setShots(prev => [...prev, newShot]);
  };

  const deleteShot = (shotId) => {
    setShots(prev => prev.filter(shot => shot.id !== shotId));
  };

  const clearAllShots = () => {
    if (window.confirm('Are you sure you want to delete all shots? This cannot be undone.')) {
      setShots([]);
      localStorage.removeItem('basketballShots');
    }
  };

  const addCustomParameter = (parameter) => {
    setCustomParameters(prev => [...prev, { ...parameter, id: Date.now() }]);
  };

  const updateCustomParameter = (paramId, updatedParameter) => {
    setCustomParameters(prev => 
      prev.map(param => 
        param.id === paramId ? { ...updatedParameter, id: paramId } : param
      )
    );
  };

  const deleteCustomParameter = (paramId) => {
    setCustomParameters(prev => prev.filter(param => param.id !== paramId));
  };

  // Export/Import functions for backup
  const exportData = () => {
    const data = {
      shots,
      customParameters,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `basketball-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.shots && Array.isArray(data.shots)) {
        setShots(data.shots);
      }
      if (data.customParameters && Array.isArray(data.customParameters)) {
        setCustomParameters(data.customParameters);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const value = {
    shots,
    setShots,
    addShot,
    deleteShot,
    clearAllShots,
    customParameters,
    setCustomParameters,
    addCustomParameter,
    updateCustomParameter,
    deleteCustomParameter,
    exportData,
    importData,
    isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};