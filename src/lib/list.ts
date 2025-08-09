
export const sortByProperty = (prop: string) =>
	(a, b) => {
		a = a[prop]
		b = b[prop]

		return a == b ? 0 : (a < b ? -1 : 1)
	}
