
export const PORT = 8000
export const PATH = {
	PAGES: '/src/pages',
	STATIC: '/src/static',
}

export const BASE_MODEL = {
	title: '',

	pageTitle: function(): string {
		if(this.title) {
			return `${this.title} | Stoo Goff`
		}

		return 'Stoo Goff'
	},

	footer: {
		links: [
			{ icon: 'github', text: 'Github', href: 'https://github.com/stoogoff' },
			{ icon: 'soundcloud', text: 'SoundCloud', href: 'https://soundcloud.com/stoogoff' },
			{ icon: 'bandcamp', text: 'Bandcamp', href: 'https://stoogoff.bandcamp.com/' },
			{ icon: 'rss', text: 'RSS', href: '/feed.rss' },
			{ icon: 'atom', text: 'Atom', href: '/feed.atom' },
		],
	},

	imagePath: function(path: string): string {
		return IMAGE_URL + path
	},
}

export const IMAGE_URL = `https://res.cloudinary.com/${Deno.env.get('CLOUDINARY_CLOUDNAME')}/image/upload/`
