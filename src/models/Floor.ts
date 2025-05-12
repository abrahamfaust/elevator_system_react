export class Floor {
  private id: number;
  private floorNumber: number;
  private hasElevatorCalled: boolean;
  private estimatedWaitTime: number | null;

  constructor(id: number, floorNumber: number) {
    this.id = id;
    this.floorNumber = floorNumber;
    this.hasElevatorCalled = false;
    this.estimatedWaitTime = null;
  }

  getId(): number {
    return this.id;
  }

  getFloorNumber(): number {
    return this.floorNumber;
  }

  isElevatorCalled(): boolean {
    return this.hasElevatorCalled;
  }

  // סימון שהוזמנה מעלית לקומה זו
  markElevatorCalled(): void {
    this.hasElevatorCalled = true;
  }

  getEstimatedWaitTime(): string | null {
    if (this.estimatedWaitTime === null) {
      return null;
    }

    // Convert seconds to mm:ss format
    const minutes = Math.floor(this.estimatedWaitTime / 60);
    const seconds = this.estimatedWaitTime % 60;

    // Add leading zeros if needed
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // עדכון זמן המתנה משוער
  updateEstimatedWaitTime(seconds: number): void {
    this.estimatedWaitTime = seconds;
  }

  // איפוס מצב הקריאה עם הגעת המעלית
  resetElevatorCall(): void {
    this.hasElevatorCalled = false;
    this.estimatedWaitTime = null;
  }
}
