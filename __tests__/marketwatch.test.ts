import fetch from "node-fetch"
import { DowJones, MarketWatch, Other } from "./mocks/sites"
import { LatestNews } from "../src/scrapers/marketwatch"
import {
	ParsedMarketWatch,
	ParsedDowJones,
	ParsedOther,
} from "./mocks/parsedsites"

jest.mock("node-fetch")

describe("evaluate marketwatch news feed parser", () => {
	it("test marketwatch news channel", async () => {
		;((fetch as unknown) as jest.Mock).mockResolvedValueOnce({
			status: 200,
			text: () => Promise.resolve(MarketWatch),
		})
		await expect(LatestNews("GME")).resolves.toEqual(ParsedMarketWatch)
		expect(fetch).toHaveBeenCalledWith(
			"https://www.marketwatch.com/investing/stock/GME/moreheadlines?channel=MarketWatch&source=ChartingSymbol&pageNumber=0",
		)
	})

	it("test dow jones news channel", async () => {
		;((fetch as unknown) as jest.Mock).mockResolvedValueOnce({
			status: 200,
			text: () => Promise.resolve(DowJones),
		})
		await expect(
			LatestNews("GME", { channel: "DowJonesNetwork" }),
		).resolves.toEqual(ParsedDowJones)
		expect(fetch).toHaveBeenCalledWith(
			"https://www.marketwatch.com/investing/stock/GME/moreheadlines?channel=DowJonesNetwork&source=ChartingSymbol&pageNumber=0",
		)
	})

	it("test 'other' news channel", async () => {
		;((fetch as unknown) as jest.Mock).mockResolvedValueOnce({
			status: 200,
			text: () => Promise.resolve(Other),
		})
		await expect(LatestNews("GME", { channel: "other" })).resolves.toEqual(
			ParsedOther,
		)
		expect(fetch).toHaveBeenCalledWith(
			"https://www.marketwatch.com/investing/stock/GME/moreheadlines?channel=other&source=ChartingSymbol&pageNumber=0",
		)
	})
})
