import App from "./App.js";
import { cardStorage } from "./utils/customStorage.js";
window.onload = () => {
    if (!cardStorage.isValueSetted()) {
        cardStorage.setNoteDataAll({});
    }
    new App({ $target: document.getElementById("App") });
};
