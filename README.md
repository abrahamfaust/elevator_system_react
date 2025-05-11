# 🏢 Elevator System Simulation

A sophisticated elevator system simulation built with React and TypeScript that demonstrates efficient elevator scheduling algorithms and real-time visualization.

![Elevator System](./screenshot.png)

## ✨ Features

- 🏗️ Create multiple buildings with customizable number of floors (2-20) and elevators (1-5)
- 🎬 Real-time animation of elevator movement with smooth transitions
- 🧠 Intelligent elevator scheduling algorithm that minimizes wait times
- ⏱️ Elevator call timer displays estimated wait time
- 🚪 Realistic door opening/closing animations
- 🔊 Sound effects that can be toggled on/off
- 🎮 Individual building controls for starting/stopping/resetting elevators
- 📱 Fully responsive design

## 🏗️ Architecture

The project follows object-oriented programming principles and employs several design patterns:

- **🏭 Factory Pattern**: Used `BuildingFactory` to create and manage buildings, floors and elevators
- **🔄 Model-View Architecture**: Separation between data models and UI components
- **👁️ Observer Pattern**: Components observe and respond to model state changes

### 🧩 Core Components

- **📊 Models**: `Building`, `Floor`, and `Elevator` classes encapsulate core business logic
- **⚙️ ElevatorScheduler**: Implements the elevator scheduling algorithm
- **🖌️ React Components**: Building, Floor, Elevator, ElevatorSystem components handle the UI

### 🧮 Scheduler Algorithm

The elevator scheduling algorithm uses a shortest estimated time approach:
1. When a floor calls an elevator, the system calculates estimated arrival time for each elevator
2. The elevator with the shortest estimated arrival time is selected
3. Each elevator maintains a queue of floor requests
4. Estimated times are continuously updated based on current elevator positions and queues

## 💻 Technologies

- ⚛️ React 19
- 📘 TypeScript 5.7
- ⚡ Vite 6.3
- 🎨 CSS for animations and styling

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18+ and npm

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/abrahamfaust/elevator-system-react.git

# Navigate to project directory
cd elevator_system_react

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application running.

## 📖 Usage

1. Set the desired number of floors and elevators using the controls at the top
2. Click "Create Building" to add a new building to the simulation
3. Click on floor buttons to call elevators
4. Use the building settings (gear icon) to:
   - ▶️ Start/stop elevator movements
   - 🔄 Change building dimensions
   - 🏠 Reset elevators to ground floor
   - 🗑️ Delete buildings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
