import { useHandConditions } from "~/store";
import { useState } from "react";
import { simulateHand } from "~/simulacrum";

const Simulation = () => {
  const [numberToSimulate, setNumberToSimulate] = useState(10000);

  const handleNumberToSimulateChange = (value: string) => {
      if (Number.isInteger(value)) {
          setNumberToSimulate(Number.parseInt(value))
      }
  };

    const handleStartSimulation = () => {

        for (let i = 0; i < numberToSimulate; i++) {
            simulateHand()
        }

    }

  const { handConditions } = useHandConditions();
  return (
    <div>
        Number of Simulations:
      <input
          className={""}
        value={numberToSimulate}
        onChange={(event) => handleNumberToSimulateChange(event.target.value)}
      />
        <button
        className={""}
        onClick={() => {

        }}>
            Simulate!
        </button>
    </div>
  );
};

export default Simulation;
