const request = require('request');


module.exports = {
    name : 'judgeontime',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){

        if(args.length==0){
            return message.reply("what doink")
        }

        console.log(args)
        //space = array delimiter
        /*
        -judgeontime nicknames(noxter;thsiw;EmBee;buttley) DD/MM/YYYY-HH:MM:SS
        args0 -> tutto per nickname
        args1 -> time
        
        */

        let judges = []
        let tte = 0

        //control for nicknames validation
        if(args[0].split("")[9] == '(' && args[0].split("")[args[0].split("").length - 1] == ')'){
            console.log("nicknames validated")

            let split = args[0].split("nicknames")[1].replace(/[()]+/g,"")

            
            for (let i = 0; i < split.split(';').length; i++) {
                judges.push(split.split(';')[i])                
            }
            console.log(judges)
        }

        if(args[1].split('-')[1].length == 8){
            console.log(args[1])
            let date = args[1].split('-')[0]
            let time = args[1].split('-')[1]

            let todayDate = new Date();
            let todayDay = todayDate.getDate()
            let todayMonth = (todayDate.getMonth() + 1 )
            let todayYear = todayDate.getFullYear()
            let todayHour = todayDate.getHours()
            let todayMinutes = todayDate.getMinutes()
            let todaySeconds = todayDate.getSeconds()

            console.log("date is: "+ todayDay + " " + todayMonth +" " + todayYear + " " +todayHour +" " + todayMinutes +" " + todaySeconds)

            let futureDay = date.split('/')[0]
            let futureMonth = date.split('/')[1]
            let futureYear = date.split('/')[2]
            let futureHour = time.split(':')[0]
            let futureMinutes = time.split(':')[1]
            let futureSeconds = time.split(':')[2]

            console.log("future date is: " +" " + futureDay +" " + futureMonth + " " +futureYear + " " +futureHour +" " + futureMinutes +" " +futureSeconds)

            if(futureDay - todayDay == 0){
                if(futureMonth - todayMonth == 0){
                    if(futureYear - todayYear == 0){
                        let todayExpireTime = (todayHour*3600000) + (todayMinutes*60000) + (todaySeconds * 1000) 
                        let futureExpireTime = (futureHour*3600000) + (futureMinutes*60000) + (futureSeconds * 1000) 
                        
                        tte = futureExpireTime - todayExpireTime

                        console.log(tte)
                    }
                }
            }else{
                if(futureMonth - todayMonth == 0){
                    if(futureYear - todayYear == 0){
                        let todayExpireTime = (todayHour*3600000) + (todayMinutes*60000) + (todaySeconds * 1000) + futureMonth - todayMonth
                        let futureExpireTime = (futureHour*3600000) + (futureMinutes*60000) + (futureSeconds * 1000) 
                        
                        tte = futureExpireTime - todayExpireTime

                        console.log(tte)
                    }
                }
            }
        }

        console.log(new Date())

        function getJudgeStats(i){
            request({
                url: `https://open.faceit.com/data/v4/players?nickname=`+judges[i],
                headers: {
                    'Authorization': `Bearer c763eb50-c2ed-4874-b63b-8b000979177e`
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
                            'Authorization': `Bearer 01572f53-7fac-4796-9673-04dd54c1f467`
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

        console.log(judges[0])
        
        if(judges[0]!=''){
            setTimeout(() => {
                for (let j = 0; j < judges.length; j++) {         
                    getJudgeStats(j);           
                }
            }, tte)
        }else{
            message.reply('I think you have made a mistake putting judges')
        }

        console.log(judges) 
        return message.reply("In " +tte / 600000 +" minutes, I am judging those judges: " + judges)
    }
}

