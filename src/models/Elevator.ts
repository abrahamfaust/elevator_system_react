import { ELEVATOR_DOOR_OPEN_TIME, ELEVATOR_SPEED } from "../services/systemSettings";

export enum ElevatorState {
    IDLE = 'idle',
    MOVING = 'moving',
    DOOR_OPEN = 'door_open',
    ARRIVING = 'arriving'  // New state for the arrival animation
  }
  
  export enum ElevatorDirection {
    UP = 'up',
    DOWN = 'down',
    NONE = 'none'
  }
  
  export class Elevator {
    private id: number;
    private currentFloor: number;
    private targetFloor: number | null;
    private state: ElevatorState;
    private direction: ElevatorDirection;
    private queue: number[];
    static elevatorSound: boolean = true;
    

    static toggleElevatorSound(): void {
      this.elevatorSound = !this.elevatorSound;
    }
    static isElevatorSoundEnabled(): boolean {
      return this.elevatorSound;  
    }  
  
    constructor(id: number, startingFloor: number = 0) {
      this.id = id;
      this.currentFloor = startingFloor;
      this.targetFloor = null;
      this.state = ElevatorState.IDLE;
      this.direction = ElevatorDirection.NONE;
      this.queue = [];
    }

  
    getId(): number {
      return this.id;
    }
  
    getCurrentFloor(): number {
      return this.currentFloor;
    }
  
    getState(): ElevatorState {
      return this.state;
    }
  
    getDirection(): ElevatorDirection {
      return this.direction;
    }
  
    getQueue(): number[] {
      return [...this.queue];
    }

    clearQueue(): void {
      this.queue = []; 
      if (this.getCurrentFloor() !== 0) {
        this.targetFloor = 0; 
      this.state = ElevatorState.MOVING; 
      this.direction = ElevatorDirection.DOWN; 
    }}
  
    getTargetFloor(): number | null {
      return this.targetFloor;
    }
  
    addToQueue(floor: number): void {
      if (this.queue.includes(floor)) {
        return; 
      }
      
      this.queue.push(floor);
      
      if (this.state === ElevatorState.IDLE) {
        this.nextFloorInQueue();
      }
    }
  
    nextFloorInQueue(): void {
  
      this.targetFloor = this.queue[0];
      
      if (this.targetFloor > this.currentFloor) {
        this.direction = ElevatorDirection.UP;
      } else if (this.targetFloor < this.currentFloor) {
        this.direction = ElevatorDirection.DOWN;
      } else {
        this.arriveAtFloor();
        return;
      }
  
      this.state = ElevatorState.MOVING;
    }
  
    updatePosition(): void {
      if (this.state !== ElevatorState.MOVING || this.targetFloor === null) {
        return;
      }
  
      if (this.direction === ElevatorDirection.UP) {
        this.currentFloor++;
      } else if (this.direction === ElevatorDirection.DOWN) {
        this.currentFloor--;
      }
  
      if (this.currentFloor === this.targetFloor) {
        this.arriveAtFloor();
      }
    }
  
    private arriveAtFloor(): void {
      // // Set to ARRIVING state first
      this.state = ElevatorState.ARRIVING;
      
      // Add a small delay before opening the doors to allow the animation to complete
      setTimeout(() => {
        let dingSound: HTMLAudioElement | null = null;
        if (Elevator.elevatorSound) {
          dingSound = new Audio('/ding.mp3');
          dingSound.play().catch(error => console.error('Error playing ding sound:', error));
        }
        
        this.state = ElevatorState.DOOR_OPEN;
        
        // הסרת הקומה הנוכחית מהתור
        this.queue = this.queue.filter(floor => floor !== this.currentFloor);
        
        // לאחר 2 שניות, המשך לקומה הבאה או חזור למצב IDLE
        setTimeout(() => {
          if (this.queue.length > 0) {
            this.nextFloorInQueue();
          } else {
            this.state = ElevatorState.IDLE;
            this.direction = ElevatorDirection.NONE;
            this.targetFloor = null;
          }
          if (dingSound) dingSound.pause();
        }, ELEVATOR_DOOR_OPEN_TIME);
      }, ELEVATOR_SPEED); // 500ms delay to ensure the elevator visually arrives at the floor first
    }
  
    estimateTimeToFloor(floor: number): number {
      if (this.state === ElevatorState.IDLE && this.queue.length === 0) {
        return Math.abs(this.currentFloor - floor) * (ELEVATOR_SPEED / 1000); // המרת מילישניות לשניות
      }
  
      const queueCopy = [...this.queue];
      if (!queueCopy.includes(floor)) {
        queueCopy.push(floor);
      }
  
      // סימולציה של תנועת המעלית
      let time = 0;
      let currentPos = this.currentFloor;
      
      if (this.state === ElevatorState.DOOR_OPEN) {
        time += ELEVATOR_DOOR_OPEN_TIME / 1000; // המרת מילישניות לשניות
      }
      
      for (const nextFloor of queueCopy) {
        time += Math.abs(nextFloor - currentPos) * (ELEVATOR_SPEED / 1000); // המרת מילישניות לשניות
        
        if (nextFloor === floor) {
          return time;
        }
        
        time += ELEVATOR_DOOR_OPEN_TIME / 1000; // המרת מילישניות לשניות
        
        currentPos = nextFloor;
      }
  
      return time;
    }
  }