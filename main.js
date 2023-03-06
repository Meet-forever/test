import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from '@studio-freight/lenis'
gsap.registerPlugin(ScrollTrigger);


const lenis = new Lenis({
    duration: 2.2,
    easing: (t) => {
        return Math.min(1, 1.001 - Math.pow(2, -9 * t))
    }
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf);


// Animation TimeLine
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".container",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        // markers: true,
    },
});


// Parallax
gsap.from(".main-heading", {opacity: 0, fontSize: "1rem", duration: 1})
gsap.utils.toArray(".parallax").forEach(layer => {
    const depth = layer.dataset.depth;
    const movement = (layer.offsetHeight * depth);
    tl.to(layer, {
        y: movement, ease: "none", scrollTrigger: {
            trigger: layer.dataset.part,
            scrub: true
        }
    })
})


// Moving heading based on mouse position
const factor = 0.02
const bannerEle = document.getElementsByClassName("mouse-move");
Array.from(bannerEle, (ele) => {
    ele.addEventListener('mousemove', (e) => {
        ele.style.left = factor*e.clientX + "px"
        ele.style.top = factor*e.clientY + "px"
    })
})



const chat = document.getElementById("conv");
chat.style.visibility = 'hidden'
const coordinateMapper = (x, y) => {
    if((y < 0.66 && y > 0.08) && (x > 40 && x < 54)){
        // zoom the person near the window
        return [0,18,1.8, 0]
    }
    else if(( y < 0.81 && y > 0.36) && ( x > 5 && x < 37)){
        // zoom left side
        return [20,-1,1.8,1]
    }
    else if( (y > 0.44) && (x > 50)){
        // zoom right side
        return [-22,-8,1.8, 2]
    }
    else{
        // do nothing
        return [0,0,1,-1]
    }
}

const startTalking = (pick) =>{
    let i = 0;
    const talk = [
        ["I don't know why I am here! 🤡", " "], 
        ["Omg!!", "So many assignment deadlines!!", "I am going to fail this class so bad.", "💀", " "], 
        ["Hello", "Hi", "How are you officer?", "Great! 🤠", " "]];
    const interval = setInterval(()=>{
        if(i < talk[pick].length) chat.innerText = talk[pick][i];
        if(i >= talk.length){
            clearInterval(interval);
        }
        i++;
    }, 2000);
    return interval;
}

// Image zoom In and Out
let state = false;
const policeOffice = document.getElementById("police-office");
let chatInterval = undefined;
if(policeOffice) policeOffice.addEventListener("click", (e)=>{
    const rect = policeOffice.getBoundingClientRect();
    const xAxis = ((e.clientX-rect.left)/(rect.width))*100,
    yAxis = (e.clientY-rect.top)/rect.height;
    const [xCoord, yCoord, scale, pick] = coordinateMapper(xAxis,yAxis);
    policeOffice.style.transform = state? "scale(1) translateX(0%) translateY(0%)": `scale(${scale}) translateX(${xCoord}%) translateY(${yCoord}%)`;
    state = !state
    if(state){
        chat.innerText = ""
        chatInterval = startTalking(pick)
    }
    if(!state && chatInterval) clearInterval(chatInterval);
    chat.style.top = "40%"
    chat.style.left = "50%"
    chat.style.visibility = state? 'visible': 'hidden'
})