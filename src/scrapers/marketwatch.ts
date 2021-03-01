import { NewsFeed } from "../utils/ambient"
import { LoadSite } from "../utils/scraperutils"

/** Scrapes News from MarketWatch
 * @param ticker - The ticker of the stock to fetch
 * @param options - @see {@link MarketWatchNewsOptions} for the fetch options
 * @returns A {@link NewsFeed} that includes the news of that specific channel
 * @public
 */
export const LatestNews = async (
	ticker: string,
	options: MarketWatchNewsOptions = { channel: "MarketWatch", page: 0 },
): Promise<NewsFeed[]> => {
	try {
		if (!options.page) options.page = 0
		if (!options.channel) options.channel = "MarketWatch"
		const $ = await LoadSite(
			`https://www.marketwatch.com/investing/stock/${ticker}/moreheadlines?channel=${options.channel}&source=ChartingSymbol&pageNumber=${options.page}`,
		)
		const stories: NewsFeed[] = []
		$(".collection__elements")
			.children()
			.each((_, el) => {
				const childElements = $(el).find(".article__content")
				const articleElement = childElements.find("h3 > a")
				const detailsElement = childElements.find("div")

				//Additional try catch to ignore bad articles
				try {
					const data: NewsFeed = {
						imageURL: $(el)
							.find("figure > a > img")
							.attr("data-srcset")
							?.split(",")
							.slice(-1)[0]
							.split(" ")[0],
						url: articleElement.attr("href"),
						headline: articleElement.text().trim() || "",
						time: detailsElement.find(".article__timestamp").text(),
						author: detailsElement.find(".article__author")?.text(),
						label: detailsElement.find(".article__label")?.text(),
					}

					stories.push(data)
					// eslint-disable-next-line no-empty
				} catch {}
			})
		return stories
	} catch (err) {
		if (err === "404") {
			return Promise.reject("Cannot find news feed")
		}
		if (err === "Error while loading site") {
			return Promise.reject("Cannot load news feed")
		}
		return Promise.reject("Error while parsing news feed")
	}
}

export interface MarketWatchNewsOptions {
	/** The Channel to fetch data from.
	 * @defaultValue The default channel is `MarketWatch`
	 */
	channel?: "DowJonesNetwork" | "other" | "MarketWatch"
	/** The page of news articles to fetch.
	 * @defaultValue Defaults to page `0`
	 */
	page?: number
}
