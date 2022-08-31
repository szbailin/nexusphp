jQuery(document).ready(function () {
    jQuery('.spoiler-title').on('click', function () {
        let content = jQuery(this).parent().next();
        if (content.hasClass('collapse')) {
            content.height(content[0].scrollHeight).removeClass('collapse')
        } else {
            content.height(0).addClass('collapse')
        }
    })

    function getImgPosition(e, imgEle) {
        let imgWidth = imgEle.prop('naturalWidth')
        let imgHeight = imgEle.prop("naturalHeight")
        let ratio = imgWidth / imgHeight;
        let offsetX = 10;
        let offsetY = 10;
        let width = window.innerWidth - e.pageX;
        let height = window.innerHeight - e.pageY;
        let changeOffsetY = false;
        let changeOffsetX = false;
        if (e.pageX > window.innerWidth / 2 && e.pageX + imgWidth > window.innerWidth) {
            changeOffsetX = true
            width = e.pageX
        }
        if (e.pageY > window.innerHeight / 2 && e.pageY + imgHeight > window.innerHeight) {
            changeOffsetY = true
            height = e.pageY
        }
        let log = `imgWidth: ${imgWidth}, imgHeight: ${imgHeight}, width: ${width}, height: ${height}, offsetX: ${offsetX}, offsetY: ${offsetY}, changeOffsetX: ${changeOffsetX}, changeOffsetY: ${changeOffsetY}`
        console.log(log)
        if (imgWidth > width) {
            imgWidth = width;
            imgHeight = imgHeight = imgWidth / ratio;
        }
        if (imgHeight > height) {
            imgHeight = height;
            imgWidth = imgHeight * ratio;
        }
        if (changeOffsetX) {
            offsetX = -(e.pageX - width + 10)
        }
        if (changeOffsetY) {
            offsetY = -(e.pageY - imgHeight/2)
        }
        return {imgWidth, imgHeight,offsetX, offsetY}
    }

    // preview
    function getPosition(e, position) {
        return {
            left: e.pageX + position.offsetX,
            top: e.pageY + position.offsetY,
            width: position.imgWidth,
            height: position.imgHeight
        }
    }
    var previewEle = jQuery('#nexus-preview')
    var imgEle, selector = 'img.preview', imgPosition
    jQuery("body").on("mouseover", selector, function (e) {
        imgEle = jQuery(this);
        imgPosition = getImgPosition(e, imgEle)
        let position = getPosition(e, imgPosition)
        let src = imgEle.attr("src")
        if (src) {
            previewEle.attr("src", src).css(position).fadeIn("fast");
        }
    }).on("mouseout", selector, function (e) {
        previewEle.fadeOut("fast");
    }).on("mousemove", selector, function (e) {
        let position = getPosition(e, imgPosition)
        previewEle.css(position)
    })

    // lazy load
    if ("IntersectionObserver" in window) {
        const imgList = [...document.querySelectorAll('.nexus-lazy-load')]
        var io = new IntersectionObserver((entries) =>{
            entries.forEach(item => {
                // isIntersecting是一个Boolean值，判断目标元素当前是否可见
                if (item.isIntersecting) {
                    item.target.src = item.target.dataset.src
                    item.target.classList.add('preview')
                    // 图片加载后即停止监听该元素
                    io.unobserve(item.target)
                }
            })
        }, {
            root: document.querySelector('body')
        })

        // observe遍历监听所有img节点
        imgList.forEach(img => io.observe(img))
    }

})
