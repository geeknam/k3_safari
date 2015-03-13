var product_name = document.querySelectorAll("#content-two div strong")[0].innerText;

try{
    var img_src_split = document.querySelectorAll("#vmcoepetukj img")[0].src.split('/');
} catch (e){
    var img_src_split = document.querySelectorAll("#price_box img")[0].src.split('/');
}

var price = img_src_split[img_src_split.length - 1].split('__')[0];
if (price.indexOf('_') != 1) {
    price = price.split('_')[0];
}
var competitor = 'jbhifi';