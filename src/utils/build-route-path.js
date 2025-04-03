export function buildRoutePath(path){
    const routeParameterRegex = /:((a-zA-z)+)/g
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<id>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>)?$`)

    return pathRegex
}