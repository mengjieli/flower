/**
 * LLABF算法
 *
 * 算法相关的数学定义:
 *
 * 队列I={π1,π2,…,πn}表示n个矩形的某个装入序列,其中,πi是矩形编号,πi∈[1,n],对任意i,j∈[1,n],当i≠j时, πi≠πj.设I(i)表示队
 * 列I中第i个位置上对应的矩形,它由五元组构成,即I(i)={x,y,w,h,θ},其中,I(i).x,I(i).y分别表示该矩形装入后,其左下角的横、纵坐标;I(i).w,
 * I(i).h,I(i).θ分别表示该矩形的宽度、高度和旋转角度. 设队列E={e1,e2,…,em}表示装入过程中产生的轮廓线集合,元素ek为水平线线段(与X坐标轴平行),
 * 它由三元组构成,即ek={x,y,w},其中,ek.x,ek.y表示第k个水平线线段的左端点坐标(起点坐标);ek.w表示第k个水平线线段的宽度;并且对任意0<k<m,
 * 有ek.x<ek+1.x,即按轮廓线起点的x坐标从小到大排列.队列E具有以下特征:其y坐标具备唯一性,如果相邻线段具有相同的高度y,则进行合并;所有线段在X
 * 坐标上的投影不重叠;所有线段的宽度之和刚好等于矩形容器宽度W.
 *
 *
 *
 *
 * 算法的5个启发式条件:
 *
 * 1. 完全匹配优先(full-fit first,简称FFF). 在可装入的轮廓线中选取最低的水平线ek,如果有多个线段,则优先选取最左边的一段.
 * 从待装矩形中按照装入序列依次将矩形与ek进行比较,如果存在宽度或者高度与该线段宽度ek.w相等且装入后刚好左填平或者右填平的矩形则优先装入.
 * 完全匹配优先能够减少装入后产生的轮廓线数量,使得装入轮廓朝着顶部平齐的方向发展.
 *
 * 2.宽度匹配优先(width-fit first,简称WFF). 在装入过程中,优先装入宽度或者高度与最低水平线ek等宽的矩形,如果存在多个匹配矩形,则优先装入
 * 面积最大的.与完全匹配优先规则不同的是,宽度匹配优先并不要求装入后能够实现左填平或者右填平;同时,该规则使得较小矩形有推迟装入的趋势.另外,
 * WFF不会增加装入轮廓线数量.
 *
 * 3.高度匹配优先(height-fit first,简称HFF). 在待装矩形中,按照装入序列查询宽度或高度不大于最低水平线ek宽度且装入后能够实现左填平的矩形,
 * 若存在则装入查询到的首个矩形.与FFF和WFF不同,HFF可能会在最低水平线上产生新的、更小的可装入区域,但却增加了轮廓线ek−1的宽度.
 *
 * 4.组合宽度匹配优先(joint-width-fit first,简称JWFF). 按装入序列对两个矩形进行组合,如果组合后的宽度与最低水平线宽度ek相等,则优先装入组
 * 合序列中的首个矩形.例如,存在两种组合I(i1).w+I(j1).w=ek.w, I(i2).w+I(j2).w=ek.w,如果I(i1)的面积大于I(i2),则首先装入I(i1),否则装入I(i2).
 *  JWFF,FFF与WFF规则避免了在最低水平线ek上产生新的、更小的可装入区域,从而减少了整个装箱过程产生空洞的可能性.为了保证时效性,算法中设置了查询
 * 范围searchNum,即从当前位置开始,最多可以进行searchNum×searchNum次连续矩形的两两组合查询.
 *
 * 5.可装入优先(placeable first,简称PF). 在一定范围内,从待装矩形件中按照装入序列依次查找宽度或高度不大于最低水平线ek宽度的矩形,若存在,则将
 * 其装入;若存在多个,则装入面积最大的矩形.PF可能在最低水平线上产生新的、更小的可装入区域,同时使得较小矩形延迟装入.
 *
 * 附:在矩形的装入过程中,满足FFF,WFF,HFF以及JWFF规则的矩形可能并不存在,此时就必须考虑PF.如果满足PF规则的矩形仍不存在,那么必然会在最低水平线
 * 上产生空洞.与BL,IBL,LFLA以及LHL算法不同,该空洞是在一定范围内由于不存在可装入的矩形而产生的,因此其面积更小.与BLF算法不同,LLABF算法并不需
 * 要保存新产生的空洞.
 **/

var gallabf;
(function (gallabf) {
    var LLABF = (function () {

        /**
         * 染色体
         *
         * 个体适应度 = 1/pacH
         *
         **/
        function LLABF(rects, w, rotFlag) {
            this.lowIndex = 0;
            this.E = [];
            this.pushRects = []
            this.pacH = [];
            this.canRot = rotFlag;
            this.mRects = rects;
            this.E.push(Buffer.getLine(0, 0, w));
            this.low = this.E[0];
        }

        var d = __define, c = LLABF;
        p = c.prototype;

        __define(p, "PacH",
            function () {
                return this.pacH;
            },
            function (val) {
            }
        );

        __define(p, "Rects",
            function () {
                return this.pushRects;
            },
            function (val) {
            }
        );

        __define(p, "ES",
            function () {
                return this.E;
            },
            function (val) {
            }
        );

        p.step = function () {
            if (this.mRects.length) {
                var rst = this.FFF();
                if (rst == null) {
                    return;
                }

                var has = false;
                for (var o in rst) {
                    has = true;
                }
                if (has) {
                    this.WFF(rst);
                    return;
                }

                if (this.HFF() == true) {
                    return;
                }

                if (this.JWFF() == true) {
                    return;
                }

                if (this.PF() == true) {
                    return;
                }

                var lowIndex = this.lowIndex;
                var E = this.E;
                var low = this.low;
                //以上方法都找不到合适的则合并最低的线于相邻最低的线
                if (lowIndex == 0 || (lowIndex < E.length - 1 && E[lowIndex + 1].y < E[lowIndex - 1].y)) {
                    low.w += E[lowIndex + 1].w;
                    low.y = E[lowIndex + 1].y;
                    E.splice(lowIndex + 1, 1);
                }
                else {
                    E[lowIndex - 1].w += low.w;
                    E.splice(lowIndex, 1);
                }
                this.findLowLine();
            }
            this.pacH = 0;
            for (var i = 0; i < E.length; i++) {
                this.pacH = this.pacH < E[i].y ? E[i].y : this.pacH;
            }
        }

        /*
         * 1. 完全匹配优先(full-fit first,简称FFF). 在可装入的轮廓线中选取最低的水平线ek,如果有多个线段,则优先选取最左边的一段.
         * 从待装矩形中按照装入序列依次将矩形与ek进行比较,如果存在宽度或者高度与该线段宽度ek.w相等且装入后刚好左填平或者右填平的矩形则优先装入.
         * 完全匹配优先能够减少装入后产生的轮廓线数量,使得装入轮廓朝着顶部平齐的方向发展.
         *
         * return obj[index] = rect;	 key: 矩形的待放顺序
         */
        p.FFF = function () {
            var rst = {};
            var low = this.low;
            var mRects = this.mRects;
            var lowIndex = this.lowIndex;
            var pushRects = this;
            pushRects
            var E = this.E;
            for (var i = 0; i < mRects.length; i++) {
                if (mRects[i].w == low.w)	//宽度匹配
                {
                    if (lowIndex > 0 && E[lowIndex - 1].y == low.y + mRects[i].h) //左填平
                    {
                        mRects[i].x = low.x;
                        mRects[i].y = low.y;
                        pushRects.push(mRects[i]);	//放入结果
                        mRects.splice(i, 1);			//从待装矩形队列中移除
                        E[lowIndex - 1].w += low.w;	//合并到左水平线中
                        E.splice(lowIndex, 1);
                        if (this.tryMemgerLines(lowIndex - 1) == false)
                            this.findLowLine();				//查找最低水平线
                        return null;
                    }
                    else if (lowIndex < E.length - 1 && E[lowIndex + 1].y == low.y + mRects[i].h)	//右填平
                    {
                        mRects[i].x = low.x;
                        mRects[i].y = low.y;
                        pushRects.push(mRects[i]);	//放入结果
                        mRects.splice(i, 1);			//从待装矩形队列中移除
                        E[lowIndex + 1].x -= low.w;	//合并到右水平线中
                        E[lowIndex + 1].w += low.w;
                        E.splice(lowIndex, 1);
                        this.findLowLine();				//查找最低水平线
                        return null;
                    }
                    rst[i] = mRects[i];
                }
                else if (this.canRot && mRects[i].h == low.w)	//高度匹配
                {
                    if (lowIndex > 0 && E[lowIndex - 1].y == low.y + mRects[i].w)	//左填平
                    {
                        mRects[i].x = low.x;
                        mRects[i].y = low.y;
                        mRects[i].rot = true;
                        pushRects.push(mRects[i]);	//放入结果
                        mRects.splice(i, 1);
                        E[lowIndex - 1].w += low.w;	//合并到左水平线中
                        E.splice(lowIndex, 1);
                        if (this.tryMemgerLines(lowIndex - 1) == false)
                            this.findLowLine();				//查找最低水平线
                        return null;
                    }
                    else if (lowIndex < E.length - 1 && E[lowIndex + 1].y == low.y + mRects[i].w)	//右填平
                    {
                        mRects[i].x = low.x;
                        mRects[i].y = low.y;
                        mRects[i].rot = true;
                        pushRects.push(mRects[i]);	//放入结果
                        mRects.splice(i, 1);
                        E[lowIndex + 1].x -= low.w;	//合并到右水平线中
                        E[lowIndex + 1].w += low.w;
                        E.splice(lowIndex, 1);
                        this.findLowLine();				//查找最低水平线
                        return null;
                    }
                    rst[i] = mRects[i];
                }
            }
            return rst;
        }

        /*
         * 2.宽度匹配优先(width-fit first,简称WFF). 在装入过程中,优先装入宽度或者高度与最低水平线ek等宽的矩形,如果存在多个匹配矩形,则优先装入
         * 面积最大的.与完全匹配优先规则不同的是,宽度匹配优先并不要求装入后能够实现左填平或者右填平;同时,该规则使得较小矩形有推迟装入的趋势.另外,
         * WFF不会增加装入轮廓线数量.
         */
        p.WFF = function (rects) {
            var low = this.low;
            var max;
            var key;
            for (var o in rects) {
                if (max == null || rects[o].w * rects[o].h > max.w * max.h) {
                    max = rects[o];
                    key = o;
                }
            }
            max.x = low.x;
            max.y = low.y;
            this.pushRects.push(max);
            this.mRects.splice(key, 1);
            if (max.w != low.w) {
                max.rot = true;
                low.y += max.w;
            }
            else {
                low.y += max.h;
            }
            this.findLowLine();
            return;
        }

        /*
         * 3.高度匹配优先(height-fit first,简称HFF). 在待装矩形中,按照装入序列查询宽度或高度不大于最低水平线ek宽度且装入后能够实现左填平的矩形,
         * 若存在则装入查询到的首个矩形.与FFF和WFF不同,HFF可能会在最低水平线上产生新的、更小的可装入区域,但却增加了轮廓线ek−1的宽度.
         * ?????? 为什么不匹配右填平
         */
        p.HFF = function () {
            var lowIndex = this.lowIndex;
            var mRects = this.mRects;
            var low = this.low;
            var E = this.E;
            if (lowIndex == 0)return false;
            for (var i = 0; i < mRects.length; i++) {
                if (mRects[i].w < low.w && low.y + mRects[i].h == E[lowIndex - 1].y) {
                    mRects[i].x = low.x;
                    mRects[i].y = low.y;
                    E[lowIndex - 1].w += mRects[i].w;	//延长左水平线
                    low.x += mRects[i].w;
                    low.w -= mRects[i].w;
                    this.pushRects.push(mRects[i]);
                    mRects.splice(i, 1);
                    return true;
                }
                if (this.canRot && mRects[i].h < low.w && low.y + mRects[i].w == E[lowIndex - 1].y) {
                    mRects[i].x = low.x;
                    mRects[i].y = low.y;
                    mRects[i].rot = true;
                    E[lowIndex - 1].w += mRects[i].h;	//延长左水平线
                    low.x += mRects[i].h;
                    low.w -= mRects[i].h;
                    this.pushRects.push(mRects[i]);
                    mRects.splice(i, 1);
                    return true;
                }
            }

            return false;
        }

        /*
         * 4.组合宽度匹配优先(joint-width-fit first,简称JWFF). 按装入序列对两个矩形进行组合,如果组合后的宽度与最低水平线宽度ek相等,则优先装入组
         * 合序列中的首个矩形.例如,存在两种组合I(i1).w+I(j1).w=ek.w, I(i2).w+I(j2).w=ek.w,如果I(i1)的面积大于I(i2),则首先装入I(i1),否则装入I(i2).
         *  JWFF,FFF与WFF规则避免了在最低水平线ek上产生新的、更小的可装入区域,从而减少了整个装箱过程产生空洞的可能性.为了保证时效性,算法中设置了查询
         * 范围searchNum,即从当前位置开始,最多可以进行searchNum×searchNum次连续矩形的两两组合查询.
         */
        var searchNum = 10;	//这个数值的设定与寻找最优解的时间和可能性相关，数值越大越容易找到最优解，但也越耗时，反之亦然
        p.JWFF = function()
        {
            var mRects = this.mRects;
            var low = this.low;
            var E = this.E;
            var pushRects = this.pushRects;
            var lowIndex = this.lowIndex;
            for(var i = 0; i < searchNum && i < mRects.length-1; i++)
            {
                if(mRects[i].w + mRects[i+1].w == low.w)
                {
                    mRects[i].x = low.x;
                    mRects[i].y = low.y;
                    mRects[i+1].x = low.x + mRects[i].w;
                    mRects[i+1].y = low.y;
                    low.w = mRects[i].w;
                    low.y += mRects[i].h;
                    var line = gallabf.Buffer.getLine(low.x + low.w,low.y - mRects[i].h + mRects[i+1].h,mRects[i+1].w);
                    E.splice(lowIndex+1,0,line);
                    pushRects.push(mRects[i]);
                    pushRects.push(mRects[i+1]);
                    mRects.splice(i,2);
                    if(this.tryMemgerLines(lowIndex) == false)
                    {
                        this.findLowLine();
                    }
                    return true;
                }
            }
            return false;
        }

        /*
         * 5.可装入优先(placeable first,简称PF). 在一定范围内,从待装矩形件中按照装入序列依次查找宽度或高度不大于最低水平线ek宽度的矩形,若存在,则将
         * 其装入;若存在多个,则装入面积最大的矩形.PF可能在最低水平线上产生新的、更小的可装入区域,同时使得较小矩形延迟装入.
         *
         */
        p.PF = function()
        {
            var mRects = this.mRects;
            var low = this.low;
            var E = this.E;
            var max;
            var maxInd;
            for(var i = 0; i < mRects.length; i++)
            {
                if(mRects[i].w < low.w || (this.canRot == true && mRects[i].h < low.w))
                {
                    if(max == null || max.w*max.h < mRects[i].w*mRects[i].h)
                    {
                        max = mRects[i];
                        maxInd = i;
                    }
                }
            }
            if(max)
            {
                max.x = low.x;
                max.y = low.y;
                this.pushRects.push(max);
                mRects.splice(maxInd,1);
                var line;
                if(this.canRot==false || max.w < low.w)
                {
                    line = gallabf.Buffer.getLine(low.x + max.w,low.y,low.w - max.w);
                    low.w = max.w;
                    low.y += max.h;
                }
                else
                {
                    max.rot = true;
                    line = gallabf.Buffer.getLine(low.x + max.h,low.y,low.w - max.h);
                    low.w = max.h;
                    low.y += max.w;
                }
                E.splice(this.lowIndex+1,0,line);
                this.findLowLine();
                return true;
            }
            return false;
        }

        /*
         * 查找最低水平线
         *
         */
        p.findLowLine = function()
        {
            this.low = this.E[0];
            this.lowIndex = 0;
            for(var i = 1; i < this.E.length; i++)
            {
                if(this.E[i].y < this.low.y)
                {
                    this.low = this.E[i];
                    this.lowIndex = i;
                }
            }
        }

        /*
         * 尝试合并 ind 和 ind+1的线  如果合成后继续尝试往右合并
         */
        p.tryMemgerLines = function(ind,findLow)
        {
            findLow = findLow==null?true:findLow;
            var E = this.E;
            if(ind == E.length-1)return false;
            if(E[ind].y == E[ind+1].y)
            {
                E[ind].w += E[ind+1].w;
                E.splice(ind+1,1);
                this.tryMemgerLines(ind,false);
                if(findLow)
                    this.findLowLine();
                return true;
            }
            return false;
        }


        p.gc = function()
        {
            var pushRects = this.pushRects;
            var E = this.E;
            for(var i = 0; i < pushRects.length; i++)
            {
                gallabf.Buffer.disposeRect(pushRects[i]);
                pushRects[i] = null;
            }
            for(i = 0; i < E.length; i++)
            {
                gallabf.Buffer.disposeLine(E[i]);
                E[i] = null;
            }
        }

        return LLABF;
    })();
    gallabf.LLABF = LLABF;
})(gallabf || (gallabf = {}));