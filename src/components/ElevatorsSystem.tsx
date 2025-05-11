import { useState, useMemo } from "react";
import { TBuilding } from "../types/types";
import Building from "./Building";
import BuildingFactory from "../factories/BuildingFactory";
import * as system from "../services/systemSettings";
import { Elevator } from "../models/Elevator";
import "../styles/settings.css";

export const ElevatorsSystem = () => {

    const [buildings, setBuildings] = useState<TBuilding[]>([]);
    const [floorCount, setFloorCount] = useState<number>(system.DEFAULT_FLOORS);
    const [elevatorCount, setElevatorCount] = useState<number>(
      system.DEFAULT_ELEVATORS
    );
    const [elevatorSound, setElevatorSound] = useState<boolean>(
      Elevator.isElevatorSoundEnabled()
    );
  
    // Create a single BuildingFactory instance that will be reused
    const buildingFactory = useMemo(() => new BuildingFactory(), []);
  
    // Use the system CSS variables hook
    system.useSystemCssVars();
  
    const handleCreateBuilding = () => {
      // יצירת מזהה ייחודי לבניין
      const buildingId = Date.now() + Math.floor(Math.random() * 1000);
      setBuildings([
        ...buildings,
        {
          id: buildingId,
          floors: floorCount,
          elevators: elevatorCount,
        },
      ]);
    };
  
    const handleDeleteBuilding = (id: number) => {
      setBuildings(buildings.filter((building) => building.id !== id));
    };
  
    const handleUpdateBuilding = (
      id: number,
      floors: number,
      elevators: number
    ) => {
      setBuildings(
        buildings.map((building) =>
          building.id === id ? { ...building, floors, elevators } : building
        )
      );
    };
  
    return (
      <div className="container">
        <h1>מערכת מעליות</h1>
        <button
          className="elevator-sound-button"
          style={{
            backgroundColor: elevatorSound ? "" : "gray",
          }}
          onClick={() => {
            Elevator.toggleElevatorSound();
            setElevatorSound(Elevator.isElevatorSoundEnabled());
          }}
        >
          <span>{elevatorSound ? "🔊" : "🔇"}</span> שמע
        </button>
  
        <div className="controls">
          <label htmlFor="floors">מספר קומות:</label>
          <input
            type="number"
            id="floors"
            min={system.MIN_FLOORS}
            max={system.MAX_FLOORS}
            value={floorCount}
            onChange={(e) =>
              setFloorCount(
                Math.max(
                  system.MIN_FLOORS,
                  Math.min(
                    system.MAX_FLOORS,
                    parseInt(e.target.value) || system.DEFAULT_FLOORS
                  )
                )
              )
            }
          />
  
          <label htmlFor="elevators">מספר מעליות:</label>
          <input
            type="number"
            id="elevators"
            min={system.MIN_ELEVATORS}
            max={system.MAX_ELEVATORS}
            value={elevatorCount}
            onChange={(e) =>
              setElevatorCount(
                Math.max(
                  system.MIN_ELEVATORS,
                  Math.min(
                    system.MAX_ELEVATORS,
                    parseInt(e.target.value) || system.DEFAULT_ELEVATORS
                  )
                )
              )
            }
          />
  
          <button onClick={handleCreateBuilding}>צור בניין</button>
        </div>
  
        <div className="buildings-container">
          {buildings.map((building) => (
            <Building
              key={building.id}
              id={building.id}
              numFloors={building.floors}
              numElevators={building.elevators}
              buildingFactory={buildingFactory}
              onDelete={handleDeleteBuilding}
              onUpdate={handleUpdateBuilding}
            />
          ))}
        </div>
      </div>
    );
}