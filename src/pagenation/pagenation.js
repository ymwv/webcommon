(function () {
    
    window.emitEvent = function emitEvent(ele, eventType, data) {
        var sendData = {pageNum:data};
        // console.log('data', data);
        var event = new CustomEvent(eventType, data);
        ele.dispatchEvent(event);
    }
    
    var Utils = {
        getQueryString: function getQueryString(key){
          var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
          var result = window.location.search.substr(1).match(reg);
          return result ? decodeURIComponent(result[2]) : null;
        },
        urlAddQueryItem: function(url, key ,value){ // 链接添加新的参数
            var param = Utils.getQueryString(key);
            var newUrl = param && param.length > 0 ? url : url + `&${key}=${value}`;
            return newUrl;
        },
        getBaseQueryStr: function getBaseQueryStr(){
            var search = window.location.search;
            var queryStr = '';
            if(search.indexOf('?') == 0) {
                const query  = window.location.search.split('?')[1];
                queryStr = query.replace(/\&{0,1}page=[0-9]*/, '');
            };
    
            return queryStr;
        }
    }
    
    window.pagenation = function pagenation(opt) {
        if(opt.currentPage > opt.pageCount) {
            // console.log('currentPage number error');
            return null;
        } 
        var defauOpts = {
            containerId: 'page-container',
            useEvent: false,
            currentPage: 1,
            pageCount: 1,
            baseUrl: ''
        }
    
        // this.defaultOpt = Object.assign({}, defauOpts, opt);
        this.defaultOpt = jQuery.extend({}, defauOpts, opt);
        
        this.container = document.getElementById(this.defaultOpt.containerId);
        this.useEvent = this.defaultOpt.useEvent;
        this.currentPage = this.defaultOpt.currentPage;
        this.pageCount = this.defaultOpt.pageCount;
        this.baseUrl = this.defaultOpt.baseUrl
    
        this.init();
    }
    
    pagenation.prototype = {
        init: function(){
            
                this.setBaseUrl();
            
            this.addDom();
        },
        addDom: function (){
            // 上一页
            var prePage = '';
            if(this.currentPage > 1) {
                prePage = [
                    '<li>',
                        '<a class="jump pre-page"',
                            `href="${this.preUrl()}"`,
                            `class="{ disabled: ${this.pstart()} }"`,
                            !this.useEvent ? '' : `onclick="emitEvent(this, 'jump-page', {pageNum: ${this.currentPage >= 2 ? this.currentPage - 1 : 1}})"`,
                        '>',
                            '上一页',
                        '</a>',
                    '</li>'
                ].join('');
            }
            // 第一页
            var firstPage = '';
            if(this.currentPage >= 5){
                firstPage = [
                    '<li>',
                        `<a href="${this.firstUrl()}" class="jump first-page"`,
                        !this.useEvent ? '' : `onclick="emitEvent(this, 'jump-page', {pageNum: 1})"`,
                        `>1</a>`,
                    '</li>'
                ].join('');
            }
            // 第 n 页
            var pages = '';
            var indexs = this.indexs();
            for(var i = 0; i<indexs.length; i++ ) {
                var item = indexs[i];
                var purl = this.getCurrUrl(item);
                // console.log(i, purl);
    
                var a = [`<li class="${this.currentPage == item ? 'libg01': ''}">` ,
                        '<a class="jump"' ,
                        `href="${purl}"` ,
                        // `class="${ {bgprimary : this.currentPage == item} }"` +  
                        !this.useEvent ? '' : `onclick="emitEvent(this, 'jump-page', {pageNum: ${item}})"`,
                        `>${item}</a>`, 
                    '</li>'].join('');
    
                pages += a;
            }
            // 最后一页
            var lastPage = '';
            if(this.currentPage < this.pageCount - 4) {
                lastPage = [
                    '<li>',
                        `<a class="jump lastpage" href="${this.countUrl()}"`,
                        !this.useEvent ? '' : `onclick="emitEvent(this, 'jump-page', {pageNum: ${this.pageCount}})"`,
                        `>`,
                            `${ this.pageCount }`,
                        `</a>`,
                    '</li>'
                ].join('');
            }
            // 下一页
            var nextPage = '';
            if(this.currentPage < this.pageCount) {
                nextPage = [
                    '<li>',
                        '<a  class="jump next-page"',
                            `href="${this.nextUrl()}"`,
                            !this.useEvent ? '>' : `onclick="emitEvent(this, 'jump-page', {pageNum: ${this.currentPage < this.pageCount ? this.currentPage + 1 : this.currentPage}})">`,
                            '下一页',
                        '</a>',
                    '</li>'
                ].join('');
            }
    
            var htmlStr = [
                // '<ul class="pagelist">',
                '<ul class="">',
                    prePage,
                    firstPage,
                    this.efont() ? `<a class="efont ellipsis">...</a>`: '',
                    pages,
                    this.ebehind() ? `<a class="ebehind ellipsis">...</a>`: '',
                    lastPage,
                    nextPage,
                '</ul>'
            ].join('');
            this.container.innerHTML = htmlStr;
            // $(this.container).html(htmlStr);
        },
        show: function() {
            return this.pageCount && this.pageCount !== 1;
        },
        pstart: function() {
            return this.currentPage === 1;
        },
        pend: function() {
            return this.currentPage === this.pageCount;
        },
        efont: function() {
            if (this.pageCount <= 6) return false;
            return this.currentPage > 4;
        },
        ebehind: function() {
            if (this.pageCount <= 7) return false;
            const nowAy = this.indexs();
            return nowAy[nowAy.length - 1] !== this.pageCount;
        },
        indexs: function() {
            let left = 1;
            let right = this.pageCount;
            const ar = [];
            if (this.pageCount >= 6) {
                if (this.currentPage > 4 && this.currentPage < this.pageCount - 3) {
                    left = Number(this.currentPage) - 2;
                    right = Number(this.currentPage) + 2;
                } else if (this.currentPage <= 4) {
                    left = 1;
                    right = 5;
                } else {
                    right = this.pageCount;
                    left = this.pageCount - 5;
                }
            }
            while (left <= right) {
                ar.push(left);
                left += 1;
            }
            return ar;
        },
        emit: function(eventType, data){
            var e = new Event('eventType');
            // e.dis
        },
        preUrl: function() {
            // eslint-disable-next-line
            if (this.useEvent) return 'javascript:void(0);';
            const pagenum = this.pstart() ? 1 : this.currentPage - 1;
            return `${this.baseUrl}&page=${pagenum}`;
        },
        firstUrl: function() {
            // eslint-disable-next-line
            if (this.useEvent) return 'javascript:void(0);';
            return `${this.baseUrl}&page=1`;
        },
        countUrl: function() {
            // eslint-disable-next-line
            if (this.useEvent) return 'javascript:void(0);';
    
            return `${this.baseUrl}&page=${this.pageCount}`;
        },
        nextUrl: function() {
            // eslint-disable-next-line
            if (this.useEvent) return 'javascript:void(0);';
            const cpage = parseInt(this.currentPage, 10);
            const pagenum = cpage < parseInt(this.pageCount, 10) ? cpage + 1 : cpage;
            return `${this.baseUrl}&page=${pagenum}`;
        },
        getCurrUrl(num) {
            // eslint-disable-next-line
            if (this.useEvent) return 'javascript:void(0);';
            return this.currentPage == num ? 'javascript:void(0);' : `${this.baseUrl}&page=${num}`;
        },
        setBaseUrl() {
            if(this.baseUrl == '' || this.baseUrl==undefined) {
                var queryStr = Utils.getBaseQueryStr();
                const postQueryStr = queryStr === '' ? '?' : `${queryStr}`;
                this.baseUrl = `${window.location.pathname}?${postQueryStr}`;
            } else if(this.baseUrl.indexOf('?') < 0) {
                this.baseUrl = this.baseUrl + '?'
            }
        }
    }
    
    })();