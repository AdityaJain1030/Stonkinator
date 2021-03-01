import fetch from "node-fetch"
import { LoadSite } from "../src/utils/scraperutils"
import { MarketWatch } from "./mocks/sites"

jest.mock("node-fetch")

describe("evaluating site loader", () => {
	it("fetch resolves", async () => {
		;((fetch as unknown) as jest.Mock).mockResolvedValueOnce({
			status: 200,
			text: () => Promise.resolve(MarketWatch),
		})
		await expect(LoadSite("https://example.com")).resolves.toHaveProperty(
			"root",
		)
		expect(fetch).toHaveBeenCalledWith<string[]>("https://example.com")
	})

	it("throws 404", async () => {
		;((fetch as unknown) as jest.Mock).mockResolvedValueOnce({
			status: 404,
			text: () => Promise.resolve(""),
		})
		await expect(LoadSite("https://example.com")).rejects.toEqual("404")
		expect(fetch).toHaveBeenCalledWith<string[]>("https://example.com")
	})

	it("throws error", async () => {
		;((fetch as unknown) as jest.Mock).mockRejectedValueOnce(
			"This is a bad site, go away",
		)
		await expect(LoadSite("https://example.com")).rejects.toEqual(
			"Error while loading site",
		)
		expect(fetch).toHaveBeenCalledWith<string[]>("https://example.com")
	})
})
