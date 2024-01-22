import express from 'express'
import bodyParser from 'body-parser'
import pg from 'pg';

const app = express();
const Auth = {
    user:'postgres',
    password: 'pass',
    database: 'world',
    host: 'localhost',
    port: 5432
};
let countries = [];
const legit = ["AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "CF", "TD", "CL", "CN", "CO", "KM", "CD", "CR", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO", "TL", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "CI", "JM", "JP", "JO", "KZ", "KE", "KI", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX", "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ", "NI", "NE", "NG", "KP", "NO", "OM", "PK", "PW", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RU", "RW", "KN", "LC", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "KR", "SS", "ES", "LK", "SD", "SR", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TG", "TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VA", "VE", "VN", "YE", "ZM", "ZW"];
let total = 0;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

async function fetchCountries(){
    const db = new pg.Client(Auth);
    db.connect();
    let data = await db.query('SELECT country FROM visited_countries');
    for(let i = 0; i < data.rows.length; i++){
        countries.push(data.rows[i].country);
    }
    db.end();
    return;
}

app.get('/', async (req, res)=>{
    await fetchCountries();
    total = countries.length;
    res.render('index.ejs', {countries:countries, total: total});
})
app.post('/post', (req, res)=>{
    let country = req.body.code.toUpperCase();
    if(legit.includes(country)){
        if(countries.includes(country)){
            res.status(400).send("Country Already Added, Go Back and Try Again");
            return;
        }
        else{
            countries.push(country);
            total++;
            res.render('index.ejs', {countries:countries, total:total});
        }
    }
    else{
        res.status(400).send("Invalid Country Code, Go Back and Try Again");
        return;
    }
})
app.listen(3000);