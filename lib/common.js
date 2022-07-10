const http = require('axios')
require('dotenv').config();

module.exports = {
    getGuidFromName: async(name) => {
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
}
