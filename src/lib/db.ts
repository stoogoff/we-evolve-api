
import axios, { AxiosInstance } from 'axios'
import config from '../config'

const databases = {}

// set up Axios
export const db = (path: string): AxiosInstance => {
	if(!(path in databases)) {
		databases[path] = axios.create({
			baseURL: config.dbHost + path,
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${config.dbUser}:${config.dbPassword}`, 'ascii').toString('base64'),
			},
		})
	}

	return databases[path]
}
