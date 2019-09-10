import CreateReducer from '../../../utils/createReducer';

export const schema = {
  name: 'Keywords',
  id: 'id',
} 

const reducer = CreateReducer(schema.name);

export default reducer;

// selectors
export const getKeywordById = (state, id) => {
    return state.entities.keywords[id];
}