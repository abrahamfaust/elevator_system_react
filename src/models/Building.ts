import { AbstractBuilding } from './AbstractBuilding';
import { Elevator } from './Elevator';
import { Floor } from './Floor';

export class Building extends AbstractBuilding {
  private floors: Floor[];
  private elevators: Elevator[];

  constructor(id: number, numFloors: number, numElevators: number) {
    super(id);
    
    // יצירת קומות
    this.floors = Array.from({ length: numFloors }, (_, index) => {
      return new Floor(index, index);
    });
    
    // יצירת מעליות (כולן מתחילות בקומת הכניסה - קומה 0)
    this.elevators = Array.from({ length: numElevators }, (_, index) => {
      return new Elevator(index, 0);
    });
  }

  getFloors(): Floor[] {
    return this.floors;
  }

  getElevators(): Elevator[] {
    return this.elevators;
  }

  // מחזירה קומה לפי מספר
  getFloorByNumber(floorNumber: number): Floor | undefined {
    return this.floors.find(floor => floor.getFloorNumber() === floorNumber);
  }

  // מחזירה מעלית לפי מזהה
  getElevatorById(elevatorId: number): Elevator | undefined {
    return this.elevators.find(elevator => elevator.getId() === elevatorId);
  }
}