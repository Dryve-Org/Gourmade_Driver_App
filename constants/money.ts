
export const stringPrice = (price: number) => {
    return '$' + (price * .01).toFixed(2)
}