/**
 * 二维集装箱问题 -   GA+LLABF算法
 *
 * 算法思想参见http://wenku.baidu.com/view/6c5ad9f24693daef5ef73df4.html  二维矩形条带装箱问题的底部左齐择优匹配算法
 *
 * 创建时间2012/11/29
 * @ mengjieli
 *
 *
 * GA+LLABF的算法流程如下所示.
 * (1) 个体染色体编码.
 * (2)  k=0;随机产生m个个体组成初始群体pop(k)={I1,I2,…,Im}.
 * (3) 对单个个体Ii执行LLABF(Ii,Hpacking);记录个体适应度f(Ii)(f(Ii)=1/Hpacking).
 * (4) 判断是否满足停止条件.若是,则停止计算,输出最佳结果;否则,继续.
 * (5) 利用排序选择操作选择m个个体形成新的群体selpop(k+1).
 * (6) 根据交叉概率Pc进行交叉操作,产生群体crosspop(k+1).
 * (7) 根据变异概率Pm进行变异操作,产生群体mutpop(k+1).
 * (8) pop(k+1)=mutpop(k+1);k=k+1;转(3),循环.
 *
 *
 *
 * 基本遗传算法伪代码
 * Pc：交叉发生的概率
 * Pm：变异发生的概率
 * M：种群规模
 * G：终止进化的代数
 * Tf：进化产生的任何一个个体的适应度函数超过Tf，则可以终止进化过程
 * 初始化Pm，Pc，M，G，Tf等参数。随机产生第一代种群Pop
 * do
 * {
 * 	计算种群Pop中每一个体的适应度F(i)。
 * 	初始化空种群newPop
 * 		do
 * 		{
 * 			根据适应度以比例选择算法从种群Pop中选出2个个体
 * 			if ( random ( 0 , 1 ) < Pc )
 * 			{
 * 				对2个个体按交叉概率Pc执行交叉操作
 * 			}
 * 			if ( random ( 0 , 1 )  < Pm )
 * 			{
 * 				对2个个体按变异概率Pm执行变异操作
 * 			}
 * 			将2个新个体加入种群newPop中
 * 		} until ( M个子代被创建 )
 * 		用newPop取代Pop
 * } until ( 任何染色体得分超过Tf， 或繁殖代数超过G )
 */
var gallabf;
(function (gallabf) {
    var GA_LLABF = (function () {

        /*
         *  source 数组 [{width:int,height:int},...]
         *  w 盒子的宽度
         */
        function GA_LLABF(source, w, gmax, gnum, rot) {
            gmax = gmax || 20;
            gnum = gnum || 20;
            rot = rot || false;
            this.mSRects = [];
            this.width = w;
            this.group = null;	//当前群体
            this.groupMax = gmax;		//最大代数
            this.groupNum = gnum;		//群体大小
            this.chooseC = null;			//选择系数
            this.crooseP = 0.85;		//交叉概率
            this.mutationP = 0.3;	//变异概率
            this.maxChromosome = null;
            this.rotFlag = rot;
            this.recordLLABF = {};
            for (var i = 0; i < source.length; i++) {
                var rect = gallabf.Buffer.getRect(i + 1, source[i].width, source[i].height);
                this.mSRects.push(rect);
            }
            this.createFirstGroup();
            this.runGroup();
            var n = 1;
            while (n < this.groupMax) {
                this.createNewGroup();
                this.runGroup();
                n++;
            }
        }

        var d = __define, c = GA_LLABF;
        p = c.prototype;

        p.getBestRects = function () {
            var rects = [];
            var rw;
            var maxChromosome = this.maxChromosome;
            for (var i = 0; i < maxChromosome.rank.length; i++) {
                var rect = this.mSRects[Math.abs(maxChromosome.rank[i]) - 1].clone();
                if (maxChromosome.rank[i] < 0) {
                    rw = rect.w;
                    rect.w = rect.h;
                    rect.h = rw;
                }
                rects.push(rect);
            }
            var llabf = new GA_LLABF.LLABF(rects, width, this.rotFlag);
            llabf.start();
            rects = llabf.Rects;
            for (i = 0; i < maxChromosome.rank.length; i++) {
                if (maxChromosome.rank[i] < 0) {
                    for (var j = 0; j < rects.length; j++) {
                        if (rects[j].id == Math.abs(maxChromosome.rank[i])) {
                            rw = rects[j].w;
                            rects[j].w = rects[j].h;
                            rects[j].h = rw;
                            rects[j].rot = !rects[j].rot;
                        }
                    }
                }
            }
            return rects;
        }

        p.getBestPacH = function () {
            return 1 / this.maxChromosome.fitness;
        }

        p.createChromosome = function () {
            var nbs = [];
            for (var i = 0; i < this.mSRects.length; i++) {
                nbs[i] = i;
            }
            var ranks = [];	//基因序列
            while (nbs.length) {
                var rk = nbs.splice(Math.floor(Math.random() * nbs.length), 1)[0];
                ranks.push(this.mSRects[rk].id);
                if (this.rotFlag && Math.floor(Math.random() * 10) > 4) {
                    ranks[ranks.length - 1] = -ranks[ranks.length - 1];
                }
            }
            var chromesome = new GA_LLABF.Chromosome(0, ranks);
            return chromesome;
        }

        p.createFirstGroup = function () {
            this.group = [];
            for (var i = 0; i < this.groupNum; i++) {
                this.group.push(this.createChromosome());
            }
        }

        p.runGroup = function () {
            var group = this.group;
            for (var i = 0; i < group.length; i++) {
                var ranks = group[i].rank;
                if (this.recordLLABF[ranks.toString()]) {
                    group[i].fitness = this.recordLLABF[ranks.toString()];
                    continue;
                }
                var rects = [];
                for (var r = 0; r < ranks.length; r++) {
                    var rect = this.mSRects[Math.abs(ranks[r]) - 1].clone();
                    if (ranks[r] < 0) {
                        var rw = rect.w;
                        rect.w = rect.h;
                        rect.h = rw;
                    }
                    rects.push(rect);
                }
                var llabf = new GA_LLABF.LLABF(rects, width, rotFlag);
                llabf.start();
                group[i].fitness = 1 / llabf.PacH;
                this.recordLLABF[ranks.toString()] = 1 / llabf.PacH;
                llabf.gc();
            }
        }

        p.createNewGroup = function () {
            var back = [];
            var copy = [];
            var i;
            var group = this.group;
            while (group.length) {
                var max = group[0];
                var maxInd = 0;
                for (i = 1; i < group.length; i++) {
                    if (group[i].fitness > max.fitness) {
                        max = group[i];
                        maxInd = i;
                    }
                }
                group.splice(maxInd, 1);
                copy.push(max);
            }
            this.group = group = copy;
            var ps = [];
            var sun = 0;
            this.chooseC = group[0].fitness;
            for (i = 0; i < group.length; i++) {
                var p = this.chooseC * Math.pow((1 - this.chooseC) / group.length, i);
                sun += p;
                ps.push(p);
                //trace("group"+i+": " + int(1/group[i].fitness) + " 	" + group[i].rank.toString());
            }
            //trace("group: " + int(1/group[0].fitness) + " 	" + group[0].rank.toString());
            for (i = 0; i < group.length; i++) {
                ps[i] = Math.floor(10000000 * ps[i] / sun) / 10000000;
            }
            if (this.maxChromosome == null || group[0].fitness > this.maxChromosome.fitness) {
                this.maxChromosome = group[0].clone();
            }
            var lgp = group[0].clone();
            var newGroup = [];
            var pg;
            while (newGroup.length < this.groupNum) {
                pg = this.choose(ps);	//选择
                //trace("选择:"+pg.length + "	" + pg[0].rank.toString());
                this.crossover(pg);		//交叉
                this.mutation(pg);		//变异
                newGroup = newGroup.concat(pg);
                //trace("结果:"+pg.length + "	" + pg[0].rank.toString());
            }
            this.group = group = group = newGroup;
            var deng = true;
            var dnum = 0;
            /*for(i = 0; i < group.length; i++)
             {
             deng = true;
             for(var j:int = 0; j < lgp.rank.length; j++)
             {
             if(lgp.rank[j] != group[i].rank[j])
             {
             deng = false;
             }
             }
             if(deng){
             dnum++;
             }
             }
             if(dnum)
             trace(group.length+"遗传个数："+dnum);
             else
             trace("没有遗传最优基因！");*/
        }

        /**
         * 选  择 为了避免丢失上一代产生的最佳个体,本文在采用排序选择方法(rank-based select model)的同时,还混合使用了最优保存策略(elitist model).
         * 排序选择方法主要依据个体适应度值之间的大小关系,对个体适应度是否取正值或负值以及个体适应度之间的数值差异程度并无特别要求.
         * 其步骤如下:
         * (1) 对群体中所有个体按照适应度从大到小排序.
         * (2) 根据下列公式计算每个个体的选择概率: ()isP=α×(1−α/m)I, 其中,()isP表示排列在第i个位置的个体的选择概率,m表示群体大小,α为调节参数.
         * (3) 根据步骤(2)计算得出的个体概率值作为其能够被遗传到下一代的概率,基于该值应用比例选择(赌盘选择)的方法产生下一代群体.

         轮盘赌算法
         *
         * 按设定的概率，随机选中一个个体
         * P[i]表示第i个个体被选中的概率
         int RWS()
         {
         m = 0;
         r =Random(0,1); //r为0至1的随机数
         for(i=1;i<=N; i++)
         {
         // 产生的随机数在m~m+P[i]间则认为选中了i
         //  因此i被选中的概率是P[i]
         m = m + P[i];
         if(r<=m) return i;
         }
         }
         */
        var chooseNum = 1;//选择的基因对
        p.choose = function (ps) {
            var cs = [];
            var m;
            var r;
            var i;
            while (cs.length < chooseNum * 2) {
                m = 0;
                r = Math.random(); //r为0至1的随机数
                for (i = 0; i <= ps.length; i++) {
                    // 产生的随机数在m~m+P[i]间则认为选中了i
                    //  因此i被选中的概率是P[i]
                    m = m + ps[i];
                    if (r <= m) {
                        cs.push(this.group[i].clone());
                        if (cs.length == chooseNum * 2) {
                            return cs;
                        }
                    }
                }
            }
            return cs;
        }

        /**
         * 交  叉(crossover)
         * 交叉是产生新个体的主要方法.本文主要采用环形部分交叉(circular-based part crossover):
         * ①随机生成起始交叉点Pcr∈[1,n];
         * ②随机生成交叉长度Lcr∈[1,n];
         * ③将Pcr后的Lcr位基因进行交换,如果Pcr+Lcr>n,则将染色体前Pcr+Lcr−n位基因进行互换;
         * ④然后依次将未出现的基因填入空白基因座.
         */
        p.crossover = function (pg) {
            for (var i = 0; i < pg.length - 1; i++, i++) {
                if (Math.random() < this.crooseP) {
                    var st = Math.random() * pg[i].rank.length;
                    var rn = Math.random() * pg[i].rank.length + 1;
                    var pa = pg[i];
                    var pb = pg[i + 1];
                    var pac = pa.clone();
                    var pbc = pb.clone();
                    var b;
                    var y;
                    var n;
                    var has;
                    var r;
                    //trace("交换:",st,rn);
                    //trace(pg[0].rank.toString());
                    //trace(pg[1].rank.toString());
                    var dn = pa.rank.length >= (st + rn) ? 0 : (st + rn - pa.rank.length);
                    for (b = 0; b < pa.rank.length; b++) {
                        pa.rank[b] = 0;
                        pb.rank[b] = 0;
                    }
                    for (b = 0; b < dn; b++) {
                        pa.rank[b] = pbc.rank[b];
                        pb.rank[b] = pac.rank[b];
                    }
                    for (b = st; b < st + rn && b < pac.rank.length; b++) {
                        pa.rank[b] = pbc.rank[b];
                        pb.rank[b] = pac.rank[b];
                    }
                    //trace(pg[0].rank.toString());
                    //trace(pg[1].rank.toString());
                    for (n = 0; n < pa.rank.length; n++) {
                        if (pa.rank[n] != 0)continue;
                        for (b = 0; b < pac.rank.length; b++) {
                            r = pac.rank[b];
                            has = false;
                            for (y = 0; y < pa.rank.length; y++) {
                                if (Math.abs(pa.rank[y]) == Math.abs(r)) {
                                    has = true;
                                    break;
                                }
                            }
                            if (has == false) {
                                pa.rank[n] = r;
                                break;
                            }
                        }
                    }
                    for (n = 0; n < pb.rank.length; n++) {
                        if (pb.rank[n] != 0)continue;
                        for (b = 0; b < pbc.rank.length; b++) {
                            r = pbc.rank[b];
                            has = false;
                            for (y = 0; y < pb.rank.length; y++) {
                                if (Math.abs(pb.rank[y]) == Math.abs(r)) {
                                    has = true;
                                    break;
                                }
                            }
                            if (has == false) {
                                pb.rank[n] = r;
                                break;
                            }
                        }
                    }
                    //trace(pa.rank.toString());
                    //trace(pb.rank.toString());
                    ///trace(pg[0].rank.toString());
                    //trace(pg[1].rank.toString());
                }
                else {
                    //trace("没交换");
                }
            }
        }

        /**
         * 变  异(mutation)
         * 变异是产生新个体的辅助方法,它决定了遗传算法的局部搜索能力,保持群体的多样性.本文中的变异包括两部分:
         * 一是旋转变异,二是装入序列变异.
         * (1) 旋转变异 旋转变异采用了单点取反和环形部分取反两种方式.
         * 单点取反(single point reversion)变异:
         *    ①随机生成变异点Pmu∈[1,n];
         *    ②取反.例如,对于个体Ij=(π1,π2,…, πi,…,πn),Pmu=i,则变异后产生的新个体为jI′=(π1,π2,…,−πi,…,πn).
         * 环形部分取反(circular-based part reversion)变异:
         *  ①随机生成变异点Pmu∈[1,n]; ②随机生成变异长度Lmu∈[1,n];
         *    ③将Pmu后的Lmu位取反,如果Pmu+Lmu>n,则将染色体首部的Pmu+Lmu−n位基因取反.
         * (2) 装入序列变异 装入序列变异采用了两点位置互换与环形部分逆转两种方式. 两点位置互换(two point exchange)变异:
         *     ①随机生成两个变异点i,j∈[1,n];
         *   ②将两个基因互换.例如:Ij=(π1, π2,…,πi1,…,πi2,…,πn),i1,i2∈[1,n],则变异后产生的新个体为jI′=(π1,π2,…,πi2,…,πi1,…,πn).
         * 环形部分逆转(circular-based part inversion)变异:
         *    ①随机生成变异点Pmu∈[1,n];
         *    ②随机生成变异长度Lmu∈[1,n];
         *    ③将Pmu后的Lmu位逆转,即将(Pmu+i) mod n(即Pmu+i对n取模)与(Pmu+Lmu−i) mod n互换,i∈[0,Lmu/2].
         */
        p.mutation = function (pg) {
            for (var i = 0; i < pg.length; i++) {
                if (Math.random() < this.mutationP) {
                    if (this.rotFlag == false || Math.random() < 0.5) {
                        var st = Math.random() * pg[i].rank.length;
                        var rn = Math.random() * pg[i].rank.length;
                        var ed = (st + rn) % pg[i].rank.length;
                        var ch = pg[i].rank[st];
                        pg[i].rank[st] = pg[i].rank[ed];
                        pg[i].rank[ed] = ch;
                    } else {
                        var rk = Math.floor(Math.random() * pg[i].rank.length);
                        pg[i].rank[rk] *= -1;
                    }
                    //trace("变异"+i+"："+pg[i].rank.toString());
                }
            }
        }

        return GA_LLABF;
    })();
    gallabf.GA_LLABF = GA_LLABF;
})(gallabf || (gallabf = {}));