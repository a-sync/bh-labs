// ==UserScript==
// @name        Watchlist IMDB info
// @namespace   bH
// @description Megfigyelt torrenteknél megjeleníti az imdb infókat.
// @include     https://bithumen.be/watchlist.php*
// @include     http://bithumen.be/watchlist.php*
// @include     https://bithumen.ru/watchlist.php*
// @include     http://bithumen.ru/watchlist.php*
// @version     0.0.1
// @author      Vector
// @grant       none
// ==/UserScript==
(function() {

function imdb_rating_run () {
  window.imdb = {
    rating: {
        run: function(data) {
                //console.log(data);
                var imdb_id = data.resource.id.split('title/tt')[1].split('/')[0];
                var imdb_link = document.getElementById('imdb-'+imdb_id);

                var info = ' '+String.fromCharCode(160)+' '+data.resource.title+' (' +data.resource.year+')';
                if(data.resource.canRate) info += ' '+data.resource.rating+'/10';

                var info_link = imdb_link.cloneNode(false);
                info_link.style.textDecoration = 'none';
                info_link.appendChild(document.createTextNode(info));

                imdb_link.parentNode.insertBefore(info_link, imdb_link.nextSibling);
                //imdb_link.appendChild(span);
            }
        }
    };
}

function wlii()
{
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ imdb_rating_run +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);

    var i = 1;
    while( i > 0 ) {
        var rb = document.getElementById("rating_bookmark_"+i);
        
        if( ! rb ) i = 0;
        else {
            var imdb_link = rb.nextElementSibling.href;
            //console.log(imdb_link);
            
            if(imdb_link.indexOf('www.imdb.com/title/tt') !== false) {
                var imdb_id = imdb_link.split('/title/tt')[1].split('/')[0];
                //console.log(imdb_id);
                
                rb.nextElementSibling.setAttribute("id", "imdb-"+imdb_id);
                
                inject_script(
                'https://p.media-imdb.com/static-content/documents/v1/title/'
                +'tt'+imdb_id
                +'/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json?u=ur900000000&s=p3'
                );
            }
            
            i++;
        }
    }
}

function inject_script(src)
{
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = src;
    (document.body || document.head || document.documentElement).appendChild(js);
}

wlii();//go!

})();