const db = require("../modules/db");
const db_connect = db.connect();

// display books page
/*
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM shipping ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('checkout',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('checkout',{data:rows});
        }
    });
});
*/

// display add details page
router.get('/checkout', function(req, res, next) {    
    // render to checkout.ejs
    res.render('checkout', {
        fName: '',
        lName: '',
        phoneNum: '',
        address1: '',
        address2: '',
        region: '',
        province: '',
        city: '',
        district: '',  
        subDistrict: '',
        portalCode: '',
        shipping: ''
    })
})

// add a new details
router.post('/checkout', function(req, res, next) {    

    let fName = req.body.fName;
    let lName = req.body.lName;
    let phoneNumber = req.body.phoneNum;
    let streetAddress1 = req.body.address1;
    let streetAddress2 = req.body.address2;
    let region = req.body.region;
    let province = req.body.province;
    let city = req.body.city;
    let district = req.body.district;
    let subDistrict = req.body.subDistrict;
    let portalCode = req.body.portalCode;
    let shippingMethods = req.body.shipping;
    let errors = false;

    if(fName.length === 0 || lName.length === 0 || phoneNum === 0 || address1 === 0 || address2 === 0 || region === 0 || province === 0 || city === 0 || district === 0 || subDistrict === 0 || portalCode === 0 || shipping === 0) 
    {
        errors = true;

        // set flash message
        req.flash('error', "Please enter details");
        // render to add.ejs with flash message
        res.render('checkout', {
            fName: fName,
            lName: lName,
            phoneNum: phoneNum,
            address1: address1,
            address2: address2,
            region: region,
            province: province,
            city: city,
            district: district,  
            subDistrict: subDistrict,
            portalCode: portalCode,
            shipping: shipping
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            fName: fName,
            lName: lName,
            phoneNum: phoneNum,
            address1: address1,
            address2: address2,
            region: region,
            province: province,
            city: city,
            district: district,  
            subDistrict: subDistrict,
            portalCode: portalCode,
            shipping: shipping
        }
        
        // insert query
        dbConn.query('INSERT INTO checkout SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('checkout', {
                    fName: form_data.fName,
                    lName: form_data.lName,
                    phoneNum: form_data.phoneNum,
                    address1: form_data.address1,
                    address2: form_data.address2,
                    region: form_data.region,
                    province: form_data.province,
                    city: form_data.city,
                    district: form_data.district,  
                    subDistrict: form_data.subDistrict,
                    portalCode: form_data.portalCode,
                    shipping: form_data.shipping                   
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/checkout');
            }
        })
    }
})

/*
// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM books WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/books')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if(name.length === 0 || author.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/edit', {
            id: req.params.id,
            name: name,
            author: author
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            author: author
        }
        // update query
        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})
*/

module.exports = router;