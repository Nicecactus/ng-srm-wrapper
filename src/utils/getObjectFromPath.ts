export function getObjectFromPath(path: string): any {
    let o: any = window;
    const split = path.split('.');
    for (const key of split) {
        if (!key) {
            continue;
        }

        o = o[key];
    }

    return o;
}
