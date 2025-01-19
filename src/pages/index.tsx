import Head from "next/head";
import Link from "next/link";
import * as ydke from "ydke";
import {ChangeEvent, useState} from "react";
import {useQueries, useQuery} from "react-query";
import {YGOCardInfoResponseSchema} from "~/types";

const createPlaceHolderCardInfoResponse = () => {
    return { data: []}
}

export default function Home() {
    const [inputValue, setInputValue] = useState(''); // State maintenance

    const {data: ydkeResult, isSuccess} = useQuery(['ydke', inputValue], async () => {
        return ydke.parseURL(inputValue);
    }, {enabled: inputValue.length > 0, initialData: {main: new Uint32Array(), extra: new Uint32Array(), side: new Uint32Array()} });
    console.log("ydke result", ydkeResult);
    console.log(process.env.NEXT_PUBLIC_CIENTVAR_YGO_CARD_INFO_API_BASE_URL)

    const getCardInfo = async (cardIds?: Uint32Array ) => {
        const commaSeparatedIds = cardIds?.join(',');
        const response = await fetch(`${process.env.NEXT_PUBLIC_CIENTVAR_YGO_CARD_INFO_API_BASE_URL}?id=${commaSeparatedIds}`);
        const responseData = YGOCardInfoResponseSchema.parse(await response.json());
        return responseData.data;
    }

    const [mainDeckInfoQueryResult, extraDeckInfoQueryResult, sideDeckInfoQueryResult] = useQueries([
        {
            queryKey: ['cardInfo', ydkeResult?.main],
            queryFn: () => getCardInfo(ydkeResult?.main),
            enabled: isSuccess,
        },
        {
            queryKey: ['cardInfo', ydkeResult?.extra],
            queryFn: () => getCardInfo(ydkeResult?.extra),
            enabled: isSuccess,
        },
        {
            queryKey: ['cardInfo', ydkeResult?.side],
            queryFn: () => getCardInfo(ydkeResult?.side),
            enabled: isSuccess,
        }
    ])
    console.log("mainDeckInfo", mainDeckInfoQueryResult);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value); // Update state
    };
  return (
    <>
      <Head>
        <title>Deck Consistency Simulation</title>
        <meta name="description" content="Deck Consistency Simulation" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="flex flex-col items-center p-4">
              <label htmlFor="textInput" className="mb-2 text-lg font-medium text-gray-700">
                  Enter Text
              </label>
              <input
                  id="textInput"
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Type something..."
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
              />
              <p className="mt-4 text-gray-600">
                  You typed: <span className="font-semibold">{inputValue}</span>
              </p>
          </div>
      </main>
    </>
  );
}
