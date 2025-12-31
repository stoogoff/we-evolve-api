
/*

META DATA

title - this needs to be combinatory e.g. we-evolve, Home | we-evolve, Games | we-evolve
url
description
type ?? 'website'
image

SITE DATA

title
primary navigation
footer navigation

maybe this is two classes: MetadataModel, PageModel
these then get combined by the view

MetadataModel would have the meta data and navigation
PageModel would have title and page specific content

or maybe all of this should just be in the template??

*/

export interface SiteMetadata {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	type?: string;
}

class MetadataModel {
	private page: MetadataModel | undefined

	constructor(private metadata: Partial<SiteMetadata>) {}

	get title(): string {
		return this.page && this.page.title ? this.page.title + this.metadata.title : this.metadata.title ?? ''
	}

	get description(): string {
		return this.overrideProperty('description')
	}

	get url(): string {
		return this.overrideProperty('url')
	}

	get image(): string {
		return this.overrideProperty('image')
	}

	get type(): string {
		return this.overrideProperty('type')
	}

	merge(page: MetadataModel): MetadataModel {
		this.page = page

		return this
	}

	toRaw() {
		const model = {
			title: this.title,
			description: this.description,
			url: this.url,
			image: this.image,
			type: this.type,
		}

		//@ts-ignore
		if(this.page) model.data = this.page.data

		return model
	}

	private overrideProperty(property: keyof SiteMetadata): string {
		return this.page && this.page[property] ? this.page[property] : this.metadata[property] ?? ''
	}
}

export class SiteModel extends MetadataModel {
	constructor(metadata: Partial<SiteMetadata>, private baseImagePath: string) {
		super(metadata)
	}

	imagePath(path: string): string {
		return this.baseImagePath + path
	}

	override toRaw() {
		const model = super.toRaw()

		//@ts-ignore
		model.imagePath = this.imagePath.bind(this)

		return model
	}
}

export class PageModel extends MetadataModel {
	constructor(metadata: Partial<SiteMetadata>, public data: any | any[] | undefined = undefined) {
		super(metadata)
	}

	toJson() {
		return this.data
	}
}
