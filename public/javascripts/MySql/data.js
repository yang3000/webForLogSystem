var mysql = require('mysql');
var TEST_DATABASE = 'jofficetest';
var TEST_TABLE = 'app_user';

var client = mysql.createConnection({
    user: 'root',
    password: 'yhyl@696'
});

client.connect();
client.query("use " + TEST_DATABASE);
client.query('SELECT * FROM '+TEST_TABLE, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }

        if(results)
        {
            for(var i = 0; i < results.length; i++)
            {
                console.log("%s\t%s\t%s", results[i].username, results[i].password, results[i].fullname);
            }
        }

        client.end();
    }
);
