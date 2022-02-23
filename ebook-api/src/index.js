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
    pages: String,
    date: String,
    uploader: String,
    download: String,
    dept: String,
    isVerified: Boolean
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
app.post("/admin-login", (req, res) => {
    var _a, _b;
    if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.id) === 'admin' && ((_b = req.body) === null || _b === void 0 ? void 0 : _b.password) === 'password123') {
        res.send('Login successfull').status(200).end();
        return;
    }
    res.send('Incorrect details!').status(403).end();
});
app.get('/fetch-books', (req, res) => {
    fetchEBooksFromDb(res);
});
app.post("/upload-book", (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const book = Object.assign(Object.assign({}, req.body), { isVerified: false });
    const newBook = new BookModel(book);
    yield newBook.save();
    fetchEBooksFromDb(res);
}));
app.post("/update-book/:id", (req, res) => {
    const book = Object.assign(Object.assign({}, req.body), { isVerified: false });
    BookModel.findByIdAndUpdate(req.params.id.toString().trim(), Object.assign({}, book), (err) => {
        if (err)
            throw err;
        fetchEBooksFromDb(res);
    });
});
app.get('/verify/:id', (req, res) => {
    BookModel.findByIdAndUpdate(req.params.id.toString().trim(), { isVerified: true }, (err) => {
        if (err)
            throw err;
        fetchEBooksFromDb(res);
    });
});
app.get('/delete-book/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const bookId = req.params.id.toString().trim();
    BookModel.findByIdAndDelete(bookId, (err) => {
        if (err)
            throw err;
        fetchEBooksFromDb(res);
    });
}));
app.listen(PORT, () => {
    mongoose_1.default
        .connect(process.env.MONGO_URL)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.log("Connection failed", err));
    console.log(`Server is running on port ${PORT}`);
});
