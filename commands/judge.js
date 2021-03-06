const request = require('request');
require('dotenv').config();

module.exports = {
    name : 'judge',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){
        // if there are no arguments, send justice department infos
        if(typeof args[0] === 'Undefined' || args[0] == null){
        request({
            url: `https://api.faceit.com/judge/v1/stats`,
            headers: {
                'Authorization': `Bearer ${process.env.JUSTICE_BEARER_KEY}`
            }
        }, function(err, res) {
            if(err) {
                console.error(err);
                message.channel.send("Something went wrong " + err)
            } else {
                if (res.body == 'Authentication failed') {
                    return message.channel.send('There has been a mistake:  ' + response_api_def.body)
                }
                let jsonJudge = JSON.parse(res.body)

                let statsJ = ""
                try {

                    let total_verdicts =            "\nTotal Verdicts : "+jsonJudge.payload.total_verdicts
                    let total_cases_closed =        "\nTotal Cases Closed : "+jsonJudge.payload.total_cases_closed
                    let total_punishments =         "\nTotal Punishments "+jsonJudge.payload.total_punishments

                    let perCalcJ =                  jsonJudge.payload.total_punishments / jsonJudge.payload.total_cases_closed * 100;
                    let percentageJ =               "\nPercentage of Punished  "+perCalcJ.toFixed(2)+"%"

                    statsJ = "\`\`\`" + total_verdicts + total_cases_closed + total_punishments + percentageJ +  "\`\`\`"

                    message.channel.send("Stats of justice from \`The Justice Department\`:" +statsJ)
                } catch (e) {
                    console.log(e)
                    message.channel.send(`<@355265732940136448> There has been a mistake. Ensure the token is valid and there aren't breaking things. Here the log:`)
                    let err = ''
                    Object.keys(jsonJudge).map(k => {
                        err += jsonJudge + ':' +  jsonJudge[k] + '\n'
                    })
                    message.channel.send('\`\`\`' + err + '\`\`\`')
                }

            }
        });

        }else if(args.length == 1){
            // if there are arguments, check if is only a judge or a list of judges
            if(args[0].includes(';')){ //  || args[0].includes(',')
                let judges = args[0].split(';')
                judges.forEach(judge => {
                    request({
                        url: `https://open.faceit.com/data/v4/players?nickname=`+judge,
                        headers: {
                            'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
                        }
                    }, function(err, response_api_def) {
                        if(err) {
                            console.error(err);
                            message.channel.send("Something went wrong " + err)
                        } else {
                            if (response_api_def.body == 'Authentication failed') {
                                return message.channel.send('There has been a mistake:  ' + response_api_def.body)
                            }
                            let jsonMatches = JSON.parse(response_api_def.body)
                            request({
                                url: `https://api.faceit.com/judge/v1/judges/${jsonMatches.player_id}/stats`,
                                headers: {
                                    'Authorization': `Bearer ${process.env.JUSTICE_BEARER_KEY}`
                                }
                            }, function(err, response_justice) {
                                if(err) {
                                    console.error(err);
                                    message.channel.send("Something went wrong " + err)
                                } else {
                                    let jsonJudgeStats = JSON.parse(response_justice.body)

                                    try {

                                        let stats = ""

                                        let total_verdicts =      "\nTotal Verdicts : "+jsonJudgeStats.payload.total_verdicts
                                        let total_cases_closed =  "\nTotal Cases Closed : "+jsonJudgeStats.payload.total_cases_closed
                                        let total_good_verdicts = "\nTotal Good Verdicts "+jsonJudgeStats.payload.total_good_verdicts
                                        let total_bad_verdicts =  "\nTotal Bad Verdicts "+jsonJudgeStats.payload.total_bad_verdicts

                                        let perCalc = jsonJudgeStats.payload.total_good_verdicts / jsonJudgeStats.payload.total_cases_closed * 100;
                                        let percentage =          "\nPercentage of Good Verdicts "+perCalc.toFixed(2)+"%"


                                        stats = "\`\`\`" + total_verdicts + total_cases_closed + total_good_verdicts + total_bad_verdicts + percentage + "\`\`\`"

                                        message.channel.send("Justice stats from \`"+judge+"\`:" +stats)
                                    } catch (e) {
                                        console.log(e)
                                        message.channel.send(`<@355265732940136448> There has been a mistake. Ensure the token is valid and there aren't breaking things. Here the log:`)
                                        let err = ''
                                        Object.keys(jsonJudgeStats).map(jsonJudgeStat => {
                                            err += jsonJudgeStat + ':' +  jsonJudgeStats[jsonJudgeStat] + '\n'
                                        })
                                        message.channel.send('\`\`\`' + err + '\`\`\`')
                                    }
                                }
                            });
                        }
                    });
                });
            } else {
                request({
                    url: `https://open.faceit.com/data/v4/players?nickname=`+args[0],
                    headers: {
                        'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
                    }
                }, function(err, response_api_def) {
                    if(err) {
                        console.error(err);
                        message.channel.send("Something went wrong " + err)
                    } else {
                        if (response_api_def.body == 'Authentication failed') {
                            return message.channel.send('There has been a mistake:  ' + response_api_def.body)
                        }
                        let jsonMatches = JSON.parse(response_api_def.body)
                        request({
                            url: `https://api.faceit.com/judge/v1/judges/${jsonMatches.player_id}/stats`,
                            headers: {
                                'Authorization': `Bearer ${process.env.JUSTICE_BEARER_KEY}`
                            }
                        }, function(err, response_justice) {
                            if(err) {
                                console.error(err);
                                message.channel.send("Something went wrong " + err)
                            } else {
                                let jsonJudgeStats = JSON.parse(response_justice.body)

                                try {
                                    let stats = ""


                                    let total_verdicts =      "\nTotal Verdicts : "+jsonJudgeStats.payload.total_verdicts
                                    let total_cases_closed =  "\nTotal Cases Closed : "+jsonJudgeStats.payload.total_cases_closed
                                    let total_good_verdicts = "\nTotal Good Verdicts "+jsonJudgeStats.payload.total_good_verdicts
                                    let total_bad_verdicts =  "\nTotal Bad Verdicts "+jsonJudgeStats.payload.total_bad_verdicts

                                    let perCalc = jsonJudgeStats.payload.total_good_verdicts / jsonJudgeStats.payload.total_cases_closed * 100;
                                    let percentage = "\nPercentage of Good Verdicts "+perCalc.toFixed(2)+"%"


                                    stats = "\`\`\`" + total_verdicts + total_cases_closed + total_good_verdicts + total_bad_verdicts + percentage + "\`\`\`"

                                    message.channel.send("Stats of justice from \`"+args[0]+"\`:" +stats)
                                } catch (e) {
                                    console.log(e)
                                    message.channel.send(`<@355265732940136448> There has been a mistake. Ensure the token is valid and there aren't breaking things. Here the log:`)
                                    let err = ''
                                    Object.keys(jsonJudgeStats).map(jsonJudgeStat => {
                                        err += jsonJudgeStat + ':' +  jsonJudgeStats[jsonJudgeStat] + '\n'
                                    })
                                    message.channel.send('\`\`\`' + err + '\`\`\`')
                                }
                            }
                        });
                    }
                });
            }
        }
    }
}