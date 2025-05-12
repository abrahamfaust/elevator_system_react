import { AbstractBuilding } from '../models/AbstractBuilding';
import { Elevator, ElevatorState } from '../models/Elevator';
import { ELEVATOR_SPEED } from './systemSettings';

export class ElevatorScheduler {
  private building: AbstractBuilding;
  private updateInterval: number;
  private intervalId: number | null;

  constructor(building: AbstractBuilding) {
    this.building = building;
    this.updateInterval = ELEVATOR_SPEED; // עדכון כל חצי שניה לסימולציה חלקה
    this.intervalId = null;
  }

  start(): void {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => this.update(), this.updateInterval);
    }
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  callElevator(floorNumber: number): void {
    const floor = this.building.getFloorByNumber(floorNumber);
    if (!floor) return;

    if (floor.isElevatorCalled()) {
      return;
    }   

    floor.markElevatorCalled();

    const { elevator: bestElevator, estimatedTime } = this.findBestElevator(floorNumber);
    if (bestElevator) {
      bestElevator.addToQueue(floorNumber); 
      floor.updateEstimatedWaitTime(Math.ceil(estimatedTime));
    }
  }

  private update(): void {
    const elevators = this.building.getElevators();
    const floors = this.building.getFloors();

    floors.forEach(floor => {
      if (floor.isElevatorCalled()) {
        const floorNumber = floor.getFloorNumber();
        
        const elevatorArrived = elevators.some(elevator => 
          elevator.getCurrentFloor() === floorNumber && 
          elevator.getState() === ElevatorState.DOOR_OPEN
        );

        if (elevatorArrived) {
          floor.resetElevatorCall();
        } else {
          const { elevator: bestElevator, estimatedTime } = this.findBestElevator(floorNumber);
          if (bestElevator) {
            floor.updateEstimatedWaitTime(Math.ceil(estimatedTime));
          }
        }
      }
    });

    elevators.forEach(elevator => {
      elevator.updatePosition();
    });
  }

  private findBestElevator(floorNumber: number): {elevator: Elevator | null, estimatedTime: number} {
    const elevators = this.building.getElevators();
    if (elevators.length === 0) return { elevator: null, estimatedTime: 0 };

    const elevatorOnFloor = elevators.filter(elevator => elevator.getCurrentFloor() === floorNumber)[0];
    if (elevatorOnFloor) return { elevator: elevatorOnFloor, estimatedTime: 0 };

    let bestElevator: Elevator | null = null;
    let shortestTime = Number.MAX_VALUE;

    // בדיקת כל המעליות ובחירת זו עם זמן ההגעה הקצר ביותר
    elevators.forEach(elevator => {
      const estimatedTime = elevator.estimateTimeToFloor(floorNumber);
      
      if (estimatedTime < shortestTime) {
        shortestTime = estimatedTime;
        bestElevator = elevator;
      }
    });

    return { elevator: bestElevator, estimatedTime: shortestTime };
  }
}