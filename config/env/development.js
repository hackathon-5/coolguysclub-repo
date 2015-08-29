'use strict';

module.exports = {
	db: process.env.MONGOLAB_URI || 'mongodb://localhost/parcool-dev',
	app: {
		title: 'parcool - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1669007563320531',
		clientSecret: process.env.FACEBOOK_SECRET || '9658d378dd692ef30264ae2f994319f7',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'LCaYR9kf1u58KOYPSLSvZS3J7',
		clientSecret: process.env.TWITTER_SECRET || '37i4h9mRVhzWFVGK4AQFnDMFp7oaaqGZmEqvrgdng1sl0bfaih',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '516267842504-cb5uraa6r8vr5hrfri185n03qi7en76j.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'nydI4zgKspHgz3NyBcNjOa2-',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'parcoolhack',
				pass: process.env.MAILER_PASSWORD || 'hitERNul'
			}
		}
	}
};
