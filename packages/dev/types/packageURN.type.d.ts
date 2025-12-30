export type packageURN = `${string}/${string}@${string}`;

export type packageURNDestructured = {
    namespace: string;
    componentName: string;
    version: string;
}
