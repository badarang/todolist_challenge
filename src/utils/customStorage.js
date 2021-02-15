const storage = window.localStorage;
const CARD_KEY = "card-key";

const cardStorage = {
    setNoteData: (card) => {
        const parsedData = cardStorage.getNoteDataAll();
        parsedData[card.id] = card;
        storage.setItem(CARD_KEY, JSON.stringify(parsedData));
    },
    setNoteDataAll: (e) => {
        storage.setItem(CARD_KEY, JSON.stringify(e));
    },
    getNoteData: (id) => {
        return JSON.parse(storage.getItem(CARD_KEY)).id;
    },
    getNoteDataAll: () => {
        return JSON.parse(storage.getItem(CARD_KEY));
    },
    removeNoteData: () => {
        storage.removeItem(CARD_KEY);
    },
    isValueSetted: () => {
        if (!cardStorage.getNoteDataAll()) {
            return false;
        } else {
            return true;
        }
    },
    replaceNoteData: (id, data) => {
        const loadedData = cardStorage.getNoteDataAll();
        loadedData[id] = data;
        cardStorage.setNoteDataAll(loadedData);
    },
};
export { cardStorage };
