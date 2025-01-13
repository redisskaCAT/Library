const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Создаем приложение Express
const app = express();
const port = 5000; 

app.use(cors());
app.use(express.json()); 

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',       // Хост базы данных
    user: 'root',            // Имя пользователя базы данных
    password: 'root',    // Пароль пользователя базы данных
    database: 'Library' // Название базы данных
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно!');
});

// Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

// ---------- Получение всех читателей и выданных книг ----------

app.get('/readers', (req, res) => {
    const sql = `
        SELECT 
            r.reader_id,
            r.full_name,
            b.book_id,
            b.author_name,
            b.book_title
        FROM Readers r
        LEFT JOIN Issued_Books ib ON r.reader_id = ib.reader_id
        LEFT JOIN Books b ON ib.book_id = b.book_id
        ORDER BY r.reader_id, b.book_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        const readers = {};

        results.forEach(row => {
            const { reader_id, full_name, book_id, author_name, book_title } = row;

            if (!readers[reader_id]) {
                readers[reader_id] = {
                    reader_id,
                    full_name,
                    books: []
                };
            }

            if (book_id) {
                readers[reader_id].books.push({
                    book_id,
                    author_name,
                    book_title
                });
            }
        });

        const response = Object.values(readers);

        res.json(response);
    });
});

// ---------- Добавление читателя ----------

app.post('/readers/add', (req, res) => {
    const { full_name } = req.body;

    const sql = `
        INSERT INTO Readers (full_name)
        VALUES (?);
    `;

    db.query(sql, [full_name], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении читателя:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении читателя', details: err });
        }

        res.status(201).json({
            message: 'Читатель успешно добавлен.',
            reader_id: result.insertId
        });
    });
});

// ---------- Удаление читателя ----------

app.delete('/readers/delete/:reader_id', (req, res) => {
    const { reader_id } = req.params;

    const sql = `
        DELETE FROM Readers
        WHERE reader_id = ?;
    `;

    db.query(sql, [reader_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении читателя:', err);
            return res.status(500).json({ error: 'Ошибка при удалении читателя', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Читатель с указанным ID не найден.' });
        }

        res.json({
            message: 'Читатель успешно удалён.',
            reader_id: reader_id
        });
    });
});

// ---------- Редактирование данных читателя ----------

app.put('/readers/edit/:reader_id', (req, res) => {
    const { reader_id } = req.params;
    const { full_name } = req.body;

    if (!full_name) {
        return res.status(400).json({ error: 'Полное имя читателя обязательно для обновления.' });
    }

    const sql = `
        UPDATE Readers
        SET full_name = ?
        WHERE reader_id = ?;
    `;

    db.query(sql, [full_name, reader_id], (err, result) => {
        if (err) {
            console.error('Ошибка при обновлении читателя:', err);
            return res.status(500).json({ error: 'Ошибка при обновлении читателя', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Читатель с указанным ID не найден.' });
        }

        res.json({
            message: 'Читатель успешно обновлён.',
            reader_id: reader_id,
            updated_full_name: full_name
        });
    });
});

// ---------- Получение списка всех книг ----------

app.get('/books', (req, res) => {
    const sql = `SELECT * FROM Books;`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        res.json(results);
    });
});

// ---------- Добавление книги ----------

app.post('/books/add', (req, res) => {
    const { author_name, book_title, total_quantity } = req.body;

    const sql = `
        INSERT INTO Books (author_name, book_title, total_quantity)
        VALUES (?, ?, ?);
    `;

    db.query(sql, [author_name, book_title, parseInt(total_quantity)], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении книги:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении книги', details: err });
        }

        res.status(201).json({ message: 'Книга успешно добавлена', book_id: result.insertId });
    });
});

// ---------- Редактирование данных о книге ----------

app.put('/books/edit/:book_id', (req, res) => {
    const { book_id } = req.params;
    const { author_name, book_title, total_quantity } = req.body;

    const sql = `
        UPDATE Books
        SET author_name = ?, book_title = ?, total_quantity = ?
        WHERE book_id = ?;
    `;

    db.query(sql, [author_name, book_title, parseInt(total_quantity), book_id], (err, result) => {
        if (err) {
            console.error('Ошибка при обновлении книги:', err);
            return res.status(500).json({ error: 'Ошибка при обновлении книги', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Книга с указанным ID не найдена.' });
        }

        res.status(200).json({ message: 'Книга успешно обновлена.' });
    });
});

// ---------- Выдача книги читателю ----------

app.post('/issue-book', (req, res) => {
    const { reader_id, book_id } = req.body;

    db.query('SELECT total_quantity FROM Books WHERE book_id = ?', [book_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при запросе данных о книге' });
        }

        const totalQuantity = results[0]?.total_quantity;

        if (!totalQuantity || totalQuantity <= 0) {
            return res.status(400).json({ error: 'Книга недоступна для выдачи' });
        }

        db.query('UPDATE Books SET total_quantity = total_quantity - 1 WHERE book_id = ?', [book_id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при обновлении количества экземпляров книги' });
            }

            db.query('INSERT INTO Issued_Books (reader_id, book_id) VALUES (?, ?)', [reader_id, book_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Ошибка при записи в таблицу выдачи' });
                }

                return res.status(200).json({ message: 'Книга успешно выдана' });
            });
        });
    });
});

// ---------- Возвращение книги в библиотеку ----------

app.post('/return-book', (req, res) => {
    const { reader_id, book_id } = req.body;

    db.query('DELETE FROM Issued_Books WHERE reader_id = ? AND book_id = ?', [reader_id, book_id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при удалении записи о выдаче' });
        }

        db.query('UPDATE Books SET total_quantity = total_quantity + 1 WHERE book_id = ?', [book_id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при обновлении количества экземпляров книги' });
            }

            return res.status(200).json({ message: 'Книга успешно возвращена в библиотеку' });
        });
    });
});

// ---------- Передача книги от одного читателя к другому ----------

app.post('/transfer-book', (req, res) => {
    const { reader_id, new_reader_id, book_id } = req.body;

    db.query('DELETE FROM Issued_Books WHERE reader_id = ? AND book_id = ?', [reader_id, book_id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при удалении записи о выдаче' });
        }

        db.query('INSERT INTO Issued_Books (reader_id, book_id) VALUES (?, ?)', [new_reader_id, book_id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при добавлении записи о выдаче новому читателю' });
            }

            return res.status(200).json({ message: 'Книга успешно переведена на нового читателя' });
        });
    });
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});