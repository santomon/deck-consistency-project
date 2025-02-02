import { useDeckStore, useHandConditions, useSpreadOutMainDeck } from "~/store";
import { useState } from "react";
import { evaluateHand, simulateHand } from "~/simulacrum";
import { DEFAULT_HAND_SIZE } from "~/constants";
import { CardEnvironment } from "~/types";

const Simulation = () => {
  const [numberToSimulate, setNumberToSimulate] = useState(10000);
  const spreadOutMainDeck = useSpreadOutMainDeck();
  const { handConditions } = useHandConditions();
  const groups = useDeckStore((state) => state.groups);
  const combos = useDeckStore((state) => state.combos);
  const [handSize, setHandSize] = useState<number>(DEFAULT_HAND_SIZE);

  const handleChangeHandSize = (handSize: string) => {
    if (handSize === "") {
      setHandSize(0);
    }
    const parsedHandSize = Number.parseInt(handSize);
    if (Number.isNaN(parsedHandSize)) {
      return;
    }
    setHandSize(parsedHandSize);
  };
  const handleNumberToSimulateChange = (value: string) => {
    if (value === "") {
      setNumberToSimulate(0);
    }
    const parsedValue = Number.parseInt(value);
    if (Number.isNaN(parsedValue)) {
      return;
    }
    setNumberToSimulate(parsedValue);
  };

  const handleStartSimulation = () => {
    const cardEnvironment: CardEnvironment = {
      cardGroups: groups,
      combos: combos,
    };
    const counts = handConditions.map(() => 0);
    for (let i = 0; i < numberToSimulate; i++) {
      const hand = simulateHand(spreadOutMainDeck, handSize);

      const evaluatedHands = handConditions.map((handCondition) => {
        return evaluateHand(hand, handCondition, cardEnvironment);
      });
      evaluatedHands.forEach((evaluatedHand, index) => {
        if (evaluatedHand && counts[index] !== undefined) {
          counts[index]++;
        }
      });
    }
    console.log(counts);
  };

  return (
    <div>
      Number of Simulations:
      <input
        className={""}
        value={numberToSimulate}
        onChange={(event) => handleNumberToSimulateChange(event.target.value)}
      />
      Hand size:
      <input
        className={""}
        value={handSize}
        onChange={(event) => handleChangeHandSize(event.target.value)}
      />
      <button className={""} onClick={handleStartSimulation}>
        Simulate!
      </button>
    </div>
  );
};

export default Simulation;
