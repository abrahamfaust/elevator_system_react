import React, { useEffect, useState, useRef } from 'react';
import Floor from './Floor';
import Elevator from './Elevator';
import { Building as BuildingModel } from '../models/Building';
import { ElevatorScheduler } from '../services/ElevatorScheduler';
import BuildingFactory from '../factories/BuildingFactory';
import * as system from '../services/systemSettings';

interface BuildingProps {
  id: number;
  numFloors: number;
  numElevators: number;
  buildingFactory: BuildingFactory;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, floors: number, elevators: number) => void;
}

const Building: React.FC<BuildingProps> = ({ 
  id, 
  numFloors, 
  numElevators,
  buildingFactory,
  onDelete,
  onUpdate
}) => {
  
  const [buildingSystem, setBuildingSystem] = useState<{
    building: BuildingModel;
    scheduler: ElevatorScheduler;
  } | null>(null);
  
  const [, setRenderTrigger] = useState<number>(0); // טריגר לרינדור מחדש
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [newFloorCount, setNewFloorCount] = useState<number>(numFloors);
  const [newElevatorCount, setNewElevatorCount] = useState<number>(numElevators);
  const [schedulerRunning, setSchedulerRunning] = useState<boolean>(true); // State for scheduler running status
  const [resetActive, setResetActive] = useState<boolean>(false); // State for reset button active status
  
  // Use a ref to track if this is the first render
  const initializedRef = useRef<boolean>(false);


  useEffect(() => {
    // Create the building system only once on mount
    if (!initializedRef.current) {
      const system = buildingFactory.createBuildingSystem(id, numFloors, numElevators);
      setBuildingSystem(system);
      initializedRef.current = true;
    }
    
    // Create interval for UI updates
    const renderInterval = setInterval(() => {
      setRenderTrigger(prev => prev + 1);
    }, 100);
    
    // Clean up on unmount
    return () => {
      clearInterval(renderInterval);
      if (buildingSystem) {
        buildingSystem.scheduler.stop();
      }
    };
  }, [id, buildingFactory]); // Only depend on id and buildingFactory
  
  // Update building system when dimensions change
  useEffect(() => {
    // Update floor and elevator counts in local state
    setNewFloorCount(numFloors);
    setNewElevatorCount(numElevators);
    
    // If already initialized, update the building via the factory
    if (initializedRef.current && buildingSystem) {
      // This will now properly create a new building if dimensions have changed
      const updatedSystem = buildingFactory.createBuildingSystem(id, numFloors, numElevators);
      setBuildingSystem(updatedSystem);
      
      // Update the scheduler running state in our local state
      setSchedulerRunning(updatedSystem.scheduler.isRunning());
    }
  }, [numFloors, numElevators, id, buildingFactory]);
  
  const handleCallElevator = (floorNumber: number) => {
    if (buildingSystem) {
      buildingSystem.scheduler.callElevator(floorNumber);
    }
  };

  const handleResetElevators = () => {
    if (buildingSystem) {
      setResetActive(true);
      
      // Store the previous scheduler state
      const wasRunning = buildingSystem.scheduler.isRunning();
      
      // Reset all floor buttons and timers
      const floors = buildingSystem.building.getFloors();
      floors.forEach(floor => {
        floor.resetElevatorCall();
      });
      
      // Just clear all elevator queues - this also sets target to ground floor
      const elevators = buildingSystem.building.getElevators();
      elevators.forEach(elevator => {
        elevator.clearQueue();
      });
        // Make sure the scheduler is running to process commands
        if (!wasRunning) {
          buildingSystem.scheduler.start();
        }
      
      // Set up an interval to check if all elevators have reached the ground floor
      const checkInterval = setInterval(() => {
        const allAtGroundFloor = elevators.every(
          elevator => elevator.getCurrentFloor() === 0 && elevator.getState() === 'idle'
        );
        
        if (allAtGroundFloor) {
          // All elevators have reached ground floor and are idle
          clearInterval(checkInterval);
          
          // Restore previous scheduler state
          if (!wasRunning) {
            buildingSystem.scheduler.stop();
          }
          
          // Turn off the reset button active state
          setResetActive(false);
        }
      }, 1000); // Check every second
    }
  };

  const handleUpdateBuilding = () => {
    if (onUpdate) {
      onUpdate(id, newFloorCount, newElevatorCount);
      setShowSettings(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };
  
  if (!buildingSystem) {
    return <div>טוען בניין...</div>;
  }
  
  const { building } = buildingSystem;
  const floors = building.getFloors();
  const elevators = building.getElevators();
  
  return (
    <div 
      className="building"
      style={{ 
        height: `${numFloors * system.FLOOR_HEIGHT}px`,
        width: `calc(${numElevators} * var(--elevator-width) + 132px)` // רוחב פיר מעלית + מרווח לכפתורים
      }}
    >
      {/* Floating settings button */}
      <button 
        className="building-settings-button"
        onClick={toggleSettings}
      >
        ⚙️
      </button>

      {/* Settings modal */}
      {showSettings && (
        <div className="building-settings-modal">
          <div className="building-settings-header">
            <h3>הגדרות בניין</h3>
            <button onClick={toggleSettings}>✕</button>
          </div>
          <div className="building-settings-content">
            <div className="settings-group">
              <h4>בקרת מעליות</h4>
              <div className="settings-controls">
                <label className={schedulerRunning ? 'active-radio' : ''}>
                  <input
                    type="radio"
                    name={`scheduler-control-${id}`}
                    checked={schedulerRunning}
                    onChange={() => {
                      buildingSystem?.scheduler.start();
                      setSchedulerRunning(true);
                    }}
                  />
                  <span>התחל</span>
                </label>
                <label className={!schedulerRunning ? 'active-radio' : ''}>
                  <input
                    type="radio"
                    name={`scheduler-control-${id}`}
                    checked={!schedulerRunning}
                    onChange={() => {
                      buildingSystem?.scheduler.stop();
                      setSchedulerRunning(false);
                    }}
                  />
                  <span>עצור</span>
                </label>
                <button
                  className={resetActive ? 'reset-active' : ''}
                  onClick={() => {
                    handleResetElevators();
                    setResetActive(true);
                    // setTimeout(() => setResetActive(false), 500);
                  }}
                >
                  איפוס מעליות לקומת כניסה
                </button>
              </div>
            </div>
            
            <div className="settings-group">
              <h4>הגדרות מבנה</h4>
              <div className="settings-input-group">
                <label htmlFor={`floors-${id}`}>מספר קומות:</label>
                <input
                  id={`floors-${id}`}
                  type="number"
                  min={system.MIN_FLOORS}
                  max={system.MAX_FLOORS}
                  value={newFloorCount}
                  onChange={(e) => setNewFloorCount(Math.max(system.MIN_FLOORS, Math.min(system.MAX_FLOORS, parseInt(e.target.value) || system.DEFAULT_FLOORS)))}
                />
                
                <label htmlFor={`elevators-${id}`}>מספר מעליות:</label>
                <input
                  id={`elevators-${id}`}
                  type="number"
                  min={system.MIN_ELEVATORS}
                  max={system.MAX_ELEVATORS}
                  value={newElevatorCount}
                  onChange={(e) => setNewElevatorCount(Math.max(system.MIN_ELEVATORS, Math.min(system.MAX_ELEVATORS, parseInt(e.target.value) || system.DEFAULT_ELEVATORS)))}
                />
                
                <button 
                  onClick={handleUpdateBuilding}
                  disabled={newFloorCount === numFloors && newElevatorCount === numElevators}
                >
                  עדכן
                </button>
              </div>
            </div>
            
            <div className="settings-group danger-zone">
              <h4>אזור סכנה</h4>
              <button 
                className="delete-button"
                onClick={() => onDelete && onDelete(id)}
              >
                מחק בניין
              </button>
            </div>
          </div>
        </div>
      )}

      {/* הצגת כל הקומות */}
      {floors.map((floor) => (
        <Floor
          key={floor.getId()}
          floor={floor}
          onCallElevator={handleCallElevator}
        />
      ))}
      
      {/* הצגת כל המעליות */}
      {elevators.map((elevator, index) => (
        <Elevator
          key={elevator.getId()}
          elevator={elevator}
          floorHeight={system.FLOOR_HEIGHT}
          totalFloors={numFloors}
          shaftIndex={index}
        />
      ))}
    </div>
  );
};

export default Building;