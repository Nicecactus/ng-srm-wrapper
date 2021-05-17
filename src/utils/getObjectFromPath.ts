export function getObjectFromPath(path: string): any {
    let o: any = window;
    const split = path.split('.');
    for (const key of split) {
        if (!o) {
            return null;
        }

        if (!key) {
            continue;
        }

        o = o[key];
    }

    return o;
}
