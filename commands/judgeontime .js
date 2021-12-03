const request = require('request');


module.exports = {
    name : 'judgeontime',
    description : 'command that returns data of judges on a certain date',
    execute(message, args){

        if(args.length==0){
            return message.reply("Why you think this command works if you don't put anything?")
        }

        let tte = 0

        let judges = []
        let todayDate = new Date();
        console.log(todayDate)
        var milliseconds = todayDate.getTime();
        console.log(milliseconds)

        //control for nicknames validation
        if(args[0].split("")[9] == '(' && args[0].split("")[args[0].split("").length - 1] == ')'){
            //console.log("nicknames validated")

            let split = args[0].split("nicknames")[1].replace(/[()]+/g,"")

            
            for (let i = 0; i < split.split(';').length; i++) {
                judges.push(split.split(';')[i])                
            }
            console.log(judges)
        }

        if(args[1] == ''){
            return message.reply('plz valid date')
        }
        let newDate = new Date(args[1]);

        console.log('new date')
        console.log(newDate)

        var newMilliseconds = newDate.getTime();
        console.log(newMilliseconds)

        tte = newMilliseconds - milliseconds;
        

        console.log('new tte')
        console.log(tte)

        function getJudgeStats(i){
            request({
                url: `https://open.faceit.com/data/v4/players?nickname=`+judges[i],
                headers: {
                    'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
                },
                rejectUnauthorized: true
            }, function(err, response_api_def) {
                if(err) {
                    console.error(err);
                } else {
                    let jsonMatches = JSON.parse(response_api_def.body)
                    request({
                        url: `https://api.faceit.com/judge/v1/judges/${jsonMatches.player_id}/stats`,
                        headers: {
                            'Authorization': `Bearer ${process.env.JUSTICE_BEARER_KEY}`
                        },
                        rejectUnauthorized: true
                    }, function(err, response_justice) {
                        if(err) {
                            console.error(err);
                        } else {
                            let jsonJudgeStats = JSON.parse(response_justice.body)

                            let stats = ""
                            
                            console.log(jsonJudgeStats)

                            let total_verdicts =      "\nTotal Verdicts : "+jsonJudgeStats.payload.total_verdicts
                            let total_cases_closed =  "\nTotal Cases Closed : "+jsonJudgeStats.payload.total_cases_closed                           
                            let total_good_verdicts = "\nTotal Good Verdicts "+jsonJudgeStats.payload.total_good_verdicts
                            let total_bad_verdicts =  "\nTotal Bad Verdicts "+jsonJudgeStats.payload.total_bad_verdicts     
                            
                            let perCalc = jsonJudgeStats.payload.total_good_verdicts / jsonJudgeStats.payload.total_cases_closed * 100;                           
                            let percentage =          "\nPercentage of Good Verdicts "+perCalc.toFixed(2)+"%"
                                                

                            stats = "\`\`\`" + total_verdicts + total_cases_closed + total_good_verdicts + total_bad_verdicts + percentage + "\`\`\`"
                       
                            message.channel.send("Stats of justice from \`"+judges[i]+"\`:" +stats)
                        }
                    });
                }
            });
        }

        
        if(judges[0]!=''){
            setTimeout(() => {
                for (let j = 0; j < judges.length; j++) {         
                    getJudgeStats(j);           
                }
            }, tte)
        }else{
            return message.reply('I think you have made a mistake putting judges')
        }

        return message.reply("In " + Math.ceil(tte / 60000) +" minutes (more or less), I am judging those judges: " + judges)
    }
}