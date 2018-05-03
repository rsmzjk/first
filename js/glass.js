//兼容处理
function getStyle(obj,attr){
    return obj.currentStyle? obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj,null)[attr];
    // if(obj.currentStyle){
    //     return obj.currentStyle[attr];
    // }
    // else{
    //     return document.defaultView.getComputedStyle(obj,null)[attr];
    // }
}

var oBox = document.getElementsByClassName('box')[0],//获取放大镜可视区域元素box
    oSimg = oBox.getElementsByClassName('s-img')[0],//获取中图div元素
    sImg = oSimg.getElementsByTagName('img')[0],//获取中图img元素
    sMove = oSimg.getElementsByClassName('move')[0],//获取遮罩层元素
    oBimg = oBox.getElementsByClassName('b-img')[0],//获取大图div元素
    bImg = oBimg.getElementsByTagName('img')[0],//获取大图img元素
    oContent = oBox.getElementsByClassName('content')[0],//获取小图可视区元素
    aI = oContent.getElementsByTagName('i'),//获取左右按钮
    oUl = oContent.getElementsByTagName('ul')[0],
    aLi = oUl.getElementsByTagName('li'),//获取小图节点数
    len = aLi.length,//获取小图个数
    mLeft,mRight,width,x,y,moveX,moveY,
    num = 0;//获取当前所在小图下标

//初始化获取内容
mLeft = parseInt(getStyle(aLi[num],'marginLeft'));//小图左外边距
mRight = parseInt(getStyle(aLi[num],'marginRight'));//小图右外边距
width = aLi[num].offsetWidth + mLeft + mRight;//小图每次滚动宽度

//鼠标滑入/出大图 显示遮罩层&放大层
oSimg.onmouseenter = function(){
    sMove.style.display = 'block';
    oBimg.style.display = 'block';
    //局部放大(放大镜窗口与被遮罩层窗口可一致大小) 放大镜盒子宽(高)度*被遮罩层盒子宽(高)度/遮罩层盒子宽(高)度 就是需要放大的图片的宽(高)
    bImg.style.width = oBimg.offsetWidth*oSimg.offsetWidth/sMove.offsetWidth+ 'px';
    bImg.style.height = oBimg.offsetHeight*oSimg.offsetHeight/sMove.offsetHeight+ 'px';
    //局部放大 (放大镜窗口不与遮罩层窗口大小一致)
    // oBimg.style.width = (bImg.offsetWidth/sImg.offsetWidth)*sMove.offsetWidth+'px';
    // oBimg.style.height = (bImg.offsetHeight/sImg.offsetHeight)*sMove.offsetHeight+'px';
};
oSimg.onmouseleave = function(){
    sMove.style.display = '';
    oBimg.style.display = '';
};
//点击左右按钮切换
aI[0].onclick = function(){
    same(function(){
        num--;
        if( num<0 )num=len-1;
    });
}
aI[1].onclick = function(){
    same(function(){
        num++;
        if( num>=len )num=0;
    });
}
// for (var i = 0; i < aI.length; i++) {
//     aI[i].index = i;
//     aI[i].onclick = function(){
//         var _this = this;
//         same(function(){
//             if( _this.index ){
//                 num++;
//                 if( num>=len )num=0;
//             }else {
//                 num--;
//                 if( num<0 )num=len-1;
//             }
//         });
//     }
// }
//点击共有属性
function same(fn) {
    aLi[num].className = "";
    fn && fn();
    start();
    var left = width*num;
    if( (len-5)*width < left ){
        left = (len-5)*width;
    }
    oUl.style.marginLeft = -left + 'px';
}
function start(){
    var oImg = aLi[num].getElementsByTagName('img')[0],
        oB = oImg.getAttribute('mid'),
        oS = oImg.getAttribute('big');
    sImg.setAttribute('src',oB);
    bImg.setAttribute('src',oS);
    aLi[num].className = "on";
}
//鼠标滑入小图事件
for (var i = 0; i < len; i++) {
    start();
    aLi[i].index = i;
    aLi[i].onmouseenter = function(){
        aLi[num].className = "";
        num = this.index;
        start();
    };
};
//鼠标移入大图事件
oSimg.onmousemove = function(ev){
    ev = ev || window.ev;
    var maxX = oSimg.offsetWidth - sMove.offsetWidth,
        maxY = oSimg.offsetHeight - sMove.offsetHeight;
    x = ev.clientX - oBox.offsetLeft - sMove.offsetWidth/2;
    y = ev.clientY - oBox.offsetTop - sMove.offsetHeight/2;
    //判断鼠标可移动的最大(小)横(纵)向距离
    if (x>=maxX || x<=0) {
        x = Math.max(x,0);
        x = Math.min(x,maxX);
    }
    if (y>=maxY || y<=0) {
        y = Math.max(y,0);
        y = Math.min(y,maxY);
    }
    //遮罩层所在坐标
    sMove.style.left = x + 'px';
    sMove.style.top = y + 'px';
    //移动比例 (鼠标指针所在x(y)坐标/鼠标可移动的最大横(纵)向距离)
    moveX = x/maxX;
    moveY = y/maxY;
    //移动大图 遮罩层移动的横(纵)向比例*(放大镜图片的宽(高)度减去被遮罩层图片的宽(高)度)
    bImg.style.left = moveX*(oBimg.offsetWidth - bImg.offsetWidth) + 'px';
    bImg.style.top = moveY*(oBimg.offsetHeight - bImg.offsetHeight) + 'px';
};