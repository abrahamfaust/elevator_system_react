import React from 'react';
import { Floor as FloorModel } from '../models/Floor';

interface FloorProps {
  floor: FloorModel;
  onCallElevator: (floorNumber: number) => void;
}

const Floor: React.FC<FloorProps> = ({ floor, onCallElevator }) => {
  const floorNumber = floor.getFloorNumber();
  const isElevatorCalled = floor.isElevatorCalled();
  const estimatedWaitTime = floor.getEstimatedWaitTime();

  const handleCallElevator = () => {
    onCallElevator(floorNumber);
  };
  
  return (
    <div className="floor">
      <div className="floor-body">
        <div className="floor-button">
          <button 
            className={`metal linear  ${isElevatorCalled ? 'active-button' : ''}`}
            onClick={handleCallElevator}
          >
            {floorNumber + 1}
          </button>
          
          {/* טיימר עם זמן ההמתנה */}
          {isElevatorCalled && estimatedWaitTime !== null && (
            <div className="timer">
              {estimatedWaitTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Floor;