// canvas setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
pixelRatio = window.devicePixelRatio;
sizeOnScreen = canvas.getBoundingClientRect();
canvas.width = sizeOnScreen.width * pixelRatio;
canvas.height = sizeOnScreen.height * pixelRatio;
canvas.style.width = canvas.width / pixelRatio + "px";
canvas.style.height = canvas.height / pixelRatio + "px";




// let oscs = []
let dataArrays = []
let colors = []
let analysers = []

//add an event listener (because audio can't autoplay!)   
const createTHXButton = document.querySelector('.create-thx');
createTHXButton.addEventListener('click', function(){
window.AudioContext = window.AudioContext||window.webkitAudioContext;
audioContext = new window.AudioContext();
dataArrays = []
colors = []
analysers = []
let randomFftSize = (Math.pow(2, (5 + randomInteger(8))))



var compressor = audioContext.createDynamicsCompressor();
compressor.connect( audioContext.destination );

start_rand_nodes = callPartialsStart();
end_rand_nodes = callPartialsEnd();




let isPlaying;

// loop
for( var i=0; i<(30 + Math.floor(Math.random() * 79)); i++ )
{
var osc = audioContext.createOscillator();

osc.frequency.setValueAtTime( ( 51 * Math.floor( Math.random()*Math.random()*3 + 1) * Math.floor(1 + Math.random() * 11)), 0 );
osc.detune.setValueAtTime( Math.random()*20-10, 0 );
osc.type = "sawtooth";
// oscs.push(osc)
let color = randomHexColor()
colors.push(color)
for( var t=0; t<3; t++ )
{
    if( Math.random() < 0.1 )
    {
        osc.frequency.exponentialRampToValueAtTime( 200 + Math.random()*200, t*1+Math.random() );
    }
}

osc.frequency.exponentialRampToValueAtTime(( 51 * Math.floor( Math.random()*Math.random()*3 + 1) * Math.floor(start_rand_nodes + Math.random() * end_rand_nodes)), 8 );

for( var t=0; t<4; t++ )
{
    osc.detune.setValueAtTime( Math.random()*30-15, t*2+Math.random() );
}

var filter = audioContext.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 3000 + Math.random()*2000;
filter.Q.value = Math.random()*2;

var amp = audioContext.createGain();
amp.gain.setValueAtTime( 0, 0 );
amp.gain.linearRampToValueAtTime( 1, 5 + Math.random()*5 );
amp.gain.setValueAtTime( 1, 14 );
amp.gain.linearRampToValueAtTime( 0, 19 );

var panner = audioContext.createPanner();
panner.setPosition( Math.random()*2-1, Math.random()*2-1, Math.random()*2-1 );
let analy = new AnalyserNode(audioContext, {
    smoothingTimeConstant: 0.8,
    fftSize: randomFftSize
  })
analysers.push(analy) 
let dArray = new Uint8Array(analysers[i].frequencyBinCount);
dataArrays.push(dArray)

  

osc.connect( filter );
filter.connect( amp );
amp.connect( panner );
panner.connect(analysers[i]);
analysers[i].connect( compressor );

osc.start(0);

osc.stop(20);
}
animate() 




})
function callPartialsStart(){
x =  1 + Math.floor(Math.random() * 12);   
return x;
}

function callPartialsEnd(){
y = (3 + Math.floor(Math.random() * 5)) + Math.floor(Math.random() * 17);   
return y;
}



function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0, canvas.width, canvas.height)
    // console.log("check", dataArrays.length)

    for (let i = 0;i<dataArrays.length;i++) {
        console.log("check", i)
        let analyser = analysers[i]
        segmentWidth = canvas.width / analyser.frequencyBinCount;
        console.log("check", analyser)
        console.log("check", dataArrays[i])
        analyser.getByteTimeDomainData(dataArrays[i])
        c.beginPath()
        c.moveTo(-100, canvas.height / 2);
        
            for (let j = 1; j < analyser.frequencyBinCount; j += 1) {
              let x = j * segmentWidth;
              let v = (dataArrays[i][j] / 128.0);
              let y = ((v * canvas.height) / 2) - (i * 2);
              c.lineTo(x, y);
            }
        
        c.lineTo(canvas.width + 100, canvas.height / 2);
        c.stroke()
        c.strokeStyle = colors[i]

    }
}

    

function randomInteger(max) {
    return Math.floor(Math.random()*(max + 1));
}

function randomRgbColor() {
    let r = randomInteger(255);
    let g = randomInteger(255);
    let b = randomInteger(255);
    return [r,g,b];
}
function randomHexColor() {
    let [r,g,b] =randomRgbColor();
    let hr = r.toString(16).padStart(2, '0');
    let hg = g.toString(16).padStart(2, '0');
    let hb = b.toString(16).padStart(2, '0');
    return "#" + hr + hg + hb;
}