threeButton = document.getElementById("threeButton");
twoButton = document.getElementById("twoButton");
freeThrow = document.getElementById("freeThrow");
header = document.getElementById("header");
upThreeButton = document.getElementById("upThree");
upTwoButton = document.getElementById("upTwo");
upFreeButton = document.getElementById("upFree");
threePercentCost = document.getElementById("threeCost");
twoPercentCost = document.getElementById("twoCost");
freePercentCost = document.getElementById("freeCost");
threeButton.addEventListener("click", takeThree);
twoButton.addEventListener("click", takeTwo);
freeThrow.addEventListener("click", takeShot);
upThreeButton.addEventListener("click", buyThreePointPercent);
upTwoButton.addEventListener("click", buyTwoPointPercent);
upFreeButton.addEventListener("click", buyFreeThrowPercent);

var buttonArray = [upThreeButton, upTwoButton, upFreeButton];
var textArray = [threePercentCost, twoPercentCost, freePercentCost];




//Dictionary Object Containing Costs
var totals = {
    points : 0,
};

function Percentages(cost, percent, button, text){
    this.cost = cost;
    this.percent = percent;
    this.button = button;
    this.text = text;

}
Percentages.prototype.set = function(percentage){
    this.cost = percentage.cost;
    this.percent = percentage.percent;
};
Percentages.prototype.getCost = function(){
    return this.cost;
};


var threePointCostArray = new Percentages(5,36, upThreeButton,threePercentCost);
var twoPointCostArray = new Percentages(5,46,upTwoButton,twoPercentCost);
var freePointCostArray = new Percentages(5,77,upFreeButton,freePercentCost);
var costArrays = [threePointCostArray,twoPointCostArray, freePointCostArray];
$(document).ready(load);
$(document).ready(showPercent);
checkPurchase();

//shoots a shot
function takeShot(distance){
    switch(distance){
        case 3:
            if(throwChance(parseInt(threePointCostArray.percent))){
                totals.points += 3;
            }
            disableShot();
            timeEnable(1000);
            break;
        case 2:
            if(throwChance(twoPointCostArray.percent)){
                totals.points+=2;
            }
            disableShot();
            timeEnable(500);
            break;
        default:
            if(throwChance(freePointCostArray.percent)){
                totals.points+=1;
            }
            disableShot();
            timeEnable(375);
    }
    checkPurchase();
    refresh();
    save();
}
function throwChance(percent){
    rand = Math.floor((Math.random() * 100) + 1);
    net = rand <= percent;
    return net;
}
function refresh(){
    header.innerText = "You've scored " + totals.points + " points";
}
function takeThree(){
    takeShot(3);
}
function takeTwo(){
    takeShot(2);
}

//Saves data to local storage
function save(){
    localStorage.setItem("totals", JSON.stringify(totals));
    localStorage.setItem("threePointTotals", JSON.stringify(threePointCostArray));
    localStorage.setItem("twoPointTotals", JSON.stringify(twoPointCostArray));
    localStorage.setItem("freeThrowTotals", JSON.stringify(freePointCostArray));
    costArrays = [threePointCostArray,twoPointCostArray, freePointCostArray];
}

//loads data from local storage
function load(){
    //var threePointCostArray = new Percentages(5,upThreeButton,threePercentCost);
    //var twoPointCostArray = new Percentages(5,upTwoButton,twoPercentCost);
    //var freePointCostArray = new Percentages(5,upFreeButton,freePercentCost);
    var savedTotals = JSON.parse(localStorage.getItem("totals"));
    var savedThreeTotals = JSON.parse(localStorage.getItem("threePointTotals"));
    var savedTwoTotals = JSON.parse(localStorage.getItem("twoPointTotals"));
    var savedFreeTotals = JSON.parse(localStorage.getItem("freeThrowTotals"));
    console.log(savedTotals);
    for(var zkey in savedTotals){
        console.log("zkey is " + savedTotals[zkey]);
        if((savedTotals[zkey]=== null || savedTotals[zkey]=== undefined)){
                totals[zkey] = 0;
        }else{
            totals[zkey]=savedTotals[zkey];
            console.log(totals);
        }
    }
    if(!isNull(savedThreeTotals)){
        threePointCostArray.set(savedThreeTotals);
        threePointCostArray.button = upThreeButton;
        threePointCostArray.text = threePercentCost;
    }if(!isNull(savedTwoTotals)){
        twoPointCostArray.set(savedTwoTotals);
        twoPointCostArray.button = upTwoButton;
        twoPointCostArray.text = twoPercentCost;
    }if(!isNull(savedFreeTotals)){
        freePointCostArray.set(savedFreeTotals);
        freePointCostArray.button = upFreeButton;
        freePointCostArray.text = freePercentCost;
    }
    costArrays = [threePointCostArray,twoPointCostArray, freePointCostArray];
    refresh();
}
function isNull(checkVar){
    return(checkVar===null || checkVar=== undefined);
}
//runs enable script after entered timeout
function timeEnable(time){
    time = parseInt(time);
    setTimeout(enableShot,time);
}
//Enables purchasing
function checkPurchase(){
    console.log("checkpurchase run");
    for(var key in costArrays){
        arrayKey = costArrays[key];
        if(totals.points >= arrayKey.cost) {
           arrayKey["button"].disabled = false;
           console.log("cost is " + arrayKey.cost);
           console.log("button is" + arrayKey.button);
           console.log("false");
       }else{
            arrayKey["button"].disabled = true;
            console.log("true");

       }
       arrayKey.text.innerText = arrayKey.cost + " points";
    }}
//runs makepurchase for buttons
function buyThreePointPercent(){
    makePurchase(3);
}
function buyTwoPointPercent(){
    makePurchase(2);
}
function buyFreeThrowPercent(){
    makePurchase();
}

//buys stuff
function makePurchase(type){
    switch(type){
        case 3:
            totals.points -= threePointCostArray.cost;
            threePointCostArray.cost += Math.ceil(threePointCostArray.cost * .1);
            threePointCostArray.percent += 1;
            break;
        case 2:
            totals.points -= twoPointCostArray.cost;
            twoPointCostArray.cost += Math.ceil(twoPointCostArray.cost * .1);
            twoPointCostArray.percent += 1;
            break;
        default:
            totals.points -= freePointCostArray.cost;
            freePointCostArray.cost += Math.ceil(freePointCostArray.cost * .05);
            freePointCostArray.percent += 1;
    }
    refresh();
    showPercent();
    checkPurchase();
    save();
}
//disables buttons
function disableShot(){
    threeButton.disabled = true;
    freeThrow.disabled = true;
    twoButton.disabled = true;
}

//re-enables buttons
function enableShot(){
    threeButton.disabled = false;
    freeThrow.disabled = false;
    twoButton.disabled = false;
}

//Shows percentages in UI
function showPercent(){
    showThree= document.getElementById("threePercent");
    showTwo= document.getElementById("twoPercent");
    showFree= document.getElementById("freePercent");

    showThree.innerText = "Three Point Percent: " + threePointCostArray.percent;
    showTwo.innerText = "Two Point Percent: " + twoPointCostArray.percent;
    showFree.innerText = "Free Throw Percent: " + freePointCostArray.percent;
}
