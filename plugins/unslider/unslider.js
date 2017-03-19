'use strict'
/**
 * @author cattle
 * @date 2017-03-18
 * 
 */
const Unslider = {
    init: (window, options)=> {
        const that = this || Unslider;  
        that.opts = {
            $bannerBox: $(options.bannerBox || '.banner'),
            $banItemBox: $(options.bannItemBox || '.ban-item-box'),
            $items: $(options.banItem || '.ban-item'),
            delay: options.delay || 1000,
            sleep: options.sleep || 3000,
            isShowDots: options.isShowDots || true,
            isShowArrow: options.isShowArrow || true,
            isAutoPlay: options.isAutoPlay || true
        }
        that.index = 0;
        that.autoPlayFn = '';
        that.countPx();
        that.dotsCut();
        if(that.opts.isShowArrow){
            that.showArrow();
        }
        if(that.opts.isAutoPlay){
            that.autoPlayFn = setInterval(function(){
                that.autoPlay();
            }, that.opts.sleep);
        }
       
    },
    autoPlay: (window) =>{
        const that = this || Unslider;
        that.index += 1;
        that.index = (that.index > (that.opts.$items.length - 1)) ? 0 : that.index;
        $('.dots-box').children('li').eq(that.index).trigger('click');
    },
    countPx: () => {
        const that = this || Unslider;
        const opts = that.opts;
        const itemWidth = opts.$items.first().width();
        opts.$items.width(itemWidth);
        opts.$banItemBox.width(( opts.$items.length * 1920 ) + 'px');
    },
    showArrow: () => {
      const that = this || Unslider;
      const bannerBox = that.opts.$bannerBox;
      const arrowBox = `<div class="arrow-box hide"></div>`;
      const btnHtml = `<span class="btn-prev"> &lt; </span><span class="btn-next"> &gt; </span>`;
      bannerBox.append(arrowBox);
      const $arrowBox = $('.arrow-box');
      $arrowBox.html(btnHtml);
      const $nextBtn = $('.btn-next');
      const $prevBtn = $('.btn-prev');
      bannerBox.hover(
          function() {
            window.clearInterval(that.autoPlayFn)
            $arrowBox.removeClass('hide');
            that.arrowCut($nextBtn, 'next');
            that.arrowCut($prevBtn, 'prev');
          },
          function() {
            if(that.opts.isAutoPlay){
                that.autoPlayFn = '';
                that.autoPlayFn = setInterval(function(){
                    that.autoPlay();
                }, that.opts.sleep);
            }
            $arrowBox.addClass('hide');
          }
      )
    },
    arrowCut: (dom, type) => {
        const that = this || Unslider;
        dom.unbind('click').on('click', function(){
            const bannerItems = $('.ban-item-box').children('li');
            const dotItems = $('.dots-box').children('li');
            if(type === 'prev'){
                that.index -= 1;
                that.index = (that.index < 0) ? (bannerItems.length -1) : that.index;
            }else{
                that.index += 1;
                that.index = (that.index > (bannerItems.length - 1)) ? 0 : that.index;
            }
            dotItems.removeClass('dot-item-active');
            $(dotItems[that.index]).addClass('dot-item-active');
            const num = that.index * 1920;
            that.animate(num);
        })
    },
    dotsCut: () =>　{
        const that = this || Unslider;
        const dotFlag = that.opts.isShowDots;
        if (dotFlag){
            const len = that.opts.$items.length;
            const $dotItem = `<li class="dot-item"></li>`;
            const $dotsBox = `<ul class="dots-box"></ul>`;
            that.opts.$bannerBox.append($dotsBox);
            for (let i = 0; i < len; i++){ $('.dots-box').append($dotItem);}
            const dotsBox = $('.dots-box');
            dotsBox.children('li:first').addClass('dot-item-active');
            dotsBox.delegate('li', 'click', function(){
                const _t = $(this);
                that.index = _t.index();
                const percentage = (that.index * 1920);
                _t.addClass('dot-item-active').siblings().removeClass('dot-item-active');
                that.animate(percentage);
            });
        }
    },
    animate: (num) => {
        const that = this || Unslider;
        that.opts.$banItemBox.stop(true).animate(
          {
            'left': '-' + num + 'px'
          }, that.opts.delay);
    }
}

export default Unslider;