// =================> SHOW MENU <==================
const navMenu = document.getElementById('nav_menu')
const navToggle = document.getElementById('nav-toggle')
const navClose = document.getElementById('nav-close')

if (navToggle){
    navToggle.addEventListener('click',()=>{
        navMenu.classList.add('show-menu')
    })
}

// =================> CLOSE MENU <==================
if  (navClose){
    navClose.addEventListener('click',()=>{
        navMenu.classList.remove('show-menu')
    })
}


//  ============= REMOVE MENU IN MOBILES ============

const navLink = document.querySelectorAll('.nav__link')
const linkAction = () =>{
    navMenu.classList.remove('show-menu')
}

navLink.forEach(x => x.addEventListener('click',linkAction))


// ================ ADD BLUR TO HEADER ON SCROLL ============
const myblurHeader = () =>{
    const header = document.getElementById('header')
    // when scroll is above 50 of vh height then add else remove
    if (window.scrollY >= 50){
        header.classList.add('blur-header')
    }
    else{
        header.classList.remove('blur-header')
    }
}

window.addEventListener('scroll', myblurHeader)


// ============== SCROLL SECTIONS ACTIVE-LINK  ==============
const sections = document.querySelectorAll('section[id]')

const scrollActive=()=>{
    const scrollY = window.pageYOffset

    sections.forEach(currentSec => {
        const sectionheight = currentSec.offsetHeight
        const sectionTop =  currentSec.offsetTop-50
        const sectionId = currentSec.getAttribute('id')
        const sectionClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
        
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionheight){
        sectionClass.classList.add('active-link')
    }
    else{
        sectionClass.classList.remove('active-link')
    }

    // console.log("sectionheight"+sectionheight)
    // console.log("sectionTop"+sectionTop)
    // console.log("sectionId"+sectionId)
    // console.log("sectionClass "+sectionClass)

    })
    
}

window.addEventListener('scroll',scrollActive)


// ============================= HOME-IMG CHANGE ===========================
const changeIMG =()=>{
    const homeIMG = document.getElementById('home__bg')
    const width = window.innerWidth;

    if (width > 768) { 
    // Large screen
    homeIMG.src = "./img/home-bg-5.jpeg";
    } 
    else 
    { // Small screen
        homeIMG.src = "./img/home-bg-4.png";
    }
} 

window.addEventListener('resize', changeIMG)