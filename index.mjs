import 'dotenv/config'
import express from 'express'
import pokemon from 'pokemontcgsdk'

const app = express();
const POKEMON_TCG_API_KEY = process.env.API_KEY;

pokemon.configure({apiKey: `${POKEMON_TCG_API_KEY}`})

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

function dayOfYear(month, day) {
    const days = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    return days[month - 1] + day;
}

// routes

// root
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.post('/displayPokemon', async(req, res) => {
    const birthday = req.body.birthday;
    let [year, month, day] = birthday.split('-').map(Number);

    const pokeId = ((dayOfYear(month, day) * year) % 1025) + 1;

    try {    
        let url = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const pokeAPIData = await response.json();

        console.log(pokeAPIData);

        res.render('pokemon.ejs', { pokeAPIData, month, day, year });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

app.get('/pokemonOfTheDay', async(req, res) => {
    const today = new Date();

    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();

    const pokeId = dayOfYear(month, day) % 1025 + 1;

    try {    
        const url = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const pokeAPIData = await response.json();

        console.log(pokeAPIData);

        res.render('pokemon.ejs', { pokeAPIData, month, day, year });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

app.post('/displayTCG', async(req, res) => {
    const pokeId = req.body.pokeId;

    if (!pokeId) {
        return res.redirect('/');
    }

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const pokeAPIData = await response.json();

        const tcgAPIData = (await pokemon.card.where({ q: `name:${pokeAPIData.name}`, pageSize: 1 })).data[0];

        const pokemonCardImg = tcgAPIData.images.small;
        const pokemonCardArtist = tcgAPIData.artist;
        const flavorText = tcgAPIData.flavorText;
        const tcgplayer = tcgAPIData.tcgplayer;
        const cardmarket = tcgAPIData.cardmarket;

        res.render('displayTCG.ejs', { pokeAPIData, pokemonCardImg, pokemonCardArtist, flavorText, tcgplayer, cardmarket });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
