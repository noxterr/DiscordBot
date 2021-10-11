const request = require('request');


module.exports = {
    name : 'judgeontime',
    description : 'command that returns data of judges on a certain date',
    execute(message, args){

        if(args.length==0){
            return message.reply("Why you think this command works if you don't put anything?")
        }
        //space = array delimiter
        /*
        -judgeontime nicknames(noxter;thsiw;EmBee;buttley) DD/MM/YYYY-HH:MM:SS
        args0 -> tutto per nickname
        args1 -> time
        
        */

        let judges = []
        let tte = 0
        let todayDate = new Date();
        if(todayDate.getFullYear() % 4 == 0){
            //febr 29
            let daysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        }else{
            let daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        }


        //control for nicknames validation
        if(args[0].split("")[9] == '(' && args[0].split("")[args[0].split("").length - 1] == ')'){
            //console.log("nicknames validated")

            let split = args[0].split("nicknames")[1].replace(/[()]+/g,"")

            
            for (let i = 0; i < split.split(';').length; i++) {
                judges.push(split.split(';')[i])                
            }
            //console.log(judges)
        }

        //-judgeontime nicknames() 2/01:00

        if(args[1].split('/')[1].length == 5){
            console.log(args[1])
            let date = args[1].split('/')[0]
            let time = args[1].split('/')[1]

            let todayDay = todayDate.getDate()
            let todayMonth = (todayDate.getMonth() + 1 )
            let todayYear = todayDate.getFullYear()
            let todayHour = todayDate.getHours()
            let todayMinutes = todayDate.getMinutes()

            //console.log("Today is is: "+ todayDay + " " + todayMonth +" " + todayYear + " " +todayHour +" " + todayMinutes)

            
            let time = args[1].split('/')[1]
            let hour = (time.split(':')[0] == '00') ? '00' : time.split(':')[0]
            let minutes = (time.split(':')[1] == '00') ? '00' : time.split(':')[1]
            //console.log(hour +":"+ minutes)

            if(hour.match(/0\d{1}/)){
                hour = hour.split("")[1]
            }

            if(minutes.match(/0\d{1}/)){
                minutes = minutes.split("")[1]
            }


            //noxter 🍕
            //minute start = todayMinutes
            //hour start = todayHour
            //minute end = minutes
            //hour end = hour 
            let endMinutes = ""
            let endHour = ""
            let statusHour = ""
            let statusMinute = ""
            let daysToWait = 0
            if(todayMinutes != minutes && todayHour != hour){
                if(todayMinutes > minutes && todayHour > hour){
                    //both equal

            let futureDay = todayDay + date.split('/')[0]
            let futureHour = time.split(':')[0]
            let futureMinutes = time.split(':')[1]

            console.log("future date is: " +" " + futureDay +" " +futureHour +" " + futureMinutes)

            //old code past in old_comms         -judgeontime nicknames() 23/09/2021-23:41:00


        }

        //console.log(new Date())

        /*function getJudgeStats(i){
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
        } */

        console.log(judges[0])
        
        if(judges[0]!=''){
            setTimeout(() => {
                for (let j = 0; j < judges.length; j++) {         
                    getJudgeStats(j);           
                }
            }, tte)
        }else{
            return message.reply('I think you have made a mistake putting judges')
        }

        console.log(judges) 
        return message.reply("In " +tte / 60000 +" minutes,("+ tte +" ms) I am judging those judges: " + judges)
    }
}
