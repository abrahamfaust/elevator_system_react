import { Building } from '../models/Building';
import { Elevator } from '../models/Elevator';
import { Floor } from '../models/Floor';
import { ElevatorScheduler } from '../services/ElevatorScheduler';

/**
 * Factory Pattern ליצירת בניינים, קומות ומעליות
 * מאפשר יצירה מרוכזת של אובייקטים עם אפשרות להרחבה עתידית
 */
class BuildingFactory {
  // Store existing building systems to maintain state across updates
  private buildingSystems: Map<number, { building: Building; scheduler: ElevatorScheduler }> = new Map();

  /**
   * יצירת בניין חדש עם קומות ומעליות
   */
  createBuilding(id: number, numFloors: number, numElevators: number): Building {
    return new Building(id, numFloors, numElevators);
  }

  /**
   * יצירת קומה חדשה
   */
  createFloor(id: number, floorNumber: number): Floor {
    return new Floor(id, floorNumber);
  }

  /**
   * יצירת מעלית חדשה
   */
  createElevator(id: number, startingFloor: number = 0): Elevator {
    return new Elevator(id, startingFloor);
  }

  /**
   * יצירת שירות תזמון מעליות לבניין מסוים
   */
  createElevatorScheduler(building: Building): ElevatorScheduler {
    return new ElevatorScheduler(building);
  }

  /**
   * יצירת מערכת בניין שלמה עם מתזמן מעליות
   */
  createBuildingSystem(id: number, numFloors: number, numElevators: number): {
    building: Building;
    scheduler: ElevatorScheduler;
  } {
    // Check if we already have a system for this building id
    const existingSystem = this.buildingSystems.get(id);
    
    // If we have an existing system but the dimensions have changed,
    // we need to create a new building with the updated dimensions
    if (existingSystem) {
      const currentFloors = existingSystem.building.getFloors().length;
      const currentElevators = existingSystem.building.getElevators().length;
      
      // Only create a new building if the dimensions have changed
      if (currentFloors !== numFloors || currentElevators !== numElevators) {
        // Create a new building with the updated dimensions
        const building = this.createBuilding(id, numFloors, numElevators);
        const scheduler = this.createElevatorScheduler(building);
        
        // Save whether the previous scheduler was running
        const wasRunning = existingSystem.scheduler.isRunning();
        
        // Stop the old scheduler
        existingSystem.scheduler.stop();
        
        // Start the new scheduler only if the old one was running
        if (wasRunning) {
          scheduler.start();
        }
        
        const updatedSystem = { building, scheduler };
        this.buildingSystems.set(id, updatedSystem);
        
        return updatedSystem;
      }
      
      return existingSystem;
    }
    
    const building = this.createBuilding(id, numFloors, numElevators);
    const scheduler = this.createElevatorScheduler(building);
    
    // התחלת הסימולציה
    scheduler.start();
    
    const system = { building, scheduler };
    this.buildingSystems.set(id, system);
    
    return system;
  }
  
  /**
   * עדכון מערכת בניין קיימת עם שמירה על מצב המעליות
   */
  updateBuildingSystem(id: number, numFloors: number, numElevators: number): {
    building: Building;
    scheduler: ElevatorScheduler;
  } | null {
    const existingSystem = this.buildingSystems.get(id);
    if (!existingSystem) {
      // אם המערכת לא קיימת, ניצור אותה מחדש
      return this.createBuildingSystem(id, numFloors, numElevators);
    }
    return existingSystem;
  }
}

export default BuildingFactory;