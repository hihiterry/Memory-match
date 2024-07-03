
let gameMap_nums2D;
/*
 1, 2, 3...覆蓋的牌的編號對
-1,-2,-3...打開的牌的編號對
*/
let wantedWidth_num = 2;
let gameState_num = 0;//0未開始,1進行中,2勝利
let timeCount_num = 0;
let openCards = [];

generateMap(wantedWidth_num);
addButtonsToHTML(wantedWidth_num);

//設定按鈕
document.getElementById("w2").onclick=()=>{wantedWidth_num=2};
document.getElementById("w4").onclick=()=>{wantedWidth_num=4};
document.getElementById("w6").onclick=()=>{wantedWidth_num=6};
document.getElementById("w8").onclick=()=>{wantedWidth_num=8};
document.getElementById("w10").onclick=()=>{wantedWidth_num=10};
document.getElementById("changeWidthButton").onclick=initialize;
document.getElementById("startButton").onclick=startGame;

//初始化
function initialize() {
    gameState_num=0;
    timeCount_num=0;
    generateMap(wantedWidth_num);
    addButtonsToHTML(wantedWidth_num);
    document.getElementById("clock").textContent=`Time:${timeCount_num} s`;
}

//開始遊戲
function startGame() {
    initialize();
    tempDisplayMap(true);
    document.getElementById("changeWidthButton").disabled = true;
    document.getElementById("startButton").disabled = true;
    setTimeout(() => {
        tempDisplayMap(false);
        gameState_num = 1;
        document.getElementById("changeWidthButton").disabled = false;
        document.getElementById("startButton").disabled = false;
    }, 5000);
}

setInterval(timeUpdate,1000)
//計時器
function timeUpdate() {
    if(gameState_num==1){
        timeCount_num++;
    }
    if(gameState_num===2){
        document.getElementById("clock").textContent=`Time:${timeCount_num} s You win`;
    }else{
        document.getElementById("clock").textContent=`Time:${timeCount_num} s`;
    }
}

//顯示全地圖
function tempDisplayMap(open_bool) {
    for(let i_num=0;i_num<gameMap_nums2D.length;i_num++){
        for(let j_num=0;j_num<gameMap_nums2D.length;j_num++){
            document.getElementById("image"+i_num+"-"+j_num).style.visibility= open_bool ? `visible`:`hidden`;
        }
    }
}

//生成地圖
function generateMap(width_num){
    gameMap_nums2D=[];
    for(let i_num=0;i_num<width_num;i_num++){
        let row_nums1D=[];
        for(let j_num=0;j_num<width_num;j_num++){
            row_nums1D.push(0);
        }
        gameMap_nums2D.push(row_nums1D);
    }
    for(let i_num=0;i_num<width_num*width_num/2;i_num++){
        for(let j_num=0;j_num<2;j_num++){
            let x_num,y_num;
            do {
                x_num=Math.floor(Math.random()*width_num);
                y_num=Math.floor(Math.random()*width_num);
            } while (gameMap_nums2D[y_num][x_num]!=0);
            gameMap_nums2D[y_num][x_num]=i_num+1;
        }
    }
}

// 處理翻牌
function handleButtonClick(j_num, i_num) {
    if (gameState_num != 1 || gameMap_nums2D[i_num][j_num] < 0) {
        return;
    }
    const clickedImage = document.getElementById("image" + i_num + "-" + j_num);
    clickedImage.style.visibility = 'visible';
    openCards.push({ i_num, j_num, value: gameMap_nums2D[i_num][j_num] });
    if (openCards.length === 2) {
        const [firstCard, secondCard] = openCards;
        if (firstCard.value === secondCard.value) {
            gameMap_nums2D[firstCard.i_num][firstCard.j_num] = -firstCard.value;
            gameMap_nums2D[secondCard.i_num][secondCard.j_num] = -secondCard.value;
            openCards = [];
            if (isOver()) {
                gameState_num = 2;
                document.getElementById("clock").textContent=`Time:${timeCount_num} s You win`;
            }
        } else {
            setTimeout(() => {
                clickedImage.style.visibility = 'hidden';
                document.getElementById("image" + firstCard.i_num + "-" + firstCard.j_num).style.visibility = 'hidden';
                openCards = [];
            }, 200);
        }
    }
}

//勝利判定
function isOver() {
    return gameMap_nums2D.every(row => row.every(cell => cell < 0));
}

//生成按鈕
function addButtonsToHTML(width_num){
    document.getElementById("mainPlayBox").innerHTML = '';
    for(let i_num=0;i_num<width_num;i_num++){
        for(let j_num=0;j_num<width_num;j_num++){
            let newButton=document.createElement('button');
            newButton.id="button"+String(i_num)+"-"+String(j_num);
            newButton.style.width = `${50/width_num}vh`;
            newButton.style.height = `${50/width_num}vh`;
            newButton.className='buttons';

            let newButtonImage=document.createElement('img');
            newButtonImage.id="image"+String(i_num)+"-"+String(j_num);

            let scr_str = "images/"+gameMap_nums2D[i_num][j_num]+".png";

            newButtonImage.setAttribute("src",scr_str);
            newButton.style.width = `${50/width_num}vh`;
            newButton.style.height = `${50/width_num}vh`;
            newButtonImage.style.visibility=`hidden`;
            newButton.appendChild(newButtonImage);

            newButton.onclick = (function(j_num, i_num) {
                return function() {
                    handleButtonClick(j_num, i_num);
                };
            })(j_num, i_num);
            document.getElementById("mainPlayBox").appendChild(newButton);
        }
    }
}
