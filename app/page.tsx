// pages/[id].tsx
import React from "react";
import Image from "next/image";
import { UmbracoApiPage } from "./interfaces/UmbracoInterfaces";
import RenderComponent from "./helpers/RenderComponent"; // Assuming a function that handles recursive rendering

interface PageProps {
  params: {
    idOrPath: string;
  };
}

const Page: React.FC<PageProps> = async () => {
  // { params }
  // const { idOrPath } = params;
  let pageData: UmbracoApiPage;

  try {
    pageData = await GetPageData("", "icon");
    console.log(pageData.total, pageData.items.length)
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className="w-full h-dvh flex flex-col">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-30 flex items-center">
        <div className="w-1/2">
          <h1 className="text-5xl font-bold">
            Download Twoday CVI logos as SVG or JSX
          </h1>
        </div>
        <div>
          <Image
            src="/images/twoday-orange-hexagon.png"
            width={750}
            height={750}
            alt="twoday-element"
          />
        </div>
      </div>
      <div className="pb-4 border border-[rgba(15,23,42,0.08)] shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:pb-0 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center w-full">
          <div className="relative flex-auto">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full appearance-none rounded-lg bg-transparent py-6 pl-12 pr-4 text-base text-slate-900 transition placeholder:text-slate-400 focus:outline-none sm:text-[0.8125rem] sm:leading-6 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
              placeholder="Search Mockups, Logos, Animations..."
              required
            />
          </div>
        </div>
      </div>
      <div className="w-full h-dvh bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-x-6 gap-y-4 pb-16 pt-10 sm:pt-11 md:pt-12">
            {
            pageData.items.map((item, key) => {
              return RenderComponent(item, key)
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

async function GetPageData(
  idOrPath?: string,
  contentTypeFilter?: string,
): Promise<UmbracoApiPage> {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let url = "https://localhost:44355/umbraco/delivery/api/v2/content"; // /${idOrPath}`;
  
  if (idOrPath != null) url += `/${idOrPath}`;

  url += '?take=100'

  if (contentTypeFilter != null) url += `&filter=contentType:${contentTypeFilter}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${(error as Error).message}`);
  }
}

export default Page;
