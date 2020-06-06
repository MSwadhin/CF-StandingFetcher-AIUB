

/// standings[i] -> [rank,handle,name]
function show(standings){

    cur = "<ul class='text-left'>";
    for(i=0;i<standings.length;i++){
        cur += "<li>";
        cur += i+1;
        cur += " (";
        cur += standings[i][0];
        cur += "). ";
        cur += standings[i][1];
        cur += " (";
        cur += standings[i][2];
        cur += ") ";
        cur += "</li>";
    }
    cur += "</li>";
    document.getElementById("container").innerHTML = cur;

}

function fetch(userList,contestId){
    var url = " https://codeforces.com/api/contest.standings?contestId="+contestId+"&handles=";
    var names = "";
    var sz = userList.length;
    for(var i=0;i<sz;i++){
        names += userList[i].handle;
        if(i<sz-1){
            names += ";";
        }
    }
    url += names;
    url += "&showUnofficial=false";
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if( xmlhttp.readyState==4 && xmlhttp.status==200 ){
            var standings = JSON.parse(xmlhttp.responseText);
            // console.log(standings);
            standings = standings['result'];
            var rows = standings.rows;
            var len = rows.length;
            var ranks = [];
            for(var i=0;i<len;i++){
                var handle = rows[i].party.members[0].handle;
                var rank = rows[i].rank;
                for(var j=0;j<sz;j++){
                    if( userList[j].handle == handle ){
                        var name  = "";
                        if( typeof(userList[j].firstName)=="string" ){
                            name += userList[j].firstName;
                            name += " ";
                        }
                        if( typeof(userList[j].lastName)=="string" ){
                            name += userList[j].lastName;
                        }
                        var currentUser = [];
                        currentUser.push(rank);
                        currentUser.push(handle);
                        currentUser.push(name);
                        ranks.push(currentUser);
                    }
                }
            }
            // console.log(standings);
            // console.log(ranks);
            show(ranks);
        }
    }
    xmlhttp.open("GET",url,true);
    xmlhttp.timeout = 500000;
    xmlhttp.ontimeout = function(){
        alert("TIMEOUT  2");
    }
    xmlhttp.send();
}

function callbackusers(users,contestId){
    fetch(users,contestId);
}




/*
**** Find Institute Handles
*/
var institute = "american international university bangladesh";
var institute2 = "aiub";
/// Returns True If Passed String Contains Institute Name
function checker(str){
    var arr = str.toLowerCase();
    var tar = institute.split(" ");
    var pos = [-1,-1,-1,-1];
    var x = -1;
    var sz = tar.length;
    if( arr.search(institute2) != -1 )return true;
    for(var i=0;i<sz;i++){
        var j = arr.search(tar[i]);
        if( j<=x )return false;
        if( j==-1 )return false;
        x = j;
    }
    return true;
}


function getContestStanding(contestId){
    var xmlhttp = new XMLHttpRequest();
    var users = [];
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var dirObjAll = JSON.parse(xmlhttp.responseText);
            dirObjAll = dirObjAll['result'];
            var cnt = 0;
            // console.log(dirObjAll);
            for(i=0;i<dirObjAll.length;i++){
                if( typeof(dirObjAll[i].organization)==="undefined" ){
                    continue;
                }
                if( typeof(dirObjAll[i].organization == "string") ){
                    if( dirObjAll[i].organization=="" )continue;
                    if( checker(dirObjAll[i].organization)==true ){
                        cnt++;
                        users.push(dirObjAll[i]);
                    }
                }
            }
            callbackusers(users,contestId);
	    }
    }
    var url = "https://codeforces.com/api/user.ratedList?activeOnly=true";
    xmlhttp.open("GET", url, true);
    xmlhttp.timeout = 500000;
    xmlhttp.ontimeout = function(){
        alert("TIMEOUT");
    }
    xmlhttp.send();
}
