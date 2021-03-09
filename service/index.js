const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const PORT = process.env.PORT || 8080;
const app  = express();

const db = new sqlite3.Database('./service/db/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the test database.');
});

const sendRes = function (res, err, data) {
    if (err) {
        res.send(err.message);
        console.log(err.stack);
        return;
    }
    if (!data || Array.isArray(data) && data.length === 0) {
        res.send('Не найдено');
        return;
    }
    res.send(data);
}

app.use('/', express.static('./dist'));

app.get('/object/:id', (req, res) => {
    const id = Number(req.params.id);
    db.serialize(() => {
        let query = `SELECT * FROM OBJECTS WHERE id = ${id};`;
        db.get(query, function(err, row) {
            sendRes(res, err, row);
        });
    });
    console.log(`/object/${id}`);
});

app.get('/objectList', (req, res) => {
    db.serialize(() => {
        let query = `SELECT id FROM OBJECTS ORDER BY id;`;
        db.all(query, function(err, rows) {
            sendRes(res, err, rows.map(item => item.id));
        });
    });
    console.log('/objectList');
});

app.get('/property/:id', (req, res) => {
    const id = Number(req.params.id);
    db.serialize(() => {
        let query = `SELECT * FROM PROPERTIES WHERE id = ${id};`;
        db.get(query, function(err, row) {
            sendRes(res, err, row);
        });
    });
    console.log(`/property/${id}`);
});

app.get('/propertyList', (req, res) => {
    db.serialize(() => {
        let query = `SELECT id FROM PROPERTIES ORDER BY id;`;
        db.all(query, function(err, rows) {
            sendRes(res, err, rows.map(item => item.id));
        });
    });
    console.log('/propertyList');
});

app.get('/map_object/:id_object', (req, res) => {
    const id_object = Number(req.params.id_object);
    db.serialize(() => {
        let query = `SELECT id_property FROM MAP_OBJECTS_PROPERTIES WHERE id_object = ${id_object};`;
        db.all(query, function(err, rows) {
            sendRes(res, err, rows.map(item => item.id_property));
        });
    });
    console.log(`/map_op/${id_object}`);
});

app.get('/map_property/:id_property', (req, res) => {
    const id_property = Number(req.params.id_property);
    db.serialize(() => {
        let query = `SELECT id_object FROM MAP_OBJECTS_PROPERTIES WHERE id_property = ${id_property};`;
        db.all(query, function(err, rows) {
            sendRes(res, err, rows.map(item => item.id_object));
        });
    });
    console.log(`/map_op/${id_property}`);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    process.exit();
});