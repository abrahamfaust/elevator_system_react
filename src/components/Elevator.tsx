import React, { useEffect, useRef } from 'react';
import { Elevator as ElevatorModel, ElevatorState } from '../models/Elevator';
import { ELEVATOR_WIDTH } from '../services/systemSettings';

interface ElevatorProps {
  elevator: ElevatorModel;
  floorHeight: number;
  totalFloors: number;
  shaftIndex: number;
}

const Elevator: React.FC<ElevatorProps> = ({ 
  elevator, 
  floorHeight, 
  totalFloors,
  shaftIndex
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // חישוב מיקום המעלית על בסיס מספר הקומה הנוכחית
  const calculateElevatorPosition = () => {
    // המעלית מוצגת מלמטה למעלה, כך שהקומה התחתונה היא 0
    const bottomPosition = (totalFloors - 1 - elevator.getCurrentFloor()) * floorHeight;
    return bottomPosition;
  };

  useEffect(() => {
    // יצירת אלמנט השמע
    audioRef.current = new Audio('/ding.mp3');
    return () => {
      // ניקוי משאב השמע
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const topPosition = calculateElevatorPosition();
  
  // Determine the elevator's visual state
  const getElevatorStyle = () => {
    const baseStyle = {
      top: `${topPosition}px`,
      backgroundImage: `url(/elv.png)`,
    };
    
    // Apply different visual effects based on elevator state
    if (elevator.getState() === ElevatorState.DOOR_OPEN) {
      return {
        ...baseStyle,
        opacity: 0.7, // Doors open - more transparent
      };
    } else if (elevator.getState() === ElevatorState.ARRIVING) {
      return {
        ...baseStyle,
        opacity: 0.9, // Transitioning - slightly transparent
      };
    } else {
      return {
        ...baseStyle,
        opacity: 1, // Normal - fully opaque
      };
    }
  };
  
  return (
    <div 
      className="elevator-shaft"
      style={{
        left: `${shaftIndex * ELEVATOR_WIDTH}px`
      }}
    >
      <div 
        className="elevator" 
        style={getElevatorStyle()}
      />
    </div>
  );
};

export default Elevator;