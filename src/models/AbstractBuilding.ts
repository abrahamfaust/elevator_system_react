// filepath: c:\Users\faust\OneDrive\Desktop\New folder\elevator_system_react\src\models\AbstractBuilding.ts
import { Elevator } from './Elevator';
import { Floor } from './Floor';

/**
 * AbstractBuilding class - The base class for all building types in the system
 * This provides a common interface that all building implementations must follow
 */
export abstract class AbstractBuilding {
  protected id: number;
  
  constructor(id: number) {
    this.id = id;
  }

  /**
   * Get the unique identifier for this building
   */
  getId(): number {
    return this.id;
  }

  /**
   * Get all floors in the building
   */
  abstract getFloors(): Floor[];

  /**
   * Get all elevators in the building
   */
  abstract getElevators(): Elevator[];

  /**
   * Get a specific floor by its number
   * @param floorNumber The floor number to find
   */
  abstract getFloorByNumber(floorNumber: number): Floor | undefined;

  /**
   * Get a specific elevator by its ID
   * @param elevatorId The elevator ID to find
   */
  abstract getElevatorById(elevatorId: number): Elevator | undefined;
}