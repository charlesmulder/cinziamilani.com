/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */

import { sticky } from "./nav";
import {Howl, Howler} from 'howler';
import ScrollMagic from 'scrollmagic';
import Vivus from 'vivus';
import * as _ from 'lodash';
import "./contact";

function getBodyHeight() {
    var body = document.body,
        html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );
}

function loadImages(allImagesLoadedCallback) {

    function getColumn(rowsLoaded, index) {
        if(rowsLoaded == 0) {
            let div = document.createElement('div');
            div.className = 'w3-third';
            return div;
        }
        return document.querySelectorAll('div.photo-grid div.w3-third')[index];
    }

    function getPhoto(src) {
        if(src)  {
            let img = document.createElement('img');
            img.src = src;
            img.style.width = '100%';
            img.style.opacity = 0;
            img.style.transition = 'opacity 1s';
            return img;
        }
    }

    const photos = [
        ["img/home/ISP4720.jpg", "img/home/IMG_4012.jpg", "img/home/IMG_0951.jpg"], // first photos of each column aka first row
        ["img/home/ISP4053.jpg", "img/home/IMG_7178.jpg", "img/home/IMG_9940.jpg"],  // 2nd photos of each column aka second row
        ["img/home/PA040526.jpg", "img/home/DSC00039.jpg", "img/home/IMG_5026.jpg"] // 3rd photo of each column aka third row
    ]

    let rowsLoaded = 0;
    const totalRows = photos.length;
    loadRow(photos[rowsLoaded], rowsLoaded, totalRows, allImagesLoadedCallback);

    function loadRow(row, rowsLoaded, totalRows, allImagesLoadedcallback) {
        if(rowsLoaded == totalRows) {
            allImagesLoadedCallback();
            return;
        }
        row = row.filter(Boolean);
        let photosInRow = row.length;
        let photosLoaded = 0;

        row.forEach((src, index) => {
            let col = getColumn(rowsLoaded, index);
            let img = getPhoto(src);
            console.log(`col ${col}`);
            console.log(`img ${img}`);
            img.addEventListener('load', (e) => {
                e.target.style.opacity = 1;
                photosLoaded++;
                console.log(`photos loaded: ${photosLoaded}`);
                if(photosLoaded == photosInRow) {
                    rowsLoaded++;
                    loadRow(photos[rowsLoaded], rowsLoaded, totalRows, allImagesLoadedcallback);
                }
            });
            col.appendChild(img);
            if(rowsLoaded == 0) {
                document.querySelector('div.photo-grid').appendChild(col);
            }
        });
    }
}

function activateMenu() {
    document.querySelector('div.nav button').addEventListener('click', () => {
        console.log('open');
        document.querySelector("nav").style.left = "0px";
        document.querySelector(".nav__button--reveal").classList.remove('nav__button--hover');
        document.querySelector(".nav__button--reveal").style.opacity = 0;
        document.querySelector(".nav__button--reveal").style.visibility = "hidden";
    });

    document.querySelector('nav a:first-child').addEventListener('click', () => {
        console.log('close');
        document.querySelector("nav").style.left = "-250px";
        document.querySelector(".nav__button--reveal").classList.add('nav__button--hover');
        document.querySelector(".nav__button--reveal").style.opacity = 1;
        document.querySelector(".nav__button--reveal").style.visibility = "visible";
    });
}

function handleEnableAudio(e) {
    console.log('unmute');
    showVolumeUpIcon(e.target);
    showNote("Scroll up or down to play the guitar.");
    enableGuitarStrings(window.guitar);
    e.target.removeEventListener('click', handleEnableAudio);
    e.target.addEventListener('click', handleMuteAudio);
}

function handleUnmuteAudio(e) {
    console.log('unmute');
    showVolumeUpIcon(e.target);
    unmuteGuitarStrings(window.guitar);
    e.target.removeEventListener('click', handleUnmuteAudio);
    e.target.addEventListener('click', handleMuteAudio);
}

function handleMuteAudio(e) {
    console.log('volume mute');
    showVolumeMuteIcon(e.target);
    muteGuitarStrings(window.guitar);
    e.target.removeEventListener('click', handleMuteAudio);
    e.target.addEventListener('click', handleUnmuteAudio);
}

function activateAudio() {
    let button = document.querySelector('div.volume button');
    button.addEventListener('click', handleEnableAudio);
    button.removeAttribute('disabled');
}

function showVolumeUpIcon(button) {
    let icon = button.querySelector('i');
    icon.classList.remove('fa-volume-mute');
    icon.classList.add('fa-volume-up');
    button.setAttribute('title', 'mute');
    button.classList.remove('w3-text-red');
    button.classList.add('w3-text-white');
}

function showVolumeMuteIcon(button) {
    let icon = button.querySelector('i');
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');
    button.setAttribute('title', 'unmute');
    button.classList.add('w3-text-red');
    button.classList.remove('w3-text-white');
}

function muteGuitarStrings(guitar) {
    guitar.mute(true);
}

function unmuteGuitarStrings(guitar) {
    guitar.mute(false);
}

function showFullname(callback) {
    let name = document.querySelector("header > h1");
    name.addEventListener('transitionend', callback);
    name.style.opacity = 1;
}

function showPhotoGrid(callback) {
    let grid = document.querySelector(".photo-grid");
    grid.addEventListener('transitionend', callback);
    grid.style.opacity = 1;
    document.getElementsByTagName('html')[0].style.overflowY = 'auto';
}

function showNote(msg) {
    let notes = JSON.parse(sessionStorage.getItem('notes')) || [];
    if( ! notes.includes(msg)) {
        notes.push(msg);
        sessionStorage.setItem('notes', JSON.stringify(notes));
        let note = document.querySelector(".volume__note");
        note.querySelector('p').innerHTML = msg;
        note.style.opacity = 1;
    }
}

function showNav(callback) {
    let nav = document.querySelector('button.nav__button--reveal');
    nav.addEventListener('transitionend', callback);
    activateMenu();
    nav.style.opacity = 1;
}

function enableGuitarStrings(guitar) {
    let height = getBodyHeight();
    let stringHeight = height/10;
    var controller = new ScrollMagic.Controller();
    var stringPosition = 1;
    var strings = [];
    _.range(1, 7).forEach(() => {
        // create a scene
        strings.push(new ScrollMagic.Scene({
            duration: 0,    // the scene should last for a scroll distance of 100px
            offset: stringPosition    // start this scene after scrolling for 50px
        })); // assign the scene to the controller
        stringPosition += stringHeight;
    });
    controller.addScene(strings);
    strings.forEach((string, index) => {
        string.on("start", (event) => {
            guitar.play(index.toString());
        });
    });
}

function disableGuitarStrings(guitar) {
    console.log('TODO: mute guitar strings');
    console.log('TODO; toggle icon');
}

function loadAudio(callback) {
    const guitar = new Howl({
        src: [
            "audio/guitar.ogg",
            "audio/guitar.m4a",
            "audio/guitar.mp3",
            "audio/guitar.ac3"
        ],
        volume: 0.5,
        sprite: {
            0: [
                19000,
                5208.344671201814
            ],
            1: [
                12000,
                5208.344671201814
            ],
            2: [
                5000,
                5208.344671201814
            ],
            3: [
                0,
                3125.0113378684805
            ],
            4: [
                31000,
                3125.0113378684787
            ],
            5: [
                26000,
                3125.0113378684787
            ]
        },
        onload: () => {
            callback(guitar);
        }
    });
}

function setLoadingMsg(msg) {
    document.querySelector("#loader p").textContent = msg;
}

function removeLoader(callback) {
    let loader = document.querySelector("#loader");
    loader.addEventListener('transitionend', () => {
        loader.remove();
        callback();
    });
    loader.style.opacity = 0;
}

function showStartButton(callback) {
    let btn = document.querySelector("#start");
    btn.style.opacity = 1;
    btn.addEventListener("click", () => {
        btn.addEventListener('transitionend', () => {
            btn.remove();
            callback();
        });
        btn.style.opacity = 0;
    });
}

function showSignature(callback) {
    let sig = document.querySelector("#signature");
    sig.addEventListener('transitionend', () => {
        callback();
    });
    sig.style.opacity = 1;
}

document.addEventListener("DOMContentLoaded", function(event) {

    
    if(window.location.pathname === '/') {
        setLoadingMsg('loading images...');
        loadImages(() => {
            setLoadingMsg('loading audio...');
            loadAudio((guitar) => {
                window.guitar = guitar;
                removeLoader(() => {
                    activateAudio();
                    showNav(showPhotoGrid(showNote("Unmute the guitar below.")));
                    //showSignature(() => {});
                    //new Vivus('signature', {duration: 200, type: 'oneByOne'}, () => {
                    //    activateAudio();
                    //    showFullname(showNav(showPhotoGrid(showNote("Unmute the guitar below."))));
                    //});
                });
            });
        });
    } else {
        showNav();
    }

});



