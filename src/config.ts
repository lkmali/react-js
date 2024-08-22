import { ApplicationConfig } from './typings'

class EnvironmentConfig {
  REACT_APP_PORT: number
  REACT_APP_PUBLIC_URL: string
  REACT_APP_BACKEND_BASE_URL: string
  REACT_APP_WORKFLOW_BASE_URL: string

  constructor(config: ApplicationConfig) {
    this.REACT_APP_PORT = config?.REACT_APP_PORT ?? 5000
    this.REACT_APP_PUBLIC_URL = config.REACT_APP_PUBLIC_URL ?? 'http://localhost:5000'
    this.REACT_APP_WORKFLOW_BASE_URL = config.REACT_APP_WORKFLOW_BASE_URL ?? 'http://localhost:4000'
    this.REACT_APP_BACKEND_BASE_URL = config.REACT_APP_BACKEND_BASE_URL ?? 'http://localhost:3000'
  }
}

export const googleConfig = Object.freeze({
  version: process.env.REACT_APP_VERSION,
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  googleAnalytics: {
    debug: process.env.REACT_APP_GOOGLE_ANALYTICS_DEBUG === 'true',
    trackingID: process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID,
  },
})
export const env = new EnvironmentConfig(process.env as ApplicationConfig)
