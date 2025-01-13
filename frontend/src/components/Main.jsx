import { useEffect, useState } from "react"
import { fetchAllData, addReader, addBook, getBooks} from "../requests";

import Card from "./ui/Card";
import Book from "./ui/Book";
import AddBook from "./forms/AddBook";
import AddReader from "./forms/AddReader";

export default function Main() {
    const [data, setData] = useState([]);
    const [booksList, setBooksList] = useState([]);
    const [shown, setShown] = useState(false);
    const [shown2, setShown2] = useState(false);

    useEffect(() => {
        fetchAllData(setData);
        getBooks(setBooksList);
    }, [])

    const countIssuedBooks = (id) => {
        let current = data.filter((element) => {
            return parseInt(element.reader_id) === parseInt(id)
        })

        return current[0].books.length;
    }

    const hasIssuedBook = (reader_id, book_id) => {
        const newReader = data.filter((element) => {
            return parseInt(element.reader_id) === parseInt(reader_id);
        });

        const haveSameBook = newReader[0].books.some((book) => 
            parseInt(book.book_id) === parseInt(book_id)
        )

        return haveSameBook;
    }

    return (
        <div className="main-container">
            <nav className="nav-block">
                {shown2?(
                    <AddBook setShown={setShown2} requestFunction={addBook}/>
                ):(
                    <div className="nav-block-menu">
                        <button className="filed-button" onClick={() => setShown2(true)}>Добавить книгу</button>
                    </div>
                )}
                <div className="nav-block-books-list" style={shown2 ? {flexWrap: "wrap" } : {flexWrap: "nowrap" }}>
                    {booksList.map((element, index) => {
                        return (
                            <Book key={index} data={element}/>
                        )
                    })}
                </div>
            </nav>
            <main className="main-block">
                {shown?(
                    <AddReader setShown={setShown} requestFunction={addReader}/>
                ):(
                    <div className="main-block-menu">
                        <button className="filed-button" onClick={() => setShown(true)}>Добавить читателя</button>
                    </div>
                )}

                <div className="main-block-cards-list">
                    {data.map((element, index) => {
                        return (
                            <Card key={index} data={element} dataAll={data} setDataAll={setData} countIssuedBooks={countIssuedBooks} hasIssuedBook={hasIssuedBook}/>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}