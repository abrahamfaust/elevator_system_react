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
  
  // Get elevator door state based on elevator state
  const getElevatorDoorClassName = () => {
    return elevator.getState() === ElevatorState.DOOR_OPEN ? 'doors-open' : 'doors-closed';
  };
  
  // Determine the elevator's visual state
  const getElevatorStyle = () => {
    const baseStyle = {
      top: `${topPosition}px`,
    };
    
    return baseStyle
  };

  // Style for the elevator image
  const elevatorImageStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/elv.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 2, // Place in front of doors
  };
  
  return (
    <div 
      className="elevator-shaft"
      style={{
        left: `calc(${shaftIndex} * var(--elevator-width))`
      }}
    >
      <div 
        className={`elevator ${getElevatorDoorClassName()}`}
        style={getElevatorStyle()}
      >
        {/* Elevator doors behind the elevator image */}
        <div className="elevator-door left"></div>
        <div className="elevator-door right"></div>
        
        {/* Elevator image in front of doors */}
        <div style={elevatorImageStyle}></div>
      </div>
    </div>
  );
};

export default Elevator;