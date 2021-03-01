import cheerio from "cheerio"
import fetch from "node-fetch"

/** Custom site loader to fetch and load the site into a `Cheerio.Root`
 * @param url - The URL for the site to load
 * @returns A `Cheerio.Root` that contains the requested site
 * @internal
 */
export const LoadSite = async (url: string): Promise<cheerio.Root> => {
	try {
		const data = await fetch(url)
		const html = await data.text()
		if (data.status === 404) return Promise.reject("404")
		return cheerio.load(html)
	} catch {
		return Promise.reject("Error while loading site")
	}
}
