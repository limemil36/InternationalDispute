import * as THREE from'/build/three.module.js';





///////////////////////////////////////////////////////////////////////////////////

//기본 변수 선언 및 지정

///////////////////////////////////////////////////////////////////////////////////





let camera, scene, renderer, light, light2;

let container = document.querySelector( '#webdolRayCaster' );

let body = document.querySelector('body');
let pannelCont = document.querySelector('#pannel');
let category = document.querySelector('#category');
let btnRed = document.querySelector('#redBtn');
let btnOrange = document.querySelector('#orangeBtn');
let btnYellow = document.querySelector('#yellowBtn');
let circleRed = document.querySelector('#circleRed');
let circleOrange = document.querySelector('#circleOrange');
let circleYellow = document.querySelector('#circleYellow');
let h4 = document.querySelectorAll('h4');

let hr = document.querySelector('hr');
let menuCont = document.querySelector('#menuCont');
let nameSmall = document.querySelector('#nameSmall');
let nameBig = document.querySelector('#nameBig');
let home = document.querySelector('#home');

let article = document.querySelectorAll('.scroll');
let scrollCont = document.querySelector('#scrollCont');
let glassCont = document.querySelector('#glassCont');
let glass1 = document.querySelector('#glass1');
let glass2 = document.querySelector('#glass2');
let articleImg1 = document.querySelector('#articleImg1');
let articleImg2 = document.querySelector('#articleImg2');
let h1 = document.querySelector('h1');
let h3 = document.querySelector('h3');
let h5 = document.querySelector('h5');
let downIcon = document.querySelector('#downIcon');

let vidCont = document.querySelector('#bg-video');
let myVideo = document.querySelector('#myVideo');
let gradation = document.querySelector('#gradation');

let tip = document.querySelector("#tip");

let hoveredMarker = 0;
let colorScene = 3;
let scrollScene = 6;
let redScene = 0;
let orangeScene = 0;
let yellowScene = 0;
let allScene = 1;
let articleScene = 2;
let showScene = 0;
let glassScene1 = 0;
let glassScene2 = 0;
let targetRotation = { x: 0, y: 0 };
let isRotating = false;
let spinScene = 3;

let clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function lerp(start, end, t) {
    return start + (end - start) * t;
}
let targetCameraPosition = new THREE.Vector3(0, 0, 100); 
let targetFOV = 75; 





///////////////////////////////////////////////////////////////////////////////////

//scene에 넣을 것들 추가

///////////////////////////////////////////////////////////////////////////////////





const mapAlpha = textureLoader.load(
    "/examples/textures/earth_alpha.png",
    texture => {}
);

let earthSphere = new THREE.SphereGeometry(1, 12,6);

const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
        globeTexture: { value: mapAlpha }
    },
    vertexShader: `
        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        void main() {
            vertexUV = uv;
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.03);
        }
    `,
    fragmentShader: `
        uniform sampler2D globeTexture;
        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        void main() {
            float intensity = 1.05 - dot(vertexNormal, vec3(0., 0., 1.));
            vec3 atmosphere = vec3(0.84, 0.3, 0.3) * pow(intensity, 1.5);
            vec4 color = texture2D(globeTexture, vertexUV);
            gl_FragColor = vec4(atmosphere + color.xyz, 1.0);
        }
    ` //왜 되는거임?????
});


const earth = new THREE.Mesh(earthSphere, earthMaterial);

let effectSphere = new THREE.SphereGeometry(0.98, 12,6);
const effectMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    transparent:true,
    opacity:0.4,
    wireframe : true
});

const effect = new THREE.Mesh(effectSphere, effectMaterial);

let geometrylight = new THREE.SphereGeometry(1.2, 64, 32);
const lightMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vertexNormal;
        void main() {
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.1);
        }
    `,
    fragmentShader: `
        varying vec3 vertexNormal;
        void main() {
            float intensity = pow(0.45 - dot(vertexNormal, vec3(0,0,1.)), 2.0);
            gl_FragColor = vec4(0.84, 0.3, 0.3, 1) * intensity;
        } 
    `,//그저 빛
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
});

const lightEarth = new THREE.Mesh(geometrylight, lightMaterial);

light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 1, 1, 1 ).normalize();
light2 = new THREE.AmbientLight( 0xffffff, 1.5 );
light2.position.set( -1, -1, -1 ).normalize();


//마커 생성, 위치 지정, 이름 부여


const radius = 0.96;
function markPosVector3(latitude, longitude, radius) {
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

const y_is = -5; 
const x_is = -118;
const markerPosition_is = markPosVector3(y_is, x_is, radius);

const y_uk = 21.5; 
const x_uk = -106.5;
const markerPosition_uk = markPosVector3(y_uk, x_uk, radius);

const y_af = 6; 
const x_af = -97.5;
const markerPosition_af = markPosVector3(y_af, x_af, radius);

const y_ni = -21; 
const x_ni = -144;
const markerPosition_ni = markPosVector3(y_ni, x_ni, radius);

const y_my = -12.5; 
const x_my = -66;
const markerPosition_my = markPosVector3(y_my, x_my, radius);

const y_so = -25.1; 
const x_so = -115;
const markerPosition_so = markPosVector3(y_so, x_so, radius);

const y_ye = -12; 
const x_ye = -106;
const markerPosition_ye = markPosVector3(y_ye, x_ye, radius);

const y_ka = -3.5; 
const x_ka = -82;
const markerPosition_ka = markPosVector3(y_ka, x_ka, radius);

const y_ma = -5; 
const x_ma = 70;
const markerPosition_ma = markPosVector3(y_ma, x_ma, radius);

const markerGeometry = new THREE.SphereGeometry(0.05, 8,8);
const markerMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent:true, flatShading:true }); 
const markerMaterialRed1 = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent:true, flatShading:true }); 
const markerMaterialRed2 = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent:true, flatShading:true }); 
const markerMaterialOrange = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent:true, flatShading:true }); 
const markerMaterialOrange1 = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent:true, flatShading:true }); 
const markerMaterialOrange2 = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent:true, flatShading:true }); 
const markerMaterialOrange3 = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent:true, flatShading:true }); 
const markerMaterialYellow = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent:true, flatShading:true }); 
const markerMaterialYellow1 = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent:true, flatShading:true }); 

markerMaterialRed.side = THREE.DoubleSide;
markerMaterialRed1.side = THREE.DoubleSide;
markerMaterialRed2.side = THREE.DoubleSide;
markerMaterialOrange.side = THREE.DoubleSide;
markerMaterialOrange1.side = THREE.DoubleSide;
markerMaterialOrange2.side = THREE.DoubleSide;
markerMaterialOrange3.side = THREE.DoubleSide;
markerMaterialYellow.side = THREE.DoubleSide;
markerMaterialYellow1.side = THREE.DoubleSide;

const marker_is = new THREE.Mesh(markerGeometry, markerMaterialRed);
const marker_uk = new THREE.Mesh(markerGeometry, markerMaterialRed1);
const marker_af = new THREE.Mesh(markerGeometry, markerMaterialRed2);
const marker_ni = new THREE.Mesh(markerGeometry, markerMaterialOrange);
const marker_my = new THREE.Mesh(markerGeometry, markerMaterialOrange1);
const marker_so = new THREE.Mesh(markerGeometry, markerMaterialOrange2);
const marker_ye = new THREE.Mesh(markerGeometry, markerMaterialOrange3);
const marker_ka = new THREE.Mesh(markerGeometry, markerMaterialYellow);
const marker_ma = new THREE.Mesh(markerGeometry, markerMaterialYellow1);

marker_is.position.copy(markerPosition_is);
marker_uk.position.copy(markerPosition_uk);
marker_af.position.copy(markerPosition_af);
marker_ni.position.copy(markerPosition_ni);
marker_my.position.copy(markerPosition_my);
marker_so.position.copy(markerPosition_so);
marker_ye.position.copy(markerPosition_ye);
marker_ka.position.copy(markerPosition_ka);
marker_ma.position.copy(markerPosition_ma);

const markerRotations = [
    null,
    null,
    null,
    null,
    { x: -0.098, y: 0.459 },
    { x: 0.407, y: 0.276 },
    { x: 0.133, y: 0.156 },
    { x: -0.359, y: 0.953 },
    { x: -0.24, y: -0.398 },
    { x: -0.48, y: 0.472 },
    { x: -0.221, y: 0.303 },
    { x: -0.093, y: -0.135 },
    { x: -0.1, y: 3.51 }
];

const vertices = [];
for(let i = 0; i < 200; i++){
    const x = THREE.MathUtils.randFloatSpread(20);
    const y = THREE.MathUtils.randFloatSpread(20);
    const z = THREE.MathUtils.randFloatSpread(20);

    vertices.push(x, y, z);
}
const starsGeo = new THREE.BufferGeometry();
starsGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false
});

const stars = new THREE.Points(starsGeo, starMaterial);

const earthGroup = new THREE.Group();
earthGroup.add(earth);
earthGroup.add(effect);
earthGroup.add(lightEarth);
earthGroup.add(marker_is, marker_uk, marker_af, marker_ni, marker_my, marker_so, marker_ye, marker_ka, marker_ma);
earthGroup.add(stars);

let backgroundTexture = textureLoader.load(
    '/examples/textures/IMG_7501.PNG'
);





///////////////////////////////////////////////////////////////////////////////////

//기본 구동 

///////////////////////////////////////////////////////////////////////////////////




function init(){
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 2, container.clientWidth / container.clientHeight, 1, 10000 );
    camera.position.set( 0, 0, 100 );

    renderer.setPixelRatio( container.devicePixelRatio );
    renderer.setSize( container.clientWidth , container.clientHeight);
    container.appendChild( renderer.domElement );

    scene.add( light );
    scene.add( light2 );
    scene.add(earthGroup);
    scene.background = backgroundTexture;
}

function render() {
    renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
    if (isRotating) {
        earthGroup.rotation.x += (targetRotation.x - earthGroup.rotation.x) * 0.2;
        earthGroup.rotation.y += (targetRotation.y - earthGroup.rotation.y) * 0.2;
        if (Math.abs(targetRotation.x - earthGroup.rotation.x) < 0.02 &&
            Math.abs(targetRotation.y - earthGroup.rotation.y) < 0.02) {
            isRotating = false;
        }
    }
    camera.position.x = lerp(camera.position.x, targetCameraPosition.x, 0.3);
    camera.position.y = lerp(camera.position.y, targetCameraPosition.y, 0.3);
    camera.position.z = lerp(camera.position.z, targetCameraPosition.z, 0.3);
    camera.fov = lerp(camera.fov, targetFOV, 0.3);
    camera.updateProjectionMatrix();
    updateCameraForState(articleScene);
    render();
    colorCont();
}

function updateCameraForState(state) {
    switch(state) {
        case 2: 
            targetCameraPosition.set(0, 1.5, 100);
            targetFOV = 2; 
            break;
        case 1: 
            targetCameraPosition.set(0, 0, 100);
            targetFOV = 2; 
            break;
        case 0: 
            targetCameraPosition.set(7.3, 0, 100);
            targetFOV = 6.8; 
            break;
    }
}





///////////////////////////////////////////////////////////////////////////////////

//마우스 스크롤 시 애니메이션 

///////////////////////////////////////////////////////////////////////////////////





glassCont.addEventListener('wheel', wheelFn2);
container.addEventListener('wheel', wheelFn);
scrollCont.addEventListener('wheel', wheelFn);
function wheelFn2(e){
    if(articleScene == 0){
        if(showScene == 0){
            if(e.deltaY>0){
                showScene = 1;
                setTimeout(gradationFn, 1000);
                vidCont.style.width = '70%';
                myVideo.play();
                glass1ChangeFn();
                glass2ChangeFn();
            }
        }else if(showScene == 1){
            if(glassCont.scrollTop<10 && e.deltaY<0){
                showScene = 0;
                vidCont.style.width = '0%';
                myVideo.pause();
                gradation.style.background = 'linear-gradient(to right, rgb(8, 8, 8) 100%, rgba(0,0,0, 0) 80%)';
                glass1BackFn();
                glass2BackFn();
            }
    }}
}
function wheelFn(e){ 
    allScene = 0;
    allClickFn();
    if(articleScene == 1 || articleScene == 0){
        prescrollContFn();
        if(scrollScene==4){
            if(e.deltaY>0){
                scrollScene++;
            }else if(e.deltaY<0){
                scrollScene = 12;
            }
        }else if(scrollScene==12){
            if(e.deltaY<0){
                scrollScene--;
            }else if(e.deltaY>0){
                scrollScene = 4;
            }
        }else{
            if(e.deltaY>0){
                scrollScene++;
            }else{
                scrollScene--;
            }
        }
        scrollContFn();
        earthSpinFn();
        putArticleFn();
    }else{
        if(showScene == 0){
            if(e.deltaY>0){
                h5.style.top = '130%';
                showScene = 1;
                vidCont.style.width = '70%';
                myVideo.play();
                glass1ChangeFn();
                glass2ChangeFn();
            }
        }else if(showScene == 1){
            if(glassCont.scrollTop<10 && e.deltaY<0){
                h5.style.top = '130%';
                showScene = 0;
                vidCont.style.width = '0%';
                myVideo.pause();
                gradation.style.background = 'linear-gradient(to right, rgb(8, 8, 8) 100%, rgba(0,0,0, 0) 80%)';
                glass1BackFn();
                glass2BackFn();
            }
        }
    }
    }

    function gradationFn(){
        gradation.style.background = 'linear-gradient(to right, rgb(8, 8, 8) 40%, rgba(0,0,0, 0) 50%)';
    }





///////////////////////////////////////////////////////////////////////////////////

//scroll 클릭 시 이벤트

///////////////////////////////////////////////////////////////////////////////////





    for(let i=4;i<13;i++){
        article[i].addEventListener('click',() => {
            scrollScene = i;
            prescrollContFn();
            scrollContFn();
            earthSpinFn();
            if(articleScene == 0){
                return;
            }else{
                articleContFn();
            }
        });
    }

function prescrollContFn(){
    for(let k=0;k<13;k++){
        article[k].classList.remove('size1');
        article[k].classList.remove('size2');
        article[k].classList.remove('size3');
        article[k].classList.add('dummy');
    }
    putArticleFn();
}

function scrollContFn(){
    article[scrollScene-2].classList.remove('dummy');
    article[scrollScene-1].classList.remove('dummy');
    article[scrollScene].classList.remove('dummy');
    article[scrollScene+1].classList.remove('dummy');
    article[scrollScene+2].classList.remove('dummy');

    article[scrollScene-2].classList.add('size1');
    article[scrollScene-1].classList.add('size2');
    article[scrollScene].classList.add('size3');
    article[scrollScene+1].classList.add('size2');
    article[scrollScene+2].classList.add('size1');
    scrollCont.style.top = -(scrollScene-7)*20 + 'px';

    colorScene = scrollScene -3;
}
function earthSpinFn(){
    isRotating = false;
    spinScene = scrollScene -3;
    targetRotation = getTarget2Rotation(spinScene);
    isRotating = true;
}
function getTarget2Rotation(spinScene) {
    
    switch(spinScene) {
        case 1: return { x: -0.098, y: 0.459 };
        case 2: return { x: 0.407, y: 0.276 };
        case 3: return { x: 0.133, y: 0.156 };
        case 4: return { x: -0.359, y: 0.953 };
        case 5: return { x: -0.24, y: -0.398 };
        case 6: return { x: -0.48, y:0.472 };
        case 7: return { x: -0.221, y: 0.303 };
        case 8: return { x: -0.093, y: -0.135 };
        case 9: return { x: -0.1, y: 3.51 };
        default: return { x: 0, y: 0 };
    }
}

function hideAllArticles() {
    article.forEach((el) => {
        el.classList.remove('size1', 'size2', 'size3');
        el.classList.add('dummy');
    });
}

function showArticles(startIndex, endIndex) {
    hideAllArticles(); 
    for (let i = startIndex; i <= endIndex; i++) {
        const sizeClass = i === startIndex + 1 ? 'size2' : (i === endIndex - 1 ? 'size2' : 'size2'); 
        article[i].classList.remove('dummy');
        article[i].classList.add(sizeClass);
    }
    if(allScene == 1){
        scrollCont.style.top = '-20px';
    }else{
        scrollCont.style.top = -(scrollScene-7)*20 + 'px';
        article[scrollScene].classList.add('size3'); 
    }
    

}
//캬 이게 되네





///////////////////////////////////////////////////////////////////////////////////

//씬 이동 함수

///////////////////////////////////////////////////////////////////////////////////





function articleContFn(){
    switch(articleScene){
        case 0:
            articleScene = 1;
            articleOffFn();
            break;
        case 1:
            articleScene = 0;
            articleOnFn();
            break;
        case 2:
            articleScene = 1;
            articleOffFn();
            break;
    }
}

function articleOnFn(){
    glassCont.style.zIndex = '9';
    hr.style.top = '0px';
    menuCont.style.height = '0px';
    pannelCont.style.left = '-220px';
    scrollCont.style.right = '68%';
    scrollCont.style.left = '250px';
    for(let i=0;i<13;i++){
    article[i].style.textAlign = 'left';
    }
    glassCont.style.width = '80%';
    nameSmall.style.top='-40px';
    nameBig.style.top = '-400px';
    home.style.top = '-40px';
    container.style.top='-20px';
    glassCont.style.overflowY = 'scroll';
}
function articleOffFn(){
    scrollCont.style.left = '';
    glassCont.style.zIndex = '1';
    vidCont.style.width = '0%';
    hr.style.top = '40px';
    menuCont.style.height = '40px';
    pannelCont.style.left = '0%';
    container.style.left = '-10px';
    scrollCont.style.right = '50px';
    for(let i=0;i<13;i++){
        article[i].style.textAlign = 'right';
        }
    glassCont.style.width = '0%';
    nameSmall.style.top='0px';
    nameBig.style.top = '-400px';
    container.style.top='20px';
    home.style.top = '0px';
}
function goHomeFn(){
    glassCont.style.zIndex = '1';
    glassCont.style.width = '0%';
    vidCont.style.width = '0%';
    window.scrollTo(0,0);
    glassCont.scrollTo(0,0);
    earthGroup.rotation.x = 0;
    earthGroup.rotation.y = 0;
    hr.style.top = '100%';
    menuCont.style.height = '0px';
    pannelCont.style.left = '-220px';
    container.style.left = '-25px';
    scrollCont.style.right = '-500px';
    nameBig.style.top = '250px';
    nameSmall.style.top='-50px';
    home.style.top = '-50px';
    glassCont.style.width = '0';
    articleScene = 2;
    glassCont.scrollTop = 0;
    scrollCont.scrollTop = 0;
    body.style.overflow = 'hidden';
    glass.style.overflow = 'hidden';
}





///////////////////////////////////////////////////////////////////////////////////

//아티클 디자인 

///////////////////////////////////////////////////////////////////////////////////





function glass1ChangeFn(){
    glass1.style.opacity = '0';
    articleImg1.style.opacity = '1';
    switch(glassScene1){
        case 1: 
            articleImg1.style.filter = 'drop-shadow(1px 1px 20px purple)';
            break;
        case 2:
            articleImg1.style.filter = 'drop-shadow(1px 1px 20px red)';
            break;
        case 3:
            articleImg1.style.filter = 'drop-shadow(1px 1px 20px blue)';
            break;
        case 4:
            articleImg1.style.filter = 'drop-shadow(1px 1px 20px green)';
            break;
        case 0:
            articleImg1.style.filter = 'drop-shadow(1px 1px 20px white)';
            break;
    }
}
function glass1BackFn(){
    glass1.style.opacity = '1';
    articleImg1.style.opacity = '0';
    articleImg1.style.filter = '';

}
function glass2ChangeFn(){
    glass2.style.opacity = '0';
    articleImg2.style.opacity = '1';
    switch(glassScene2){       
        case 1: 
            articleImg2.style.filter = 'drop-shadow(1px 1px 20px purple)';
            break;
        case 2:
            articleImg2.style.filter = 'drop-shadow(1px 1px 20px red)';
            break;
        case 3:
            articleImg2.style.filter = 'drop-shadow(1px 1px 20px blue)';
            break;
        case 4:
            articleImg2.style.filter = 'drop-shadow(1px 1px 20px green)';
            break;
        case 0:
            articleImg2.style.filter = 'drop-shadow(1px 1px 20px white)';
            break;
    }
}
function glass2BackFn(){
    glass2.style.opacity = '1';
    articleImg2.style.opacity = '0';
    articleImg2.style.filter = '';
}
function scrollDown(){
    glassCont.scrollTo({top :window.innerHeight+50, behavior : 'smooth'});
    showScene = 1;
    setTimeout(gradationFn, 1000);
    vidCont.style.width = '70%';
    myVideo.play();
    glass1ChangeFn();
    glass2ChangeFn();
}




///////////////////////////////////////////////////////////////////////////////////

//버튼 인터렉션 및 이벤트 

///////////////////////////////////////////////////////////////////////////////////





function redChangeFn(){
    h4[0].style.color = 'red';
}
function redBackFn(){
    h4[0].style.color = 'white';
}
function redClickFn(){
    if(redScene == 0){

        redScene = 1;
        orangeScene = 1;
        yellowScene = 1;
        orangeClickFn();
        yellowClickFn();

        circleRed.style.marginLeft = '35px';
        btnRed.style.backgroundColor = 'red';
        circleRed.style.backgroundColor = 'black';
        scrollScene = 5;
        allScene = 0;
        showArticles(4, 6);
        redMarkerOnly();
    }
    else if(redScene == 1){
        redScene = 0;    
        circleRed.style.backgroundColor = 'red';
        btnRed.style.backgroundColor = 'black';
        circleRed.style.marginLeft = '5px';
    }
    whiteCheckFn();
}

function orangeChangeFn(){
    h4[1].style.color = 'orange';
}
function orangeBackFn(){
    h4[1].style.color = 'white';
}
function orangeClickFn(){
    if(orangeScene == 0){
        orangeScene = 1;
        redScene = 1;
        yellowScene = 1;
        redClickFn();
        yellowClickFn();

        circleOrange.style.marginLeft = '35px';
        btnOrange.style.backgroundColor = 'orange';
        circleOrange.style.backgroundColor = 'black';

        scrollScene = 8;
        allScene = 0;
        showArticles(7,10);
        orangeMarkerOnly();
    }
    else if(orangeScene == 1){
        orangeScene = 0;    
        circleOrange.style.backgroundColor = 'orange';
        btnOrange.style.backgroundColor = 'black';
        circleOrange.style.marginLeft = '5px';
    }
    whiteCheckFn();
}

function yellowChangeFn(){
    h4[2].style.color = 'yellow';
}
function yellowBackFn(){
    h4[2].style.color = 'white';
}
function yellowClickFn(){
    if(yellowScene == 0){
        yellowScene = 1;
        orangeScene = 1;
        redScene = 1;
        orangeClickFn();
        redClickFn(); 

        circleYellow.style.marginLeft = '35px';
        btnYellow.style.backgroundColor = 'yellow';
        circleYellow.style.backgroundColor = 'black';

        scrollScene = 11;
        allScene = 0;
        showArticles(11,12);
        yellowMarkerOnly();
    }
    else if(yellowScene == 1){
        yellowScene = 0;  
        circleYellow.style.backgroundColor = 'yellow';
        btnYellow.style.backgroundColor = 'black';
        circleYellow.style.marginLeft = '5px';
    }
    whiteCheckFn();
}

function allClickFn() {
    if (allScene == 0) { 
        allScene = 1;
        redScene = 1;
        orangeScene = 1;
        yellowScene = 1;

        circleRed.style.marginLeft = '35px';
        btnRed.style.backgroundColor = 'red';
        circleRed.style.backgroundColor = 'black';

        circleOrange.style.marginLeft = '35px';
        btnOrange.style.backgroundColor = 'orange';
        circleOrange.style.backgroundColor = 'black';

        circleYellow.style.marginLeft = '35px';
        btnYellow.style.backgroundColor = 'yellow';
        circleYellow.style.backgroundColor = 'black';

        showArticles(4,12);
        showallMarker();
    } else {  
        allScene = 0;
        redScene = 0;
        orangeScene = 0;
        yellowScene = 0;

        circleRed.style.marginLeft = '5px';
        btnRed.style.backgroundColor = 'black';
        circleRed.style.backgroundColor = 'red';

        circleOrange.style.marginLeft = '5px';
        btnOrange.style.backgroundColor = 'black';
        circleOrange.style.backgroundColor = 'orange';

        circleYellow.style.marginLeft = '5px';
        btnYellow.style.backgroundColor = 'black';
        circleYellow.style.backgroundColor = 'yellow';
    }
    whiteCheckFn();
}

function whiteCheckFn(){
    if(redScene == 0&&orangeScene == 0&&yellowScene == 0){
        category.style.transform = 'scaleX(-100%)';
        allScene = 0;
    }else if(redScene == 1&&orangeScene == 1&&yellowScene == 1){
        category.style.transform = 'scaleX(100%)';
        allScene = 1;
    }
    else{}
}
function redMarkerOnly(){
    colorScene = 10;
}
function orangeMarkerOnly(){
    colorScene = 11;
}
function yellowMarkerOnly(){
    colorScene = 12;
}
function showallMarker(){
    colorScene = 13;
}

function colorCont(){
    const elapsedTime = clock.getElapsedTime();
    switch(colorScene){
        case 1:
            markerMaterialRed.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 2:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 3:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 4:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 5:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 6:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 7:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
        break;
        case 8:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialYellow1.opacity = 1;
        break;
        case 9:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
        break;
        case 10:
            markerMaterialRed.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialRed1.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialRed2.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange.opacity = 0;
            markerMaterialOrange1.opacity = 0;
            markerMaterialOrange2.opacity = 0;
            markerMaterialOrange3.opacity = 0;
            markerMaterialYellow.opacity = 0;
            markerMaterialYellow1.opacity = 0;
        break;
        case 11:
            markerMaterialRed.opacity = 0;
            markerMaterialRed1.opacity = 0;
            markerMaterialRed2.opacity = 0;
            markerMaterialOrange.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange1.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange2.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialOrange3.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialYellow.opacity = 0;
            markerMaterialYellow1.opacity = 0;
        break;
        case 12:
            markerMaterialRed.opacity = 0;
            markerMaterialRed1.opacity = 0;
            markerMaterialRed2.opacity = 0;
            markerMaterialOrange.opacity = 0;
            markerMaterialOrange1.opacity = 0;
            markerMaterialOrange2.opacity = 0;
            markerMaterialOrange3.opacity = 0;
            markerMaterialYellow.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
            markerMaterialYellow1.opacity = Math.abs(Math.sin(elapsedTime * 4.5));
        break;
        case 13:
            markerMaterialRed.opacity = 1;
            markerMaterialRed1.opacity = 1;
            markerMaterialRed2.opacity = 1;
            markerMaterialOrange.opacity = 1;
            markerMaterialOrange1.opacity = 1;
            markerMaterialOrange2.opacity = 1;
            markerMaterialOrange3.opacity = 1;
            markerMaterialYellow.opacity = 1;
            markerMaterialYellow1.opacity = 1;
            break;
        default:
        break;
    }
}





///////////////////////////////////////////////////////////////////////////////////

//container의 마우스 클릭, 드래그 이벤트

///////////////////////////////////////////////////////////////////////////////////





let rotationSpeedX = 0;
let rotationSpeedY = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const dampingFactor = 0.9; 
const rotationSpeed = 0.005;

container.addEventListener('mousedown', (e) => {
    let gapX = e.clientX - e.offsetX;
    let gapY = e.clientY - e.offsetY;
    
    mouse.x = ((e.clientX - gapX)/( container.clientWidth )) * 2 - 1;
    mouse.y = -((e.clientY - gapY)/( container.clientHeight )) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if(intersects.length > 0){
        if(articleScene == 0){
            articleContFn();
        }else{
            isDragging = true;
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            rotationSpeedX = 0; 
            rotationSpeedY = 0;
        }
    }}
    );

container.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationSpeedX = deltaY * rotationSpeed;
        rotationSpeedY = deltaX * rotationSpeed;

        earthGroup.rotation.y += rotationSpeedY;
        earthGroup.rotation.x += deltaY * rotationSpeed;
        earthGroup.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, earthGroup.rotation.x + rotationSpeedX));
        
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY

        };
        
        const closestMarkerIndex = findClosestMarker();
        if (closestMarkerIndex !== -1) {
            scrollScene = closestMarkerIndex; 
            prescrollContFn(); 
            scrollContFn(); 
        }
            
    }
});

container.addEventListener('mouseup', () => {
    isDragging = false;

    function animateRotation() {
        if (!isDragging) {
            rotationSpeedX *= dampingFactor;
            rotationSpeedY *= dampingFactor;

            earthGroup.rotation.y += rotationSpeedY;
            earthGroup.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, earthGroup.rotation.x + rotationSpeedX));

            if (Math.abs(rotationSpeedX) > 0.001 || Math.abs(rotationSpeedY) > 0.001) {
                requestAnimationFrame(animateRotation);
            }
        }
    }

    animateRotation();
});

function normalizeAngleFn(angle) { //지구 한바퀴돌아도 회전값 유지 머리 터진다
    while (angle > Math.PI) angle -= 2 * Math.PI; 
    while (angle < -Math.PI) angle += 2 * Math.PI; 
    return angle; 
}

function findClosestMarker() { 
    const currentRotation = {
        x: normalizeAngleFn(earthGroup.rotation.x),
        y: normalizeAngleFn(earthGroup.rotation.y)
    };

    let closestIndex = -1;
    let closestDistance = Infinity;

    markerRotations.forEach((rotation, index) => {
        if (rotation) { 
            
            const markerRotation = {
                x: normalizeAngleFn(rotation.x),
                y: normalizeAngleFn(rotation.y)
            };

            
            const deltaX = currentRotation.x - markerRotation.x;
            const deltaY = currentRotation.y - markerRotation.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); 

            if (distance < closestDistance) {
                closestDistance = distance; 
                closestIndex = index; 
            }
        }
    });

    return closestIndex; 
}





///////////////////////////////////////////////////////////////////////////////////

//마우스 이벤트 2 -마커 상호작용

///////////////////////////////////////////////////////////////////////////////////





marker_is.name = 1;
marker_uk.name = 2;
marker_af.name = 3;
marker_ni.name = 4;
marker_my.name = 5;
marker_so.name = 6;
marker_ye.name = 7;
marker_ka.name = 8;
marker_ma.name = 9;
const markers = [marker_is, marker_uk, marker_af, marker_ni, marker_my, marker_so, marker_ye, marker_ka, marker_ma];
container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect(); // 해냈다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    mouse.x = ((event.clientX+5 - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY+10 - rect.top) / container.clientHeight) * 2 + 1;
});
container.addEventListener('click', (event) => {
    isRotating = false;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers, true); 
    if (intersects.length > 0) {
        const selectedMarker = intersects[0].object;
        targetRotation = getTargetRotation(selectedMarker.name);
        isRotating = true;
        scrollScene = selectedMarker.name + 3;
        prescrollContFn();
        scrollContFn();
    }
});
function getTargetRotation(markerName) {
    switch(markerName) {
        case 1: return { x: -0.098, y: 0.459 };
        case 2: return { x: 0.407, y: 0.276 };
        case 3: return { x: 0.133, y: 0.156 };
        case 4: return { x: -0.359, y: 0.953 };
        case 5: return { x: -0.24, y: -0.398 };
        case 6: return { x: -0.48, y:0.472 };
        case 7: return { x: -0.221, y: 0.303 };
        case 8: return { x: -0.093, y: -0.135 };
        case 9: return { x: -0.1, y: 3.51 };
        default: return { x: 0, y: 0 };
    }
}
container.addEventListener('pointermove', (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX+5 - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY+10 - rect.top) / rect.height) * 2 + 1;
    tip.style.left = `${event.clientX + 10}px`;
    tip.style.top = `${event.clientY - 30}px`;

    raycaster.setFromCamera(mouse, camera);
    const intersects2 = raycaster.intersectObjects(markers, true);
    
    if (intersects2.length > 1) {
        hoveredMarker = intersects2[0].object.name;
        tipHtmlFn(hoveredMarker);
        tip.style.display = "flex";
    }else{
        tip.style.display = "none";
    }
});
function tipHtmlFn() {
    switch(hoveredMarker) {
        case 1: tip.innerHTML = "Israel : All-out War";
        break;
        case 2: tip.innerHTML = "Ukraine : All-out War";
        break;
        case 3: tip.innerHTML = "Afghanistan : All-out War";
        break;
        case 4: tip.innerHTML = "Nigeria : Civil War";
        break;
        case 5: tip.innerHTML = "Myanmar : Civil War";
        break;
        case 6: tip.innerHTML = "Somalia : Civil War";
        break;
        case 7: tip.innerHTML = "Yemen : Civil War";
        break;
        case 8: tip.innerHTML = "Kashmir : Conflict";
        break;
        case 9: tip.innerHTML = "Mexico : Conflict";
        break;
        default:
        break;
    }
}





///////////////////////////////////////////////////////////////////////////////////

//이벤트 모음 

///////////////////////////////////////////////////////////////////////////////////





nameBig.addEventListener('click', articleContFn);
home.addEventListener('click', goHomeFn);
nameSmall.addEventListener('click', goHomeFn);

glass1.addEventListener('mouseover', glass1ChangeFn);
glass1.addEventListener('mouseout', glass1BackFn);
glass2.addEventListener('mouseover', glass2ChangeFn);
glass2.addEventListener('mouseout', glass2BackFn);
downIcon.addEventListener('click', scrollDown);

btnRed.addEventListener('mouseover', redChangeFn);
btnRed.addEventListener('click', redClickFn);
btnRed.addEventListener('mouseout', redBackFn);
btnOrange.addEventListener('mouseover', orangeChangeFn);
btnOrange.addEventListener('mouseout', orangeBackFn);
btnOrange.addEventListener('click', orangeClickFn);
btnYellow.addEventListener('mouseover', yellowChangeFn);
btnYellow.addEventListener('mouseout', yellowBackFn);
btnYellow.addEventListener('click', yellowClickFn);

category.addEventListener('click', allClickFn)





///////////////////////////////////////////////////////////////////////////////////

//구동

///////////////////////////////////////////////////////////////////////////////////





init();

myVideo.pause();
renderer.domElement.addEventListener('click', onclick);
window.addEventListener('resize', onresizeFn);

function onresizeFn(){
    init();
    animate();
}

document.addEventListener('DOMContentLoaded', ready) 

function ready(){
    window.scrollTo({ 
        top:0,
        behavior:'smooth'
    })
    glassCont.style.zIndex = '1';
    vidCont.style.width = '0%';
    body.style.overflow = 'hidden';
    glassCont.style.overflow = 'hidden';
    glassCont.style.width = '0px';
    allClickFn();
    targetRotation = getTarget2Rotation(spinScene);
    isRotating = true;
    animate();
} // 내가 해냄





///////////////////////////////////////////////////////////////////////////////////

//아티클 변환

///////////////////////////////////////////////////////////////////////////////////





function putArticleFn(){
    switch(scrollScene){
        case 4:
            myVideo.src = '/vid/1.mp4';
            glass1.src = '/examples/image/TRANSE3.png';
            glassScene1 = 3;
            glass2.src = '/examples/image/TRANSE4.png';
            glassScene2 = 4;
            articleImg1.src = '/examples/image/ISRALE_HAMAS.png';
            articleImg2.src = '/examples/image/ISRALE_ISRALE.png';
            h1.innerHTML = '이스라엘-하마스 전쟁';
            h3.innerHTML = '중동전쟁을 통해 이스라엘이 점령한 요르단 강 서안지구+가자지구를 둘러싼 유대인- 아랍인 간 영토분쟁';
            h5.innerHTML = '중동의 패권 국가였던 오스만 제국이 1차 세계대전에서 패망한 뒤 팔레스타인으로 알려진 지역을 영국이 장악하게 된다. 당시 이곳에 사는 사람 중 대부분은 아랍인이었고, 유대인은 소수 민족이었다.그 뒤 국제사회가 유대인을 위한 "고국(National Home)"을 팔레스타인 지역에 건설하는 과제를 영국에 안기면서 두 민족 간의 긴장감이 커지게 된다. 유대인들에게 팔레스타인 땅은 조상들의 고향이었지만, 팔레스타인 아랍인들도 이 땅의 영유권을 주장하며 계획에 반대했다.<br><br>그러던 중 1920년대와 40년대 사이 2차 세계대전에서 벌어진 홀로코스트(나치에 의한 유대인 학살)를 피해 팔레스타인 지역에 도착하는 유대인이 늘게 됐다. 이는 곧 유대인과 아랍인 사이의 폭력 사태로 이어졌고 영국의 통치에 대한 반감도 커졌다. 1947년 유엔은 팔레스타인 지역을 유대인 국가, 아랍 국가로 분리하되 예루살렘은 국제공동 통치구역으로 두는 팔레스타인 분할안을 통과시킨다. 예루살렘은 누구의 소유도 아닌 국제도시가 될 계획이었다.<br><br>이 분할안은 유대인 지도자들은 받아들였지만, 아랍 측의 거부로 결국 실행되지는 못했다.1948년 문제를 해결하지 못한 영국 통치자들은 팔레스타인 지역에서 철수했고, 그 뒤 유대인 지도자들은 이스라엘 국가 건국을 선언했다. 많은 팔레스타인인들은 이스라엘의 국가 수립에 반대했고, 1차 중동전쟁이 이어졌다. 이웃 아랍국가의 군대들이 팔레스타인 지역을 침략하게 된다. 이로 인해 팔레스타인 지역 주민 수십만 명이 피난길에 나서야 했고 이 사건은 아랍어로 알 나크바(Al Nakba) 혹은 대재앙으로 불린다.<br><br>이듬해 1차 중동전쟁이 휴전으로 끝날 무렵, 이스라엘은 팔레스타인 지역의 대부분을 장악하게 된다. 오늘날 서안지구로 알려진 땅은 요르단이 차지했고, 가자지구는 이집트가 점령했다. 예루살렘의 경우 서쪽은 이스라엘군 지역, 동쪽은 요르단군 지역으로 나뉘게 된다. 하지만 참전 세력들 간 서로를 향한 비난이 끊이지 않으면서 이 전쟁은 결국 평화협정을 맺지 못했고, 이후 수십 년 동안 더 많은 전쟁과 싸움이 지속되고 있다.<br><br>그리고 1967년 또 다른 전쟁이 발생한다. 그 결과 이스라엘은 동예루살렘과 서안지구, 시리아 골란고원, 가자지구와 이집트 시나이반도까지 점령하게 된다. 팔레스타인 난민 대다수와 그 후손들은 가자지구와 요르단, 시리아, 레바논에 흩어져 살고 있다. 이스라엘은 이들이 고향으로 돌아오는 것을 허락하지 않고 있다. 이스라엘은 이들이 귀향하면 이스라엘이 압도될 것이고 유대인 국가로서의 존재를 위협당하게 된다고 주장하고 있다. 동예루살렘과 가자지구, 서안지구에서는 여러 차례 이스라엘과 팔레스타인 주민 간 긴장이 고조됐었다.<br><br>가자지구는 하마스라고 불리는 팔레스타인 무장단체가 장악하고 있는데 이들은 이스라엘과 여러 번 대치해왔다. 이스라엘과 이집트는 하마스에 무기가 반입되는 걸 막기 위해 가자지구의 국경을 철저히 통제하고 있다. 가자지구와 요르단강 서쪽의 서안지구에 사는 팔레스타인인들은 이스라엘 정부의 행동과 제한으로 고통을 겪고 있다고 말한다. 이스라엘 정부는 팔레스타인의 폭력에 대한 방어 행동일 뿐이라는 입장이다. 이스라엘과 팔레스타인 사이에는 서로 합의하지 못하고 있는 수많은 문제가 산적해 있다.<br><br>팔레스타인 난민 처리 문제에서부터, 이스라엘이 점령 중인 요르단강 서안지구의 유대인 정착촌의 잔류 문제, 그리고 양측이 예루살렘을 공유해야 하는지 아닌지가 해결돼야 한다. 또한 팔레스타인을 국가로 만들어져야 하느냐는 가장 답하기 어려운 문제도 있다. 양측은 25년 넘게 평화회담은 해왔지만, 지금까지 갈등을 해결하지 못했다<br><br><br><br>';
        break;
        case 5:
            myVideo.src = '/vid/2.mp4'
            glass1.src = '/examples/image/TRANSE1.png';
            glassScene1 = 1;
            glass2.src = '/examples/image/TRANSE2.png';
            glassScene2 = 2;
            articleImg1.src = '/examples/image/UKRU_JELEN.png';
            articleImg2.src = '/examples/image/UKRU_PUTIN.png';
            h1.innerHTML = '우크라이나-러시아 전쟁';
            h3.innerHTML = '러시아, 우크라이나 침공';
            h5.innerHTML = '2차 세계대전이 끝난 직후인 1949년, 북대서양 조약기구(NATO)가 창설되었다. 동유럽이 소련의 영향으로 우후죽순 공산화되자, 미국이 소련의 군사적 위협을 막기 위해 군사적 동맹 NATO를 창설한 것이다. NATO는 회원국이 비가입국의 공격을 받으면 자동으로 상호방위를 하는 일종의 집단 군사동맹체제를 유지하고 있다. 유럽에서 NATO 회원국은 점차 늘어났다. 1991년 소련이 해체되고, 과거 바르샤바 조약기구 회원국이었던 폴란드, 체코, 헝가리도 NATO에 가입하면서 동유럽에서 미국의 영향력은 훨씬 커졌다. 동유럽의 나머지 국가들도 차례차례 NATO에 가입했고, 그 사이 러시아의 영향력은 확 수그러들었다. <br><br>우크라이나는 러시아 입장에서 최후의 보루라고 할 수 있다. 게다가 흑해를 접하고 있어 해양으로 진출할 수 있는 군사적 요충지이기도 하다. 우크라이나가 NATO 가입을 추진하자 러시아가 크게 반발한 이유도 여기에 있다. 러시아는 이미 2000년대 중반부터 크림 반도와 우크라이나 동부 돈바스 지역 등 여러 곳을 무력으로 차지하며 우크라이나에 대한 야욕을 비쳤던 적 있다. 유럽과 미국은 러시아가 우크라이나 국경 지역에 병력을 배치하는 것을 두고 러시아의 우크라이나 침공 의혹을 제기했지만 러시아는 강력하게 부인했다. 또한 2022년 초 러시아가 우크라이나를 침공할 것이라는 미국 정보기관의 정보가 언론에 보도되면서 긴장이 고조되었다. 러시아는 여러 차례 의혹을 부인했다. 하지만 2022년 2월 24일 현지시각 오전 4시 50분 러시아 대통령 블라디미르 푸틴의 군사작전 개시 명령으로 러시아의 우크라이나 침공이 시작됐다. 러시아는 우크라이나 동부, 북부, 남부 가리지 않고 동시다발 공격을 펼치며 진격했다. 우크라이나 보건장관은 러시아의 첫날 공격으로 우크라이나인 57명이 사망하고 169명이 부상당했다고 밝혔다.<br><br>러시아에는 전 세계 천연가스의 4분의 1 가량이 매장된 것으로 추정된다. 상대적으로 천연가스 자원이 부족한 유럽은 많은 부분을 러시아에서 수입하며, 유럽의 천연가스 중 40%가 러시아 산일 정도이다. 그리고 천연가스의 가장 큰 파이프라인은 우크라이나에 있다. 우크라이나가 러시아와 갈등을 보일 때마다 유럽의 천연가스 가격이 출렁이는 이유가 이것이다.<br><br>우크라이나가 친 서방 노선을 보이고 NATO 가입을 추진하자 러시아는 유럽으로 가는 가스관의 일부를 잠갔다. 그 결과로 2021년 4분기 유럽의 러시아산 천연가스 도입량은 전년 동기 대비 25% 줄었고, 2022년 1분기에는 44% 가까이 감소했습니다. 러시아의 우크라이나 침공이 본격화되면서 서방의 제재 조치도 총공세가 이어지고 있다. 미국은 러시아에 대한 수출통제와 대형은행 등에 대한 강력한 제재안을 발표하기도 했다. 이 제재에는 G7 회원국과 27개 EU 회원국이 참여할 것이라고 합니다. 독일은 러시아와 독일을 잇는 가스관 사업을 중단하겠다는 방침을 내놓기도 했습니다. 하지만 러시아는 새로운 파이프라인을 통해 중국에 천연가스를 공급하는 30년 계약을 맺으면서 에너지 공급 다변화를 시도하고 있다.<br><br><br><br>';
        break;
        case 6:
            myVideo.src = '/vid/3.mp4'
            glass1.src = '/examples/image/TRANSE1.png';
            glassScene1 = 1;
            glass2.src = '/examples/image/TRANSE2.png';
            glassScene2 = 2;
            articleImg1.src = '/examples/image/APGAN_TALEBAN.png';
            articleImg2.src = '/examples/image/APGAN_USA.png';
            h1.innerHTML = '아프가니스탄';
            h3.innerHTML = '탈레반, 아프간 장악, 탈레반/미군.. 무력충돌';
            h5.innerHTML = '탈레반과 아프가니스탄의 전쟁은 사실상 1. 미군 (아프가니스탄에 침투한 외세), 2. 아프가니스탄 정부군 (미국을 등판한 약한 정부), 3. 탈레반 ( 아프가니스탄을 노리는 강력한 반란군 )​이 셋의 전쟁이었다. 미군과 아프가니스탄 정부군은 같은편을 먹고 탈레반을 견제하는 중이었다. 1979년 소련-아프가니스탄(무자헤딘) 전쟁 당시에 소련에 대항하며 파키스탄 정보부를 통해 미국에게서 무기를 공급받은 무자헤딘 반군이 탈레반의 전신이라 할 수 있다.<br><br>무자헤딘은 전쟁 직후 미국에게 이용만 당하고 버려졌고, 이에 이들 사이에서 반미와 반아프간(사우디 등 타국 용병들의 국가 포함)이 성행하게 된다. 이들은 탈레반이라는 하나의 사이비 종교를 필두로 한 단체 탈레반을 만들었고, 해외 용병으로 왔던 무자헤딘들의 단체인, 흔히 911 테러로 잘 알려진 알 카에다와도 밀접해졌다. 단체 탈레반은 조국을 구한 자신들을 버린 아프가니스탄을 장악하고, 자신들의 국적다른 친구이자 미국이라는 적 중심부에 거대한 테러를 가한 알 카에다를 자신들이 점거한 아프가니스탄과 파키스탄 일부 지역 내에서 보호해주었다.<br><br>이에 제대로 화난 미국이 2001년 아프간을 침공했다. .초반의 미국 - 아프가니스탄 전쟁은 당연하게도 미국의 일방적인 승리였다. 미국이 아프간을 점령한 후, 탈레반의 탄압을 받던 타지크 족, 우즈베크 족, 하자라 족 등이 연합한 정부가 세워졌다. 그로 인해 탈레반 정권을 추출하는 데에는 성공했지만, 저항단체들은 파키스탄 등으로 도망쳤기에 전쟁을 바로 끝낼 수가 없었다.<br><br>그러나 미국은 이라크 전쟁을 일으키면서 아프간에 소홀해지기 시작한다. 더구나 탈레반은 파키스탄 북부에 사는 파슈툰 족 캠프에 은신처를 마련한 뒤, 아프간 국경을 넘어가서 게릴라 전을 한 후 다시 돌아가는 식으로 싸워왔고,. 사막과 높은 산, 숲 등으로 다양하게 이뤄진 그곳은 게릴라 전에 알맞았다. 이렇게 이라크 전쟁 때문에 본격적인 전쟁은 2010년에야 시작이 됐고 그동안 지난 30년간 작은 전투를 반복한 탈레반은 아프간 전체에 익숙해져 있었기에 비록 수장이 사살되는 등 큰 피해를 입지만 게릴라전으로 전쟁을 이어갔다. 그러나 미국에서 트럼프 대통령이 당선되며, 미군은 아프가니스탄을 무시하고 더 밟아버렸다. 그 와중에 옆나라 시리아에서 활개치던 ISIS도 탈레반 편먹고 참전하면서 아프가니스탄 국토가 난장판이 되었다.<br><br>결국 2020년 2월 29일 카타르 도하에서 장장 18년간의 분쟁에 종지부를 찍는 도하 합의가 진행되었다. 탈레반은 아프가니스탄에서 미군과 동맹국을 공격하지 않을 것을 약속하고 그 대가로 미군은 합의이행 1단계 과정으로 135일 이내 8천600명 수준으로 감축할 것을 보장했다. 여기에 국제동맹군과 아프간 정부군의 탈레반 대원 5천명과 탈레반 포로 아프간군 1천명의 포로교환이 이뤄졌다. 문제는 이 합의에서 아프가니스탄 정부는 합의에 끼지 못했다는 것이다. 미국이 탈레반을 대화와 협상의 상대로 인정했다는 점과, 베트남 전쟁의 결말을 알면서도 미군을 퇴각시켰다는 점에서 사실상 미국의 패전으로 전쟁이 마무리되었다.<br><br>미군이 아프가니스탄에서 완전 철수를 단행하고 얼마 지나지 않아 아프가니스탄 정부군은 탈레반에 의해 급속도로 와해되었다. 오합지졸의 정부군은 제대로 저항하기는커녕 삽시간에 수도 카불을 내줄 위기에 처했고, 결국 2021년 8월 15일 아프가니스탄 정부가 탈레반에 항복함으로써, 탈레반은 이 전쟁의 최종 승자가 되었다. 아프가니스탄 대통령은 사퇴하였고, 정부군은 사실상 해산되었다.<br><br>2021년 12월 부터 지금까지 아프가니스탄은 탈레반이 집권한 지 몇 달이 지났지만 먹고 살 길이 없고 탈레반 치하에서 최악의 경제난을 겪고 있다.<br><br><br><br>';
        break;
        case 7:
            myVideo.src = '/vid/4.mp4'
            glass1.src = '/examples/image/TRANSE4.png';
            glassScene1 = 4;
            glass2.src = '/examples/image/TRANSE3.png';
            glassScene2 = 3;
            articleImg1.src = '/examples/image/NA_BOKOHARAM.png';
            articleImg2.src = '/examples/image/NA_CITIZEN.png';
            h1.innerHTML = '나이지리아 내전';
            h3.innerHTML = '중부 - 인종종교대립 / 북부 - 무장단체 간 충돌 / 남부 - 지원 및 분리주의 분쟁<br>';
            h5.innerHTML = '나이지리아의 분쟁은 크게 중부, 북부, 남부 분쟁으로 나뉘는데 지역별로 분쟁의 쟁점과 맥락이 상이하다. 중부 분쟁은 북부 출신 무슬림과 남부 출신 기독교인들 간 종교 대립 등이 중심이며 남부 분쟁은 중앙정부와 반정부·반군 세력 간 자원분쟁, 분리주의 분쟁을 중심으로 한다.<br><br>중부에서는 이슬람 공동체에 의한 기독교 공동체에 대한 폭력이 심각한데 일례로 플래토주에서 농지나 목초지를 둘러싼 농민과 유목민 간 무력충돌은, 민족·종교·정치 문제까지 복잡하게 얽히면서 수십년 동안 수천명이 목숨을 잃는 피해를 낳았다. 2010년 3월 초 중부 플래토주 조스에서 무슬림 유목민들이 기독교도 주민 500여명을 살해한 사건이 발생했으며 2018년 6월에는 바리킨라디 지역에서 농업을 하는 베롬족(기독교)과 유목민족인 풀라니족(이슬람교) 사이 유혈 충돌이 발생해 그 여파로 2018년 1월부터 10월까지 2000여명이 넘는 사망자가 발생한 것으로 집계된 바 있다<br><br>특히 북부에서는 이슬람법인 샤리아를 통해 가난한 이들의 정의를 추구하겠다고 강조하는 이슬람 극단주의 무장단체 ‘보코하람’이 등장하며 민간인에 대한 폭력, 그리고 이를 진압하고자 하는 중앙정부와의 대립이 이어지고 있다. 보코하람은 2002년 가난과 부정부패와 경제적 차별 등이 이슬람이라는 종교적 이념과 결부해 탄생했다. 이들은 오직 ‘선지자의 가르침’에 헌신하고 샤리아 율법의 세상을 만들고자 하며, 쿠란(성경)에 기록되지 않은 모든 문명의 이기와 근대적 가치를 부정하고 고대 칼리프 제국 건설에 도움이 된다면 학살과 테러를 서슴지 않는다. 종교적 목표를 위해서는 어떤 윤리적 가치도 장애물로 생각하지 않기에 보코하람의 존재는 이슬람 극단주의 조직과 마찬가지로 나이지리아는 물론 지역과 국제사회의 안보에 대한 큰 도전이 되고 있다.<br><br>보코하람이 본격적으로 국제사회의 주목을 받게 된 것은 이들이 2009년 8월 정부군을 습격한 이후다. 이후 이들의 테러 수위도 ‘아프리카 탈레반’ ‘나이지리아 탈레반’이라고 불릴 만큼 더욱 잔인해졌다. 공격 대상도 국가기관과 기독교 상징물에서 친정부 성향의 마을주민, 세속주의 교과과정을 가르치는 학교 등 민간으로 확대되기 시작했다.<br><br>보코하람은 2012년 나이지리아 북부 카노시에서 민간인을 공격(185여명 사망)한 것을 시작으로 2013년 9월 대학 기숙사 총기 난사(학생 50명 사망), 2014년 4월 치복에서 여학생 276명 납치(2018년 정부와 협상 이후 100명 석방), 2018년 여학생 100명 납치(76명 구조, 2명 사망) 등 끊임없이 민간인을 대상으로 하는 테러를 벌이며 공포를 조장하고 있다.<br><br>보코하람은 2020년 말 기준 1500~2000명의 조직원이 여전히 활동 중이며 북동부 보르노 지역에서 건재함을 과시하고 있다. 최근에는 사회적 혼란을 조성해 반정부 환경을 만들어 그것을 이용하려는 움직임이 커지고 있는데 2020년 11월에 28일 한 농촌 마을에서 쌀을 수확하고 있던 근로자들을 무차별적으로 공격해 최소 110명을 살해했으며 12월 11일에는 북부의 한 국립 과학중학교를 급습해 “알라와 신성한 예언자가 허용하지 않는 교육”을 받는다는 이유로 남학생 330명 이상을 납치하기도 했다.<br><br>현재 나이지리아 인구의 52%는 기독교를, 약 41%는 이슬람교를 믿고 있어 종교 갈등이 첨예하다. 하지만 나이지리아 정치와 정치인들은 종교적 갈등을 해소하기보다는 악용하거나 촉진시켜 왔다. 여기에 이슬람 무장조직인 보코하람이 나이지리아의 전체의 이슬람화를 추구함에 따라 이슬람 세력의 기독교 박해가 극단적인 양상으로 치닫고 있다. 현재 부하리 대통령 2기 행정부가 치안 문제를 핵심 국정과제로 다루고 있음에도 국토 전역에서는 민족·종교 갈등으로 인한 무력충돌, 무장조직의 테러, 무장단체에 의한 현지 주민·외국인 희생 피해가 끊임없이 발생하고 있다. <br><br><br><br></br>';
        break;
        case 8:
            myVideo.src = '/vid/5.mp4'
            glass1.src = '/examples/image/TRANSE2.png';
            glassScene1 = 2;
            glass2.src = '/examples/image/TRANSE3.png';
            glassScene2 = 3;
            articleImg1.src = '/examples/image/MIYAN_CITIZEN.png';
            articleImg2.src = '/examples/image/MIYAN_POLITIC.png';
            h1.innerHTML = '미얀마 내전';
            h3.innerHTML = '군부 - 인주화 세력간 정권교체/체제 전환투쟁<br>';
            h5.innerHTML = '미얀마 내전은 1948년부터 발생한 미얀마 내부 분쟁의 일환이자, 2021년 미얀마 쿠데타와 그 여파로 발생한 시위를 군부가 강경하게 탄압하면서 발생한 내전이다.  미얀마 쿠데타는 군부와 저항세력 사이의 내전으로 확대되면서 많은 미얀마인들을 생사를 넘나드는 고통에 빠뜨리고 있다. 그럼에도 미얀마의 끔찍한 사정은 이스라엘-가자 전쟁과 러시아-우크라이나 전쟁 등에 가려 국제사회의 주목을 별로 받지 못하고 있다.<br><br>중국과 인도 사이에 있는 미얀마는 2015년 아웅산 수치가 이끄는 민족민주동맹(NLD)의 총선 승리로 민정 이양이 이뤄진 뒤 군부독재에서 민주국가로 순조롭게 탈바꿈한 모범 사례로 각광받았다. 미얀마의 밝은 미래를 기대하고 많은 외국자본이 물밀듯이 진출했고, 외국 관광객도 양곤 등 주요 관광지에 봇물 터지듯 쏟아져 들어왔다.<br><br>좋은 시절은 2021년 2월 군부 쿠데타로 짧게 끝났다. 군부는 ‘몇달 전 총선에서 부정선거가 있었다’며 선거 무효를 선언하고 수치 등 민족민주동맹 지도자들을 대거 체포했다. 쿠데타에 반대하는 민주화 집회와 시위에 대해서는 거리낌 없이 유혈 진압에 나섰다. 그렇지만 상황이 군부의 뜻대로 돌아가지만은 않았다. 쿠데타에 저항하는 많은 민주화 시민은 군부의 힘이 미치지 않는 국경지대로 숨어들어 무기를 들었다. 소수민족들도 군부의 폭압에 무력으로 맞서면서, 미얀마는 점차 내전 상태로 빠져들었다.<br><br>미얀마는 다민족 국가로, 1948년 독립 이후 지속적으로 주류 버마족과 다른 소수민족이 갈등을 빚어왔고, 정부군과 소수민족 무장세력의 무력 충돌도 끊이지 않았다. 그러나 군부 쿠데타에 반발한 민주화 세력이 소수민족의 무장세력과 합류한 것은 과거에 없던 양상이다. 민주화 세력과 소수민족의 연대로 군부 쿠데타가 촉발한 갈등과 충돌, 혼란이 전국적 규모로 번진 것이다.<br><br>현재 국토 절반 가까이는 군부 정권의 통제에서 벗어나 있다. 군부는 소수민족과 민주화 세력의 진격을 막는 데 어려움을 겪고 있다. 소수민족 세력은 동북부 카친주와 샨주에서 3개 무장세력 연합을 통해 이른바 ‘1027 작전’을 펼치며 주요 전략 지역을 점령하는 등 정부군을 몰아붙이고 있다.<br><br>그렇다고 당장 힘이 어느 한쪽으로 쏠리는 분위기는 아니다. 군부는 지난 국가비상사태를 다시 여섯달 연장하겠다고 밝히고 징병제를 전격 도입해 병력 보충에 나서는 등 전열 재정비에 안간힘을 쏟고 있다. 민주화 세력과 소수민족들로 구성된 저항세력은 최근 몇몇 군사적 승리에도 불구하고 확실한 우위를 보여주지 못하고 있다. 이들 저항세력 사이의 연대와 결속은 매우 느슨할 뿐 아니라, 일부에선 민주화 세력에 대한 의구심을 거두지 않고 있다. 소수민족들 사이에도 잠복한 갈등과 반목이 표출하면서 이합집산이 이뤄지고 있다. <br><br><br><br></br>';
        break;
        case 9:
            myVideo.src = '/vid/6.mp4'
            glass1.src = '/examples/image/TRANSE4.png';
            glassScene1 = 4;
            glass2.src = '/examples/image/TRANSE3.png';
            glassScene2 = 3;
            articleImg1.src = '/examples/image/SOMAL_AL.png';
            articleImg2.src = '/examples/image/SOMAL_CONTR.png';
            h1.innerHTML = '소말리야 내전';
            h3.innerHTML = '정부군 / 아프리카 연합 평화유지군 대립, 알샤바브 간 국가 권력 다툼';
            h5.innerHTML = '소말리아는 보츠와나와 함께 아프리카에 단 둘뿐인 단일 종족국가다. 그런데 발전 국가로 손꼽히는 보츠와나와는 정반대의 길을 걸었다. 안으론 연이은 실정과 씨족의 반목, 바깥으로는 서구 열강의 식민지배와 냉전시대 외줄타기, 환경적 재앙이 복잡하게 얽혀 만든 결과였다.<br><br>1884년 베를린 회담을 통해 서구 열강들이 아프리카를 분할할 때, 열강은 다양한 종족과 언어를 고려하지 않고 자신들의 이익을 우선적으로 생각해 마구잡이로 땅을 분할했다. 한 국가 안에 여러 종족 집단들이 조화롭게 어울리기가 어려웠다. 소말리아도 단일민족 아래 다양한 씨족이 있었는데, 식민제국주의 세력의 통치가 씨족 간 반목과 대립의 중요한 기폭제가 되었다.<br><br>1969년 무혈 쿠데타로 권력을 잡은 시아드 바레 장군은 ‘하나의 민족’을 강조하며 분열을 촉진하는 씨족과의 전쟁을 선포했다. 문제는 시아드 바레의 언행 불일치였다. “자신이 속한 씨족인 ‘마레한(Marehan)’에게 정부 요직을 몰아주고, 토지법을 만들어 몰수한 토지도 자신의 씨족에 나눠줬다. 경제는 하락하고, 차별 받은 씨족들의 반란이 우후죽순 생겨났다. <br><br>시아드 바레는 정당성과 지지도 회복을 위해 실지회복주의에 기반한 전쟁을 벌인다. 소말리족이 살지만 영국과 미국 각각의 이해관계로 에티오피아에 넘겨진 땅 오가덴을 전쟁을 통해 찾으려 했다. 당시 미소 냉전이 한창이었다. 소말리아는 소련의 무기 지원을 통해 전쟁의 90%를 이기고도 에티오피아에 패배한다.“소련은 소말리아가 서방 세계, 소련과 사이 좋지 않은 중동 국가와 관계 유지하는 것이 눈엣가시였고, 피델 카스트로도 ‘소말리아를 포기하더라도 에티오피아를 붙잡는 게 유리하다’고 했다. 결국 소련과 쿠바가 합심해 에티오피아를 지원합니다. 시아드 바레 정권은 더욱 추락해 내전으로 치닫게 되는 빌미가 된다.<br><br>시아드 바레의 실정으로 벌어진 내전은 많은 나비효과를 낳았다. 파라 아이디드 등이 이끄는 ‘통일소말리아회의(USC)’가 시아드 바레를 축출했지만, USC 내 권력다툼이 계속되면서 무정부 상태가 시작됐다. 엎친 데 덮친 격으로 내전 중 소말리아 대기근이 들었다. 국제사회에서 막대한 식량 원조와 파병을 지원했지만 실권을 우려한 파라 아이디드는 이를 마다하며 제국주의 타도를 외쳤다. 급기야 소말리아에 파견된 유엔 다국적군 중 미군 병사 18명을 사살하기에 이르고, 이는 미국이 아프리카에 적극적 군사 개입을 단념하는 계기가 된다. <br><br>해적 또한 소말리아에 정부가 없던 사이 등장해 사회에서 강한 영향력을 갖게 된다. 처음엔 순수한 취지였다. 내전으로 무정부 상태가 된 것을 틈타 서방세계가 마구잡이로 조업하며 소말리아 어장을 황폐화시켰고, 바닷가 연안에 거주하던 소말리아인들이 이를 막기 위해 결성한 자경단이었다. 그런데 점차 배를 납치하면 돈이 된다는 걸 알게 됐고 어마어마한 부를 창출했다. 서방 세계가 15년 가까이 정부가 없는 소말리아에 해양 쓰레기를 무단 투기한 걸 알게 되면서 소말리아 어부들의 해적 행위는 더욱 정당화되고 영웅시되었다.<br><br>이슬람 과격 세력의 확산도 소말리아 역사와 얽혀 있다. 해적이 성행할 때 엄격한 샤리아법을 따르는 이슬람 법정연대(UIC)가 집권해 잠시 해적행위를 억제했지만, 미국을 등 뒤에 둔 에티오피아에 의해 축출된다. 이는 불만 세력이 더 과격한 이슬람 세력으로 변화해 ‘알샤바브’라는 무장단체가 됐다. 알샤바브 퇴치를 위해 아프리카연합이 소말리아 평화유지군 임무 ‘아미솜’을 조직했지만 갈수록 지원이 어려운 상황이다. “2012년 아프리카연합이 수도 모가디슈에 소말리아 연방 정부를 세우지만 유명무실한 상태이다. 소말리아 대다수 주민은 소말리아 국가의 정당성을 소말리아 연방 정부보다 알샤바브에 부여하는 측면이 강하다.<br><br>아프리카의 많은 나라들처럼 취약 국가를 넘어 실패국가, 붕괴 국가까지 경험한 소말리아의 사례는 많은 학자들의 연구 대상이 됐다. 소말리아의 향후 전망은 상당히 암울하다. 2007년부터 아프리카연합이 서방세계 지원을 받아 소말리아의 국가 건설을 도왔지만 10년간 발전한 게 없이 크고 작은 폭탄 테러가 일어나는 둥 불안한 운명을 이어가는 중이다. 게다가 알샤바브같은 이슬람 급진 세력이 성행하며 반제국주의와 반 서방세계 입장과 이미지를 더 고착화시키는 측면에서 볼 때, 소말리아 정국 개선 가능성이 그렇게 밝지만은 않다.<br><br><br><br>';
        break;
        case 10:
            myVideo.src = '/vid/7.mp4'
            glass1.src = '/examples/image/TRANSE1.png';
            glassScene1 = 1;
            glass2.src = '/examples/image/TRANSE2.png';
            glassScene2 = 2;
            articleImg1.src = '/examples/image/YEMEN_ARAP.png';
            articleImg2.src = '/examples/image/YEMEN_HUTI.png';
            h1.innerHTML = '예멘(2차 내전)';
            h3.innerHTML = '이슬람 시아파 세력 후티반군 / 아랍 연합군';
            h5.innerHTML = '지금 가장 비참한 인도주의 위기에 처한 곳은 예멘이다. 그러나 그 참상이 세상에 알려지지 않고 있다. 예멘의 비극을 보아달라는 국제 구호단체 옥스팜(Oxfam)의 호소다. 이 무관심에 한국도 예외는 아니다. 갈등이 끊이지 않는 중동 어딘가에서 분쟁을 겪는 나라 중 하나려니 하는 정도였다. 그러던 중 제주도에 500명이 넘는 난민 신청자들이 나타나자 예멘은 갑자기 뉴스의 중심이 되었다. 난민 수용에 대한 찬반 논쟁이나 이슬람 혐오 논란이 거세지만, 정작 예멘에서 무슨 일이 일어나고 있는지 여전히 우리는 모른다. 내전의 배경은 무엇일까? 누가 무엇 때문에 싸우고 있을까? 그 난민들은 왜 제주도까지 흘러와야 했을까?<br><br>원래의 예멘 정부군인 수니파 하디 정부는 북예멘에 기반을 둔 세력으로 남예멘과 1972년 1974년 두차례 전쟁을 벌이고 합의로 1990년 한번 통일국가를 이뤘었다. 이후 다시 남예멘이 내전을 일으켰으나 북예멘이 승리해 1994년 예멘 전역을 통일했다. 여기에는 사실상 사우디아라비아의 후원이 있었다.<br><br>런데 2009-2014년 북예멘 북부에서 일어난 시아파 후티 반군 세력이 2015년 하디 정부를 몰아내고 북예멘 전역을 장악하며 하디 정부는 아덴으로 쫓겨났다. 현재 북예멘을 장악한 후티 반군은 이란의 후원을 받는 시아파이고 아덴으로 피난한 수니파 하디 정부를 후원하는 것은 사우디아라비아로 사실상 시아파 이란과 수니파 사우디 아라비아간의 대리전쟁이라고 볼수 있다.<br><br>이란은 후티반군을 지원하고 있다는 것을 부정하고 있으나 이란산 무기의 공급과 외교적 인정 등 후티 반군을 적극적으로 돕고있다. 사우디는 예멘의 북부 국경선에서 후티 반군을 군사적으로 압박하고 있으나 첨단무기로 무장했지만 의욕이 없는 사우디 군이 무장은 게릴라 수준이지만 전쟁경험이 풍부한 후티 반군에 밀려 형편없는 전투력을 보이며 패배를 거듭해 겨우 사우디 국경을 지키는 수준에 그치고 있다.<br><br>반기문 유엔사무총장은 예멘이 눈 앞에서 붕괴되고 있다라며 경고하였다. 수 년째 내전이 지속되고 있고, 예멘은 완전히 실패국가가 되어버린 상태다. 국민들은 기초적인 사회 인프라도 없이 고통받고 있으며, 지긋지긋한 종파 간 갈등과 내전은 1년 넘게 끝나지 않고 있다. 내전에서의 사망자는 6400명이 넘어가고, 경제가 처절하게 망가진 상태에서, 청년 실업률은 70%에 달한다. 2019~2022년 4년 동안 소말리아까지 제치고 취약국가지수 1위를 기록했을 정도이다.<br><br><br><br>';
        break;
        case 11:
            myVideo.src = '/vid/8.mp4'
            glass1.src = '/examples/image/TRANSE4.png';
            glassScene1 = 4;
            glass2.src = '/examples/image/TRANSE1.png';
            glassScene2 = 1;
            articleImg1.src = '/examples/image/KASUMIR_CHINA.png';
            articleImg2.src = '/examples/image/KASUMIR_INDIA.png';
            h1.innerHTML = '카슈미르 지역';
            h3.innerHTML = '인도/파키스탄/중국 간 영토 분쟁';
            h5.innerHTML = '카슈미르는 인도와 파키스탄 북부에 있는 곳으로 한반도 면적 만한 넓은 지역이다. 인도와 파키스탄은 카슈미르 지역 전체를 자국 영토라고 주장하면서 오랫동안 갈등을 벌이고 있다. 인도가 영국으로부터 독립할 때 이곳에는 수많은 자치령이 있었다. 그런데 인도에서 파키스탄이 갈라지면서 이들 자치령은 힌두교를 믿는 인도와 이슬람교를 믿는 파키스탄, 둘 중 하나로 귀속해야 했었다. 힌두교 신자였던 당시 카슈미르 지도자는 인도 편입을 결정했다. 하지만, 대부분 이슬람 신자였던 카슈미르 주민들은 파키스탄 귀속을 요구하며 폭동을 일으켰다. 이에 인도가 군대를 보내 폭동을 제압했다. 그러자 파키스탄도 카슈미르 영유권과 주민 보호를 내세워 군대를 보내면서, 1947년 10월 두 나라가 전면전을 벌였다.<br><br>카슈미르를 둘러싼 신생 독립국 인도와 파키스탄의 전쟁에 결국 유엔이 개입했다. 1949년 7월 두 나라는 유엔 권고에 따라 휴전에 합의했고, 결국 카슈미르는 둘로 나뉘어졌다. 카슈미르 지역 3분의 2가량은 인도가 지배하는 잠무카슈미르가 됐고, 나머지는 파키스탄령 아자드카슈미르가 됐다. 하지만, 두 나라는 카슈미르를 두고 1965년과 1971년, 두 차례 더 전면전을 치렀다. 그런가 하면 1999년에는 파키스탄 지원을 받는 것으로 추정되는 이슬람 반군이 카슈미르를 공격하고 인도가 반격에 나서면서 사상자 수천 명이 발생하기도 했다.. 당시 국제사회는 양국이 네 번째 전쟁을 벌이면 핵전쟁이 발발할 것이라는 우려를 나타내기도 했다. 인도령 잠무카슈미르에서는 무장투쟁이 30년 이상 이어지고 있다.<br><br>1980년대 들어 잠무카슈미르 지역에서는 인도에서 분리 독립을 요구하는 이슬람 무장단체가 등장했으며, 이들은 테러를 감행해 국제사회로부터 비난받기도 했다.파키스탄과 인도는 지도자 성향에 따라 잠시 사이가 좋아졌다가 카슈미르에서 유혈 사태가 나면 급속하게 관계가 나빠지는 상황을 되풀이했다. 인도는 파키스탄이 카슈미르 내 무장투쟁과 테러를 지원한다고 비난해 왔다. 지난 2000년대 들어 두 나라는 카슈미르 문제 해결에 적극적으로 나서기로 했다. 하지만, 2008년 인도 뭄바이에 있는 호텔에서 대규모 테러로 많은 사상자가 나오고 테러 용의자들이 파키스탄 내 이슬람 무장세력으로 드러나자 두 나라는 다시 긴장과 갈등의 길로 접어들었다.<br><br>또 지난 2019년 2월엔 잠무카슈미르에서 발생한 자살폭탄 테러로 인도 경찰 40여 명이 숨졌다. 그러자 인도 정부는 파키스탄을 배후로 지목하고 국경통제선을 넘어 파키스탄 내 바라코트 지역을 공습했다. 인도 정부는 파키스탄 안에 있는 테러 분자들 기지를 공격했다고 주장했고, 파키스탄은 이에 맞서 인도 공군기를 격추하면서 긴장이 크게 고조되기도 했다. 이 카슈미르 분쟁에 중국까지 참여하여 친파키스탄적 행적을 취하며 경쟁국인 인도를 견제하고 있는데다가 아크사이친 지역을 중인전쟁 와중에 점거하여 지배하고 있다. 그래서 이 카슈미르 지역은 카슈미르 분쟁으로 세계의 화약고 에 속하며 제3차 세계대전의 진원지로 여겨지는 분쟁지역이기도 한다.<br><br><br><br>';
            break;
        case 12:
            myVideo.src = '/vid/9.mp4'
            glass1.src = '/examples/image/TRANSE1.png';
            glassScene1 = 1;
            glass2.src = '/examples/image/TRANSE2.png';
            glassScene2 = 2;
            articleImg1.src = '/examples/image/MAXICO_POLITIC.png';
            articleImg2.src = '/examples/image/MAXICO_TOXIC.png';
            h1.innerHTML = '멕시코 카르텔 전쟁';
            h3.innerHTML = '정부군 / 카르텔간 이권다툼<br>';
            h5.innerHTML = '9·11 이후 미국이 해상과 공중의 경계를 강화하면서, 콜롬비아 등 남아메리카에서 생산되는 마약을 미국으로 밀수하는 해상·공중 통로가 모두 막히고 말았다. 이로써 남미에서 생산되는 마약은 모두 멕시코를 통해서만 들어가게 되었는데, 이로써 미국과 접경 지역을 중심으로 마약 밀수를 전문적으로 하는 갱단이 곳곳에서 생겨나기 시작한다.<br><br>마약 밀수를 통해 벌어들인 엄청난 돈으로 이들 갱은 조직을 키우고, 값비싼 무기로 무장하며, 세력을 불려나가면서 카르텔로 발전한다. 경찰은 물론 정·관계 주요 인사들도 매수하여 사업 영역을 확장해나갔고, 결국 멕시코시티와 외국인(미국인)이 많이 오는 몇몇 주요 도시를 제외한 멕시코 전 지역을 장악해버렸다. 카르텔이 형성되기 시작한 초기에 멕시코 정부는 군대를 투입하여 토벌 작전을 펼치기도 했으나 번번히 카르텔의 막강한 화력 앞에 무릎을 꿇었다. 결국, 멕시코 정부는 이들 마약 카르텔들을 지방 군벌로 인정하고 공존하는 길을 선택했다.<br><br>카르텔들은 자신을 비판하는 일반인은 물론 기자, 정부관료, 검사, 판사, 시장도 서슴없이 살육하기 때문에, 멕시코 내에서는 이들을 비판하는 발언을 하는 것조차 어렵다. 그랬다간 쥐도새도 모르게 납치되어 처참한 시신이 되어 돌아온다. 높은 실업률과 더불어 웬만한 직장보다도 높은 보수를 카르텔에서 지불하기 때문에 지금도 많은 청소년들은 카르텔 단원이 되고 싶어한다.<br><br>현재 멕시코는 연방정부차원에서 군경을 동원한 대대적인 마약조직과의 전쟁을 수행하고 있다. 그러나 범죄학자 및 보안전문가들에 따르면 이런 정부의 노력에도 불구하고 여전히 이러한 조직들의 활동은 줄어들지 않고 있다고 평가하고 있음. 현재까지 마약전쟁으로 인한 사망자수는 1만6000명에 이른다고 한다. 멕시코의 범죄 활동들은 국내 비공식 경제 활동에 깊이 연관돼 있다. 마약운송 및 판매, 불법무기거래, 돈세탁, 밀수, 강절도, 인신매매, 납치, 해적판제품 유통 판매 등 범죄조직의 활동영역이 점차 확산되고 있는 추세이다.<br><br>정부는 마약조직과의 전쟁에 군을 대거 투입하고 있다. 이는 부패경찰과 범죄조직과의 결탁으로 인해 경찰조직으로는 효과적인 수사 및 검거를 기대할 수 없기 때문이다. 그러나 치안전문가들은 조직범죄의 문제는 사회구조적인 문제로 군병력이 투입됐다고 해서 긍정적인 결과를 기대할 수는 없을 것이라고 말한다.<br><br><br><br>';
            break;
        default:
        break;
    }
}