const sqlite = require('sqlite'),
  sqlite3 = require('sqlite3')
  var argv = require('minimist')(process.argv.slice(2));
  /*
  var db = new sqlite3.Database('./test.sqlite');
  db.all("SELECT * FROM accounts", function(err, rows) {
    rows.forEach(function (row) {
      console.log(row.email);
    });
   });
   */

  ;(async () => {
    const database = await sqlite.open({
      driver: sqlite3.Database,
      filename: 'test.sqlite'
    })

    const args = process.argv.slice(2)




    const cities = await database.all('SELECT * FROM accounts')
    if (args[0] === 'list-accounts') {

        cities.find((item) => console.log(item.email))
        console.error(process.exit(0))
    } else if(args[0] === 'add-account') {
        try {
            await database.run(
                'INSERT INTO accounts (email, password) VALUES (?, ?)',
                [args[1], args[2]]
              )
              cities.find((item) => console.log(item.email))

          } catch (error) {
            console.error("uh oh")
            console.error(process.exit(2))
          }



    } else if (args[0] === 'remove-account') {

        const cities1 = await database.all(
            'SELECT * FROM accounts WHERE email = ?',
            [args[1]]
          )
          const c = cities1.find((item) => item.email === args[1])


        try {
            if (c.email.includes(".com")) {
            await database.run('DELETE FROM accounts WHERE email=?', [args[1]])
            cities.find((item) => console.log(item.email))
            }

          } catch (error) {
            console.error("uh oh")
            console.error(process.exit(3))
          }




    }  else if (args[0] === 'change-password') {

        const cities1 = await database.all(
            'SELECT * FROM accounts WHERE email = ?',
            [args[1]]
          )
          const c = cities1.find((item) => item.email === args[1])



        try {
            if (c.email.includes("@") && args[2].length >= 6) {
            await database.run('UPDATE accounts SET password=? WHERE email=?', [
                args[2],
                args[1]
              ])
              cities.find((item) => console.log(item))
            } else {
                console.error("uh oh")
                console.error(process.exit(2))
            }
          } catch (error) {
            console.error("uh oh")
            console.error(process.exit(3))
          }



    }
    else if (args[0] === 'update-account') {

console.log(argv);

const cities1 = await database.all(
    'SELECT * FROM accounts WHERE email = ?',
    [argv[1]]
  )
  const c = cities1.find((item) => console.log(item.email === argv[1]))
  console.log(cities1.email)


  if(argv.p) {
    await database.run('UPDATE accounts SET password=? WHERE email=?', [
        argv.p,
        argv[1]
      ])
      cities.find((item) => console.log(item))
  }






    }
    else {
        console.error("uh oh")
        console.error(process.exit(1))
    }






  })()
