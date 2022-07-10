require('dotenv').config();
const http = require('axios')

const getGuidFromName = async(name) => {
    if (!name || name === undefined) {
        return 'Name result undefined or not passed'
    }

    // Headers
    let config = {
        headers: {
            'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
        }
    }
    const data = await http.get(`https://open.faceit.com/data/v4/players?nickname=${name}`, config)

    if (data && data.data) {
        return data.data.player_id
    }
}


test('The fetch fails with an error due to missing the parameter', async () => {
    const data = await getGuidFromName();
    expect(data).toBe('Name result undefined or not passed');
});