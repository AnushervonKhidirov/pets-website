export function join(...paths: (string | number)[]): string {
    return paths.join('/').replaceAll(/\/+/g, '/');
}
