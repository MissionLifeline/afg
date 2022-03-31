import process from 'process'

export const isDevelopment = (): boolean => !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const isProduction = (): boolean => process.env.NODE_ENV && process.env.NODE_ENV === 'production'
