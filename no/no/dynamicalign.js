///// DYNAMIC ALIGN




function align()
{
    const anchors = document.getElementsByTagName('a');
    const banner = document.getElementById("banner");
    const align1 = document.getElementsByClassName("rightalign")[0];

    for(a of anchors)
    {
        a.style.bottom = (document.getElementsByTagName('header')[0].clientHeight * 0.4) + 'px';
    }

    banner.style.height = innerHeight + "px";
    align1.style.left = (innerWidth / 2) + "px";
    align1.style.top = (innerHeight / 2) + "px";
}


align();

let oldheight = innerHeight;

setInterval(()=>
{
    if(innerHeight !== oldheight)
    {
        align();
        oldheight = innerHeight;
    }
});