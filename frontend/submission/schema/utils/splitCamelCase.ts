export const camelCase2Words: (input: string, separator?: string) => string = (input, separator= ' ' ) => input.replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
