const request = require('request');

module.exports = {
    name : 'judge',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){
        if(typeof args[0] === 'Undefined' || args[0] == null){
        request({
            url: `https://api.faceit.com/judge/v1/stats`,
            headers: {
                'Authorization': 'Bearer 01572f53-7fac-4796-9673-04dd54c1f467' //and old bearer c763eb50-c2ed-4874-b63b-8b000979177e
            },
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                let jsonJudge = JSON.parse(res.body)
                console.log(jsonJudge)

                let statsJ = ""
       
                let total_verdicts =            "\nTotal Verdicts : "+jsonJudge.payload.total_verdicts
                let total_cases_closed =        "\nTotal Cases Closed : "+jsonJudge.payload.total_cases_closed                           
                let total_punishments =         "\nTotal Punishments "+jsonJudge.payload.total_punishments 

                let perCalcJ =                  jsonJudge.payload.total_punishments / jsonJudge.payload.total_cases_closed * 100;                           
                let percentageJ =               "\nPercentage of Punished  "+perCalcJ.toFixed(2)+"%"    
                
                statsJ = "\`\`\`" + total_verdicts + total_cases_closed + total_punishments + percentageJ +  "\`\`\`"


                message.channel.send("Stats of justice from \`The Justice Department\`:" +statsJ)
            }
        }); 

        }else if(args.length == 1){
            request({
                url: `https://open.faceit.com/data/v4/players?nickname=`+args[0],
                headers: {
                    'Authorization': 'Bearer c763eb50-c2ed-4874-b63b-8b000979177e'
                },
                rejectUnauthorized: false
            }, function(err, response_api_def) {
                if(err) {
                    console.error(err);
                } else {
                    let jsonMatches = JSON.parse(response_api_def.body)
                    request({
                        url: `https://api.faceit.com/judge/v1/judges/${jsonMatches.player_id}/stats`,
                        headers: {
                            'Authorization': 'Bearer 01572f53-7fac-4796-9673-04dd54c1f467' 
                        },
                        rejectUnauthorized: false
                    }, function(err, response_justice) {
                        if(err) {
                            console.error(err);
                        } else {
                            let jsonJudgeStats = JSON.parse(response_justice.body)
                            
                            let stats = ""

                            let total_verdicts =      "\nTotal Verdicts : "+jsonJudgeStats.payload.total_verdicts
                            let total_cases_closed =  "\nTotal Cases Closed : "+jsonJudgeStats.payload.total_cases_closed                           
                            let total_good_verdicts = "\nTotal Good Verdicts "+jsonJudgeStats.payload.total_good_verdicts
                            let total_bad_verdicts =  "\nTotal Bad Verdicts "+jsonJudgeStats.payload.total_bad_verdicts     
                            
                            let perCalc = jsonJudgeStats.payload.total_good_verdicts / jsonJudgeStats.payload.total_cases_closed * 100;                           
                            let percentage =          "\nPercentage of Good Verdicts "+perCalc.toFixed(2)+"%"
                                                

                            stats = "\`\`\`" + total_verdicts + total_cases_closed + total_good_verdicts + total_bad_verdicts + percentage + "\`\`\`"

                            message.channel.send("Stats of justice from \`"+args[0]+"\`:" +stats)
                        }
                    });
                }
            });

        }
    }
}