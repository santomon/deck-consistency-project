import Head from "next/head";
import Link from "next/link";
import * as ydke from "ydke";
import { ChangeEvent, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { CardInfo, Tab, YGOCardInfoResponseSchema } from "~/types";
import { useDeckStore } from "~/store";
import { queryKeyFactory } from "~/utils";
import DeckView from "~/components/DeckView";
import { useCardInfoQueries } from "~/queries";
import GroupView from "~/components/GroupView";
import CombosView from "~/components/CombosView";
import HandsConditionView from "~/components/HandsCondition";
import Simulation from "~/components/Simulation";

export default function Home() {
  const [inputValue, setInputValue] = useState(""); // State maintenance
  const [openTab, setOpenTab] = useState<Tab>(Tab.GROUPS);
  const replaceMainDeck = useDeckStore((state) => state.replaceMainDeck);
  useCardInfoQueries();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update state
  };

  const handleOpenTab = (tab: Tab) => {
    setOpenTab(tab);
  };
  const handleYDKEButtonSubmitted = () => {
    let ydkeResult;
    try {
      ydkeResult = ydke.parseURL(inputValue); //
      ydkeResult = {
        main: Array.from(ydkeResult.main),
        extra: Array.from(ydkeResult.extra),
        side: Array.from(ydkeResult.side),
      };
    } catch (e) {
      ydkeResult = {
        main: new Array<number>(),
        extra: new Array<number>(),
        side: new Array<number>(),
      };
    }
    replaceMainDeck(ydkeResult.main);
    setInputValue("");
  };

  return (
    <>
      <Head>
        <title>Deck Consistency Simulation</title>
        <meta name="description" content="Deck Consistency Simulation" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex min-h-screen flex-col justify-start bg-teal-800 p-5">
        <div className="flex flex-col gap-5">
          <div className={"flex flex-row items-center gap-2"}>
            <input
              id="textInput"
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Enter YDKE URL..."
              className="w-80 rounded-md border border-gray-300 py-2 pl-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleYDKEButtonSubmitted}
              className="rounded-md bg-blue-500 p-2 text-white shadow-sm"
            >
              Parse YDKE
            </button>
          </div>
          <div
            className={"flex flex-row justify-start gap-2"}
            data-name={"lower-90%"}
          >
            <div className={"w-1/5 bg-blue-400"}>
              <DeckView />
            </div>
            <div data-name={"right-main-content"} className={"flex-grow"}>
              <ul
                className={"flex flex-row bg-red-500"}
                data-name={"tab-header"}
              >
                <li
                  className={"rounded-t bg-gray-500"}
                  onClick={(e) => handleOpenTab(Tab.GROUPS)}
                >
                  Groups
                </li>
                <li
                  className={"rounded-t bg-gray-700"}
                  onClick={(e) => handleOpenTab(Tab.COMBOS)}
                >
                  Combos
                </li>
                <li
                  className={"rounded-t bg-sky-300"}
                  onClick={(e) => handleOpenTab(Tab.HAND_CONDITIONS)}
                >
                  Hand
                </li>
                <li
                  className={"rounded-t bg-amber-200"}
                  onClick={(e) => handleOpenTab(Tab.SIMULATION)}
                >
                  Simulation
                </li>
              </ul>
              <div data-name={"tab-content"}>
                {(() => {
                  switch (openTab) {
                    case Tab.GROUPS:
                      return <GroupView />;
                    case Tab.COMBOS:
                      return <CombosView />;
                    case Tab.HAND_CONDITIONS:
                      return <HandsConditionView />;
                    case Tab.SIMULATION:
                      return <Simulation />;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
