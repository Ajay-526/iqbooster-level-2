const gameArea=document.querySelector('.game');
const gameoptions=document.querySelector('.gameoptions');
const btn=document.createElement('button');
const btn1=document.createElement('button');
const output=document.createElement('div');
const message=document.createElement('div');

var count = 0;

btn1.style.display='none';
btn.classList.add('startBtn');
btn1.classList.add('csvBtn');
output.textContent="Click button to start game";
btn.textContent="start game";
output.classList.add('output');
message.classList.add('message');

gameArea.append(message);
gameArea.append(output);
gameArea.append(btn);
gameArea.append(btn1);

const opts=['*','/','+','-'];
const game={correct:'',maxvalue:10,question:10,ovals:[0,1,2,3],curQue:0,hiddenVal:3};
const player={correct:0,incorrect:0,score:[],playerName:'tester'};
btn.addEventListener('click',startGame);
btn1.addEventListener('click',createCSV);
function startGame(){
    btn1.style.display='none';
    btn.style.display='none';
    gameoptions.style.display='none';
    //console.log(player);
    player.score.length=0;
    player.correct=0;
    player.incorrect=0;
    //console.log(player);
    getValues();
    buildBoard();
}
function buildBoard(){
    output.innerHTML='';
    for(let i=0;i<game.question;i++)
    {
        const div=document.createElement('div');
        div.classList.add('question');
        div.indexval=i;
        div.append(document.createTextNode(i+1+'Q````'));
        output.append(div);
        buildQuestions(div);
    }
}
function buildQuestions(div){
    let vals=[];
    vals[0]=Math.ceil(Math.random()*(game.maxvalue));
    let tempmax=game.maxvalue+1;
    game.ovals.sort(()=>{return 0.5- Math.random()});
    if(game.ovals[0] == 3)
    {
        tempmax=vals[0];
    }
    vals[1]=Math.floor(Math.random()*tempmax);
    if(game.ovals[0] == 0)
    {
        if(vals[1] ==0 ){vals[1]=1;}
        if(vals[0] ==0){vals[0]=1;}
    }
    if(game.ovals[0] == 1)
    {
        if(vals[0] == 0) { vals[0] =1;}
        let temp=vals[0]*vals[1];
        vals.unshift(temp);
    }else{
        vals[2]=eval(vals[0]+ opts[game.ovals[0]]+vals[1]);
    }
    vals[3]=opts[game.ovals[0]];
    let hiddenVal;
    if(game.hiddenVal !=3){
        hiddenVal=game.hiddenVal;
    }else{
        hiddenVal=Math.floor(Math.random()*3);
    }
    const answer=document.createElement('input');
    const myBtn=document.createElement('button');
    answer.setAttribute('type','number');
    answer.setAttribute('max',999);
    answer.setAttribute('min',0);
    answer.classList.add('boxAnswer');
    answer.addEventListener('Keyup',(e)=>{
        if(e.code == 'Enter'){
            checkAnswer();
        }
    })
    function checkAnswer(){
        player.score[div.indexval][4]= true;
        answer.disabled = true;
        if(answer.correct == answer.value){
            player.score[div.indexval][3] ='correct';
            div.style.backgroundColor='green';
            myBtn.style.backgroundColor='green';
        }
        else{
          player.score[div.indexval][3]= 'wrong';
          div.style.backgroundcolor= 'red';
          myBtn.style.backgroundcolor= 'red';
          count+=1;  
        }

        checkComplete();
        myBtn.textContent = "correct answer = "+answer.correct;
        }
        function checkComplete(){
            let cnt=0;
            player.score.forEach((el)=>{
                console.log(el[4]);
                if(el[4]){
                    cnt++;
                }
            })
            if(cnt >= game.question){
                console.log('Game Over');
                btn.style.display='block';
                btn1.style.display='block';
                btn1.textContent='Downloadscore';
            }
            console.log('questions done'+cnt);
        }
        let ansx=[];
        let quex=[];
        for(let i=0;i<3;i++)
        {
            ansx.push(vals[i]);
            if(hiddenVal == i)
            {
                quex.push('_');
                answer.correct=vals[i];
                div.append(answer);
            }
            else{
                maker1(div,vals[i],'box');
                quex.push(vals[i]);
            }
            if(i==0)
            {
                let tempsign = vals[3] == '*' ? '&times;' : vals[3];
                ansx.push('x');
                quex.push('x');
                maker1(div,tempsign,'boxsign');
            }
            if(i==1)
            {
                ansx.push('=');
                quex.push('=');
                maker1(div,'=','boxsign');
            }
            if(i==2)
            {
               myBtn.classList.add('myBtn');
               myBtn.textContent='check';
               myBtn.addEventListener('click',checkAnswer,{once:true});
               div.append(myBtn); 
            }
            }
            quex=quex.join('');
            ansx=ansx.join('');
            player.score.push([div.indexval,quex,ansx,false,false]);
        }
        function maker1(div,v,cla){
            const temp = document.createElement('div');
            temp.classList.add(cla);
            temp.innerHTML=v;
            div.append(temp);
        }

function getValues(){
            game.maxvalue = Number (document.querySelector('#maxval').value);
            game.question=document.querySelector('#numquestions').value;
            let temp=document.querySelector('#selopt');
            let tempArr=[];
            for(let i=0;i<temp.options.length;i++)
            {
                if(temp.options[i].selected){
                    tempArr.push(i);
                };
            }
            game.ovals = tempArr;
        }
        function createCSV(){
            let file;
            let holder = [];
            let filename = player.playerName + '.csv';
            let properties = {
                type:"text/csv;charset=utf-8;"
            }
            player.score.forEach((el)=>{
                console.log(el);
                holder += clean(el) + '\n';
            })
            file=new File([holder],filename,properties);
            let link=document.createElement('a');
            let url = window.URL.createObjectURL(file);
            link.setAttribute('href',url);
            link.setAttribute('download',filename);
            link.style.visibility='hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(holder);
            if(count >= (game.question/2))
            {
                alert('You are not moving to the next level - Please view the report');
                //alert(game.question/2);
                location.reload();
            }
            else{
                alert('You are moving to the next level');
                location.href = 'https://ajay-526.github.io/iqbooster-level-3/';
            }
        }

    
function clean(row){
    let rep='';
    row.forEach((cell,index)=>{
        cell = cell == null ? "" : cell.toString();
        if(cell.search(/("|,|\n)/g) >=0 ) cell = '"' + cell +'"';
        if(index > 0) rep += " ,";
        rep += cell;
    })
    return rep;
}
