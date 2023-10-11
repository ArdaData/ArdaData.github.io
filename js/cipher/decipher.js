
// 页面加载
//var token = $.cookie("Blog.IWiki.token");
var token = "";
if (isEmpty(token)) {
    var html = '<div class="style-center" onclick="decryptHtml()" style="cursor:pointer">'
        + '<img src="/images/000000/img_00000000000000.png">'
        + '</div>'
        //+ '<div class="style-center" style="font-size: 36px;">Arda</div>';
    $("article.markdown").prepend(html);
    $("nav#TableOfContents").prepend("<ul></ul>");
} else {
    decryptHtml();
}

// 解密html
function decryptHtml() {
    var secretKey = getSecretKey();
    if (isEmpty(secretKey)) {
        return;
    }
    try {
        // 目录：catalog
        var catalogData = $("#catalogData").text().trim();
        var catalogBase64 = decryptByAes(secretKey, catalogData);
        var catalogHtml = decodeBase64(catalogBase64);

        // 正文：content
        var contentData = $("#contentData").text().trim();
        var contentBase64 = decryptByAes(secretKey, contentData)
        var contentHtml = decodeBase64(contentBase64);

        // 文档：article
        var articleData = $("#articleData").text().trim();
        var articleBase64 = decryptByAes(secretKey, articleData);
        var articleHtml = '<div id="articleBase64" class="style-hide">' + articleBase64 + '</div>';

        // fileName
        var fileNameHtml = $("#fileName").prop("outerHTML");

        // 生成html
        $("article.markdown").remove();
        $("nav#TableOfContents").remove();
        $("div.book-toc-content").prepend(catalogHtml);
        $("header.book-header").after(contentHtml);
        $("div.book-page").append(articleHtml);
        $("div.book-page").append(fileNameHtml);
    } catch (error) {
        alert("解码错误！");
        return;
    }

    var html = '<div style="margin-bottom:1rem">'
        + '<button type="button" onclick="downloadFile()" style="color:#A5A5A5">下载原文</button>'
        + '</div>';
    $("div.book-toc-content").prepend(html);
}

// 下载原件
function downloadFile() {
    var fileName = $("#fileName").text().trim();
    var articleBase64 = $("#articleBase64").text().trim();
    var article = decodeBase64(articleBase64);
    var blob = new Blob([article], { type: "text/plain" });
    saveAs(blob, fileName);
}
