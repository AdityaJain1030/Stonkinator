/** A global news object. All news fetchers will return an object like this */
export interface NewsFeed {
	/** The label/type of the news */
	label?: string
	/** The headline of the news post */
	headline: string
	/** The URL linking to the news post*/
	url?: string
	/** The time this news feed was posted */
	time: string
	/** The author of the news post */
	author?: string | null
	/** A link to a headline image */
	imageURL?: string
}
