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

        //-judgeontime nicknames() 0/11:00
        if(args[1].split('/')[1].length == 5){
            //console.log(args[1])

            if(args[1].split('/')[0] < 0){
                return message.reply("Why going back in time?")
            }else{
                console.log('gud')
            } 

            let date = args[1].split('/')[0]
            
            if(date == 'today'){
                date = 0
            }else if(date == 'tomorrow'){
                date = 1
            }else if(date == 'next_week'){
                date = 15
            }

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

                    endMinutes = todayMinutes - minutes
                    endHour = todayHour - hour
                    statusMinute = "sub"
                    statusHour = "sub"
                }else if(todayMinutes < minutes && todayHour < hour){
                    //both equal but opposite

                    endMinutes = minutes - todayMinutes
                    endHour = hour - todayHour
                    statusMinute = "add"
                    statusHour = "add"
                }else if(todayMinutes > minutes && todayHour < hour){
                    //opposite eachothers  

                    endMinutes = todayMinutes - minutes 
                    endHour = hour - todayHour
                    statusMinute = "sub"
                    statusHour = "add"
                }else if(todayMinutes < minutes && todayHour > hour){
                    //opposite eachothers 

                    endMinutes = minutes - todayMinutes
                    endHour = todayHour - hour 
                    statusMinute = "add"
                    statusHour = "sub"
                }
            }else if(todayMinutes == minutes && todayHour == hour && date == 0){
                return message.reply("bro, why using this command if you judging now? TF")
            }else if(todayMinutes == minutes && todayHour != hour){
                if(todayHour > hour){
                    endMinutes = minutes
                    endHour = todayHour - hour 
                    statusHour = "sub"
                    statusMinute = 'eql'
                }else if(todayHour < hour){
                    endMinutes = minutes
                    endHour = hour - todayHour
                    statusHour = "add"
                    statusMinute = 'eql'
                }
            }else if(todayMinutes != minutes && todayHour == hour){
                if(todayMinutes > minutes){
                    endHour = hour
                    endMinutes = todayMinutes - minutes 
                    statusHour = "eql"
                    statusMinute = 'sub'
                }else if(todayMinutes < minutes){
                    endHour = hour
                    endMinutes = minutes - todayMinutes
                    statusHour = "eql"
                    statusMinute = 'add'
                }
            }

            // console.log("end times")
            // console.log(endHour +":"+endMinutes)
            // console.log(statusHour +":"+statusMinute)
        

            switch(statusHour){
                case 'add':
                    tte = tte + (endHour * 60 * 60 * 1000)  // 1 ora 60 minuti 3600 secondi 3600000 ms
                    break;
                case 'sub':
                    tte = tte - (endHour * 60 * 60 * 1000)  // 1 ora 60 minuti 3600 secondi 3600000 ms
                    break;
                case 'eql':
                    //
                    break;
            }

            switch(statusMinute){
                case 'add':
                    tte = tte + (endMinutes * 60 * 1000)  // 1 minuto 60 secondi 60000 ms
                    break;
                case 'sub':
                    tte = tte - (endMinutes * 60 * 1000)  // 1 minuto 60 secondi 60000 ms
                    break;
                case 'eql':
                    //
                    break;
            }

            
            if(date == 0){
                if(statusMinute == 'sub' && statusHour == 'sub'){
                    return message.reply('sorry what doink?')
                }else if(statusMinute == 'add' && statusHour == 'sub'){
                    //all should be good smh
                    console.log("should be handled correclty ")
                }else if(statusMinute == 'sub' && statusHour == 'add'){
                    //all should be good smh
                    console.log("should be handled correclty too")
                }else{
                    console.log("tte: " +tte)
                }
            }else{
                daysToWait = date * 84600 * 1000 // days -> seconds -> ms
                tte = tte + daysToWait

                console.log("tte: " +tte)
            }
        }

        function getJudgeStats(i){
            request({
                url: `https://open.faceit.com/data/v4/players?nickname=`+judges[i],
                headers: {
                    'Authorization': `Bearer ${process.env.JUSTICE_BEARER_KEY}`
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