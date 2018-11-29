const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'sensordata.db');
 
// open the database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
     if (err) {
	return console.error(err.message);
	}
	console.log('Connected to the SQLite database.');
});

/*let sql = `SELECT brand, model, year, firstName, inside, id_type_fk2, id_person_fk FROM car
INNER JOIN person ON person.id = car.id_person_fk`;*/

let query = `SELECT id, firstName, middleName, lastName, email FROM person
WHERE id = ?`;
let data = ['0','1'];
let up = `UPDATE person 
SET inside = ?
WHERE inside = ?`;

const Noble = require("noble");
const BeaconScanner = require("node-beacon-scanner");

var scanner = new BeaconScanner();
var beacon;

/* db.serialize(() => { 
db.each(`SELECT brand, model, year, firstName, inside, id_type_fk2, id_person_fk FROM car
INNER JOIN person ON person.id = car.id_person_fk`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
	if (row.inside == 1) {
	console.log('Hello world');
	update(up, data);
	console.log(row.brand + " " +  row.firstName + " " + row.id_type_fk2 + " " 
+ " " + row.id_person_fk + " " + row.inside);
	}
  }); 
});

function update(up, data) {
db.serialize(() => {
db.run(up, data, function(err) {
        if (err) {
        return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
    });
});
};*/

//console.log(sql);*/

/*db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.firstName);
  });
});*/
  
scanner.onadvertisement = (advertisement) => {
   beacon = advertisement.id;
  //beacon.rssi = advertisement["rssi"];
    console.log(JSON.stringify(beacon, null, "    "));
    console.log('It has stopped');
    console.log('Sending  beacon id');
    console.log(beacon);
};

db.each(query, [beacon], (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  return row
    ? console.log(row.firstName)
    : console.log(`No beacon found with the id ${beacon}`);
        });

console.log('hellow');

scanner.startScan().then(() => {
    console.log("Scanning for BLE devices...");
}).catch((error) => {
    console.error(error);
});

db.serialize(() => {
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
	});
});
