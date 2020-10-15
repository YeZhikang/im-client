// declare global {
//     interface Window { _global:  any}
// }

declare module "*.png" {
    const value: any;
    export default value;
}