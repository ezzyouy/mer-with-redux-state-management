import { CART_ADD_ITEM } from "../constants/productConstants";

export const cartReducer = (state = { cartItems:[]} , action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            // eslint-disable-next-line no-case-declarations
            const item = action.payload;
            // eslint-disable-next-line no-case-declarations
            const existItem = state.cartItems.find((x) => x.product === item.product);
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existItem.product? item : x)
                };
            } else {
                return { ...state, cartItems: [...state.cartItems, item] };
            }
        default:
            return state;
    }
}