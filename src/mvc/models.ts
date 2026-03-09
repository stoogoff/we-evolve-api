
export interface SiteMetadata {
	title?: string;
	description?: string;
	url?: URL;
	image?: string;
	type?: string;
}

export class MetadataModel {
	private page: MetadataModel | undefined

	constructor(private metadata: Partial<SiteMetadata>) {}

	get title(): string {
		return this.page && this.page.title ? this.page.title + this.metadata.title : this.metadata.title ?? ''
	}

	get description(): string {
		return this.overrideProperty('description')
	}

	get url(): string {
		if(this.page && this.page.url) {
			return this.page.url.toString()
		}

		if(this.metadata.url) {
			return this.metadata.url.toString()
		}

		return ''
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

	async toRaw(): Promise<Record<string, any>> {
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
		//@ts-ignore
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

	isActiveNav(path: string): boolean {
		const url = new URL(path, this.url)

		return url.href === this.url
	}

	override async toRaw(): Promise<Record<string, unknown>> {
		const model = await super.toRaw()
		const methods = ['imagePath', 'isActiveNav']

		methods.forEach(method => {
			// @ts-ignore
			model[method] = this[method].bind(this)
		})

		return model
	}
}

export class PageModel extends MetadataModel {
	constructor(metadata: Partial<SiteMetadata>, private data: unknown | unknown[] | undefined = undefined) {
		super(metadata)
	}

	toJson() {
		return this.data
	}
}
