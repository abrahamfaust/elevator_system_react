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
    static elevatorSound: boolean = false;
    

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
      this.queue = []; // ריקון התור
      if (this.getCurrentFloor() !== 0) {
        this.targetFloor = 0; 
      this.state = ElevatorState.MOVING; // קביעת מצב IDLE
      this.direction = ElevatorDirection.DOWN; // קביעת כיוון NONE
    }}
  
    getTargetFloor(): number | null {
      return this.targetFloor;
    }
  
    // להוספת קומה לתור המעלית
    addToQueue(floor: number): void {
      if (this.queue.includes(floor)) {
        return; // כבר קיימת בתור
      }
      
      this.queue.push(floor);
      
      // אם המעלית במצב IDLE, התחל לנוע לכיוון הקומה הראשונה בתור
      if (this.state === ElevatorState.IDLE) {
        this.moveToNextFloor();
      }
    }
  
    // לעדכון מצב המעלית בעת תנועה
    moveToNextFloor(): void {
      if (this.queue.length === 0) {
        this.state = ElevatorState.IDLE;
        this.direction = ElevatorDirection.NONE;
        this.targetFloor = null;
        return;
      }
  
      // בחירת הקומה הבאה מהתור
      this.targetFloor = this.queue[0];
      
      // קביעת כיוון התנועה
      if (this.targetFloor > this.currentFloor) {
        this.direction = ElevatorDirection.UP;
      } else if (this.targetFloor < this.currentFloor) {
        this.direction = ElevatorDirection.DOWN;
      } else {
        // המעלית כבר בקומה הדרושה
        this.arriveAtFloor();
        return;
      }
  
      this.state = ElevatorState.MOVING;
    }
  
    // עדכון מיקום המעלית בזמן תנועה
    updatePosition(): void {
      if (this.state !== ElevatorState.MOVING || this.targetFloor === null) {
        return;
      }
  
      // התקדמות לכיוון היעד
      if (this.direction === ElevatorDirection.UP) {
        this.currentFloor++;
      } else if (this.direction === ElevatorDirection.DOWN) {
        this.currentFloor--;
      }
  
      // בדיקה אם הגענו ליעד
      if (this.currentFloor === this.targetFloor) {
        this.arriveAtFloor();
      }
    }
  
    // טיפול בהגעה לקומת היעד
    private arriveAtFloor(): void {
      // Set to ARRIVING state first
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
            this.moveToNextFloor();
          } else {
            this.state = ElevatorState.IDLE;
            this.direction = ElevatorDirection.NONE;
            this.targetFloor = null;
          }
          if (dingSound) dingSound.pause();
        }, 2000);
      }, 500); // 500ms delay to ensure the elevator visually arrives at the floor first
    }
  
    // חישוב זמן משוער להגעה לקומה מסוימת (בשניות)
    estimateTimeToFloor(floor: number): number {
      // אם המעלית במצב IDLE ואין קריאות בתור, חישוב ישיר
      if (this.state === ElevatorState.IDLE && this.queue.length === 0) {
        return Math.abs(this.currentFloor - floor) * 0.5; // חצי שניה לקומה
      }
  
      // יצירת עותק של התור הנוכחי
      const queueCopy = [...this.queue];
      if (!queueCopy.includes(floor)) {
        queueCopy.push(floor);
      }
  
      // סימולציה של תנועת המעלית
      let time = 0;
      let currentPos = this.currentFloor;
      
      // אם המעלית במצב DOOR_OPEN, נוסיף 2 שניות לעיכוב
      if (this.state === ElevatorState.DOOR_OPEN) {
        time += 2;
      }
      
      // עבור על כל הקומות בתור לפי הסדר
      for (const nextFloor of queueCopy) {
        // חישוב זמן הנסיעה לקומה הבאה
        time += Math.abs(nextFloor - currentPos) * 0.5; // חצי שניה לקומה
        
        // אם זו הקומה המבוקשת, סיימנו
        if (nextFloor === floor) {
          return time;
        }
        
        // זמן עצירה בקומה
        time += 2; // 2 שניות עיכוב בכל קומה
        
        // עדכון המיקום הנוכחי
        currentPos = nextFloor;
      }
  
      // מקרה חריג - אם הקומה המבוקשת לא נמצאה בסימולציה
      // (לא אמור לקרות כי הוספנו את הקומה לתור)
      return time + Math.abs(currentPos - floor) * 0.5;
    }
  }