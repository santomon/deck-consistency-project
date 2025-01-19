import Head from "next/head";
import Link from "next/link";
import * as ydke from "ydke";
import {ChangeEvent, useState} from "react";
import {useQueries, useQuery} from "react-query";
import {CardInfo, YGOCardInfoResponseSchema} from "~/types";

const createPlaceHolderCardInfoResponse = (): CardInfo[] => {
    return []
}

const getCardInfo = async (cardIds?: number[] ) => {
    const commaSeparatedIds = cardIds?.join(',');
    if (!commaSeparatedIds) {
        return createPlaceHolderCardInfoResponse();
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_CIENTVAR_YGO_CARD_INFO_API_BASE_URL}?id=${commaSeparatedIds}`);
    const responseData = YGOCardInfoResponseSchema.parse(await response.json());
    return responseData.data;
}

export default function Home() {
    const [inputValue, setInputValue] = useState(''); // State maintenance


    let ydkeResult;
    try {
        ydkeResult = ydke.parseURL(inputValue); //
        ydkeResult = {
            main: Array.from(ydkeResult.main),
            extra: Array.from(ydkeResult.extra),
            side: Array.from(ydkeResult.side),
        }
    } catch (e) {
        console.error(e);
        ydkeResult = {
            main: new Array<number>(),
            extra: new Array<number>(),
            side: new Array<number>(),
        };
    }

    console.log("ydkeResult", ydkeResult)


    const [mainDeckInfoQueryResult, extraDeckInfoQueryResult, sideDeckInfoQueryResult] = useQueries([
        {
            queryKey: ['cardInfo', ydkeResult?.main],
            queryFn: () => getCardInfo(ydkeResult.main),
            enabled: !!ydkeResult,
        },
        {
            queryKey: ['cardInfo', ydkeResult?.extra],
            queryFn: () => getCardInfo(ydkeResult.extra),
            enabled: !!ydkeResult,
        },
        {
            queryKey: ['cardInfo', ydkeResult?.side],
            queryFn: () => getCardInfo(ydkeResult.side),
            enabled: !!ydkeResult,
        }
    ])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value); // Update state
    };

    const {data: mainDeckInfo, isError: mainDeckQueryError} = mainDeckInfoQueryResult;

    if (mainDeckQueryError || mainDeckInfo === undefined) {
        return (
            <div>
                <h1>Error fetching main deck info</h1>
            </div>
        )
    }

    const mainDeckCards = ydkeResult.main.map((cardId, index) => {
        const card = mainDeckInfo.find((card) => card.id === cardId);
        if (!card) return null;
        return (
            <div key={`card-info-display-${cardId}-${index}`}>
                <h2>{card.name}</h2>
                <img width={120} src={card.card_images[0]?.image_url} alt={card.name} />
            </div>
        )
    }
    )

    return (
      <>
        <Head>
          <title>Deck Consistency Simulation</title>
          <meta name="description" content="Deck Consistency Simulation" />
          {/*<link rel="icon" href="/favicon.ico" />*/}
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="flex flex-col items-center p-4">
            <label
              htmlFor="textInput"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Enter Text
            </label>
            <input
              id="textInput"
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Type something..."
              className="w-80 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
            {mainDeckCards}
        </main>
      </>
    );
}
