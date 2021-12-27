"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const dotenv = (0, tslib_1.__importStar)(require("dotenv"));
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
dotenv.config();
const PORT = process.env.PORT || 5000;
const BookSchema = new mongoose_1.default.Schema({
    title: String,
    author: String,
    pages: String,
    date: String,
    uploader: String,
    file: String
});
const BookModel = mongoose_1.default.model("Book", BookSchema);
function fetchEBooksFromDb(res) {
    BookModel.find({ current: true }, (err, books) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(books);
        res.end();
    });
}
app.get('/fetch-books', (req, res) => {
    fetchEBooksFromDb(res);
});
app.post("/upload-book", (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const book = Object.assign({}, req.body);
    const newBook = new BookModel(book);
    yield newBook.save();
    fetchEBooksFromDb(res);
}));
app.listen(PORT, () => {
    mongoose_1.default
        .connect(process.env.MONGO_URL)
        .then(() => console.log("Connected to MongoDB"))
        .catch(() => console.log("Connection failed"));
    console.log(`Server is running on port ${PORT}`);
});
