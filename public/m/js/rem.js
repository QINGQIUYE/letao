function getHtmlFontSize(){

    var nowWidth = document.documentElement.clientWidth;
    // console.log(nowWidth);

    var nowFontSize = nowWidth / (750/200);
    document.documentElement.style.fontSize = nowFontSize + 'px';
}
getHtmlFontSize();
window.addEventListener('resize',getHtmlFontSize);