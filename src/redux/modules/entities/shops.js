import CreateReducer from '../../../utils/createReducer';

export const schema = {
    name: 'shops',
    id: 'id',
}

const reducer = CreateReducer(schema.name);
  
export default reducer;

// selector
export const getShopById = (state, id) => {
    const shop = state.entities.shops[id];
    return shop;
}