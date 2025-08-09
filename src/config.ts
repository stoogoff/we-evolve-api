
import 'dotenv/config'

const config = {
	dbHost: process.env.DB_HOST,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	port: Number(process.env.PORT),
}

export default config
