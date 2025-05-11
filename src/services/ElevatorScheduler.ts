import { Building } from '../models/Building';
import { Elevator, ElevatorState } from '../models/Elevator';

export class ElevatorScheduler {
  private building: Building;
  private updateInterval: number;
  private intervalId: number | null;

  constructor(building: Building) {
    this.building = building;
    this.updateInterval = 500; // עדכון כל חצי שניה לסימולציה חלקה
    this.intervalId = null;
  }

  // התחלת הסימולציה
  start(): void {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => this.update(), this.updateInterval);
    }
  }

  // עצירת הסימולציה
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // בדיקה האם המתזמן פעיל כרגע
  isRunning(): boolean {
    return this.intervalId !== null;
  }

  // הזמנת מעלית לקומה מסוימת
  callElevator(floorNumber: number): void {
    const floor = this.building.getFloorByNumber(floorNumber);
    if (!floor) return;

    // אם כבר הוזמנה מעלית לקומה זו, אין צורך להזמין שוב
    if (floor.isElevatorCalled()) {
      return;
    }   

    // סימון שהוזמנה מעלית לקומה זו
    floor.callElevator();

    // בחירת המעלית המתאימה ביותר לטפל בקריאה
    const bestElevator = this.findBestElevator(floorNumber);
    if (bestElevator) {
      bestElevator.addToQueue(floorNumber); // הוספת הקומה לתור המעלית
      
      // חישוב זמן משוער להגעה לקומה
      const estimatedTime = bestElevator.estimateTimeToFloor(floorNumber);
      floor.updateEstimatedWaitTime(Math.ceil(estimatedTime));
    }
  }

  // עדכון מצב המעליות
  private update(): void {
    const elevators = this.building.getElevators();
    const floors = this.building.getFloors();

    // עדכון מצב וזמני המתנה לכל הקומות עם קריאות פעילות
    floors.forEach(floor => {
      if (floor.isElevatorCalled()) {
        const floorNumber = floor.getFloorNumber();
        
        // בדיקה אם מעלית הגיעה לקומה זו
        const elevatorArrived = elevators.some(elevator => 
          elevator.getCurrentFloor() === floorNumber && 
          elevator.getState() === ElevatorState.DOOR_OPEN
        );

        if (elevatorArrived) {
          // איפוס מצב הקריאה
          floor.resetElevatorCall();
        } else {
          // עדכון זמן ההמתנה המשוער
          const bestElevator = this.findBestElevator(floorNumber);
          if (bestElevator) {
            const estimatedTime = bestElevator.estimateTimeToFloor(floorNumber);
            floor.updateEstimatedWaitTime(Math.ceil(estimatedTime));
          }
        }
      }
    });

    // עדכון מיקום כל המעליות
    elevators.forEach(elevator => {
      elevator.updatePosition();
    });
  }

  // מציאת המעלית המתאימה ביותר לטפל בקריאה
  private findBestElevator(floorNumber: number): Elevator | null {
    const elevators = this.building.getElevators();
    if (elevators.length === 0) return null;

    const elevatorOnFloor = elevators.filter(elevator => elevator.getCurrentFloor() === floorNumber)[0];
    if (elevatorOnFloor) return elevatorOnFloor; // אם יש מעלית בקומה, אין צורך להזמין אחת נוספת

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

    return bestElevator;
  }
}